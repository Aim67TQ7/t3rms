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

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return new Response(
        JSON.stringify({ error: 'No file provided' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check file type
    const filename = file.name.toLowerCase();
    if (!filename.endsWith('.pdf') && !filename.endsWith('.txt')) {
      return new Response(
        JSON.stringify({ error: 'Unsupported file type' }), 
        { status: 415, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let content = '';
    
    if (filename.endsWith('.pdf')) {
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

    // Process with AI
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      console.error("Anthropic API key is missing!");
      throw new Error("ANTHROPIC_API_KEY is not set");
    }

    const model = "claude-3-opus-20240229";
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
      messages: [
        {
          role: "user",
          content: `${prompt}\n\nContract:\n${content}`,
        },
      ],
    };

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
    const result = JSON.parse(responseData.content[0].text);

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
