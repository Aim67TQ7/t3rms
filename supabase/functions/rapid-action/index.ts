
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as pdfjs from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.min.mjs';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check content length
    const contentLength = req.headers.get('content-length');
    const MAX_SIZE = 8 * 1024 * 1024; // 8MB
    
    if (contentLength && parseInt(contentLength) > MAX_SIZE) {
      return new Response(
        JSON.stringify({ error: 'File too large' }), 
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let content = '';
    let fileName = 'document.txt';
    let fileType = 'text/plain';
    
    // Check if request is multipart/form-data or JSON
    const contentType = req.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        
        if (!file) {
          return new Response(
            JSON.stringify({ error: 'No file provided' }), 
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Check file type
        fileName = file.name.toLowerCase();
        if (fileName.endsWith('.pdf')) {
          fileType = 'application/pdf';
        } else if (fileName.endsWith('.txt')) {
          fileType = 'text/plain';
        } else {
          return new Response(
            JSON.stringify({ error: 'Unsupported file type' }), 
            { status: 415, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }

        // Extract text from file
        if (fileName.endsWith('.pdf')) {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          const numPages = pdf.numPages;
          
          for (let i = 1; i <= numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            content += textContent.items.map((item: any) => item.str).join(' ') + '\n';
          }
        } else {
          content = await file.text();
        }
      } catch (error) {
        console.error('Error processing form data:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to process file upload: ' + error.message }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else if (contentType.includes('application/json')) {
      // Handle direct JSON input
      try {
        const body = await req.json();
        content = body.content || '';
        fileName = body.fileName || 'document.txt';
        fileType = body.fileType || 'text/plain';
        
        // If content is base64 encoded, decode it
        if (typeof content === 'string' && content.startsWith('data:')) {
          const base64Content = content.split(',')[1];
          if (base64Content) {
            const decoded = atob(base64Content);
            content = decoded;
          }
        }
      } catch (error) {
        console.error('Error parsing JSON:', error);
        return new Response(
          JSON.stringify({ error: 'Invalid JSON payload: ' + error.message }), 
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Unsupported content type' }), 
        { status: 415, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!content || content.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Empty document content' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Process with AI
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      console.error("Anthropic API key is missing!");
      throw new Error("ANTHROPIC_API_KEY is not set");
    }

    const model = "claude-3-haiku-20240307";
    const apiUrl = "https://api.anthropic.com/v1/messages";

    const headers = {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    };

    const prompt = `You are a legal contract analysis AI. Review the following contract and provide a detailed analysis.
      Identify any potential risks, unusual clauses, and areas of concern. Provide a score from 0-100, with 100 being the least risky.
      Also provide recommendations for improving the contract to reduce risk and protect the user's interests.
      Be concise and specific, referencing the relevant sections of the contract where possible.
      Your response should be formatted as a JSON object with the following keys: overallScore, criticalPoints, financialRisks, unusualLanguage, recommendations.`;

    const data = {
      model: model,
      max_tokens: 2048,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: `${prompt}\n\nContract:\n${content}`,
        },
      ],
    };

    console.log("Sending request to Anthropic API...");
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("Anthropic API error:", response.status, response.statusText, await response.text());
      throw new Error(`Anthropic API request failed with status ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    let result;
    
    try {
      // For structured JSON response format
      if (responseData.content && responseData.content[0] && responseData.content[0].type === 'text') {
        result = JSON.parse(responseData.content[0].text);
      } else if (responseData.content && responseData.content[0] && responseData.content[0].text) {
        // Fallback for older API versions
        result = JSON.parse(responseData.content[0].text);
      } else {
        // Direct parsing for response_format: { type: "json_object" }
        result = responseData;
      }
    } catch (error) {
      console.error("Error parsing AI response:", error);
      throw new Error("Failed to parse AI response");
    }

    return new Response(
      JSON.stringify({ content, analysis: result }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in rapid-action function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
