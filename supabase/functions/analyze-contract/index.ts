
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

          try {
            // For PDF processing, initialize the worker source
            if (typeof window === 'undefined') {
              // Set worker source for PDF.js in Deno environment
              pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.worker.min.mjs';
            }
            
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
            const numPages = pdf.numPages;
            
            // Extract text from all pages
            for (let i = 1; i <= numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              content += textContent.items.map((item: any) => item.str).join(' ') + '\n';
            }
          } catch (pdfError) {
            console.error('PDF processing error:', pdfError);
            // Fallback to basic content extraction
            content = `PDF file (${file.name}). Unable to extract text content due to: ${pdfError.message}`;
          }
          
        } else if (fileName.endsWith('.txt')) {
          fileType = 'text/plain';
          content = await file.text();
        } else {
          return new Response(
            JSON.stringify({ error: 'Unsupported file type' }), 
            { status: 415, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
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

    console.log(`Processing document: ${fileName}, size: ${content.length} characters`);

    // Process with OpenAI API
    const apiKey = Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      console.error("OpenAI API key is missing!");
      return new Response(
        JSON.stringify({ 
          error: true, 
          message: "OPENAI_API_KEY is not set in the Supabase Edge Function environment" 
        }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const model = "gpt-4o-mini";
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    };

    const prompt = `You are a legal contract analysis AI. Review the following contract and provide a detailed analysis.
      Identify any potential risks, unusual clauses, and areas of concern. Provide a score from 0-100, with 100 being the least risky.
      Also provide recommendations for improving the contract to reduce risk and protect the user's interests.
      Be concise and specific, referencing the relevant sections of the contract where possible.
      Your response should be formatted as a JSON object with the following keys: overallScore, criticalPoints, financialRisks, unusualLanguage, recommendations.
      
      Each criticalPoint, financialRisk, and unusualLanguage should include: 
      - title: Short title describing the issue
      - description: Detailed explanation
      - severity: "low", "medium", or "high"
      - reference: { section: "relevant section name", excerpt: "exact text from document" }
      
      For recommendations, include an array of objects with:
      - text: The recommendation text
      - reference: { section: "relevant section" }`;

    console.log(`Sending request to OpenAI API using model: ${model}`);
    
    const data = {
      model: model,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: prompt
        },
        {
          role: "user",
          content: content
        }
      ]
    };

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        console.error("OpenAI API error:", response.status, response.statusText);
        const errorText = await response.text();
        console.error("Error details:", errorText);
        throw new Error(`OpenAI API request failed with status ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      let result;
      
      try {
        // Parse the OpenAI response
        if (responseData.choices && responseData.choices[0] && responseData.choices[0].message) {
          const content = responseData.choices[0].message.content;
          console.log("OpenAI returned content:", content.substring(0, 200) + "...");
          result = JSON.parse(content);
          
          // Log the structure of the result to help with debugging
          console.log("Analysis result structure:", Object.keys(result));
          console.log("Result contains criticalPoints:", Array.isArray(result.criticalPoints) ? result.criticalPoints.length : "not an array");
        } else {
          console.error("Unexpected response format:", JSON.stringify(responseData).substring(0, 500));
          throw new Error("Unexpected response format from OpenAI");
        }
      } catch (error) {
        console.error("Error parsing OpenAI response:", error);
        throw new Error("Failed to parse OpenAI response: " + error.message);
      }

      return new Response(
        JSON.stringify(result), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error("Error calling OpenAI API:", error);
      return new Response(
        JSON.stringify({ error: "Failed to analyze document: " + error.message }), 
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('Error in analyze-contract function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
