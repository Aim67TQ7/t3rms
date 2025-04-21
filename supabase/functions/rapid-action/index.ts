
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
        
        // If the content is directly pasted (not base64), use it as is
        console.log(`Received text content, length: ${content.length}`);
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

    // Using gpt-4o for more thorough risk analysis
    const model = "gpt-4o";
    const apiUrl = "https://api.openai.com/v1/chat/completions";

    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`,
    };

    const prompt = `You are a legal contract analysis AI. Review the following contract and provide a detailed analysis.
      Identify any potential risks, unusual clauses, and areas of concern. 
      Be thorough and scan for financial risks, liability limits, indemnification clauses, and termination conditions.
      Provide a score from 0-100, with 100 being the least risky and 0 being extremely risky.
      Be very critical and cautious - flag anything that could be problematic, ambiguous, or one-sided.
      
      For financial risks, be extremely detailed and specific:
      - Identify any monetary values, percentages, payment terms, liability caps, penalties, damage amounts or financial obligations
      - Always provide specific details about the financial implications, not just generic descriptions
      - Use descriptive titles for each financial risk that clearly communicate the specific issue
      - Give each financial risk a severity rating (high/medium/low)
      - Always include section references and direct quotes from the contract when possible
      - If you identify any financial terms, capture them as a financial risk, even if they seem standard
      
      For critical points:
      - Each critical point should have a clear, descriptive title that summarizes the specific issue
      - Include direct quotes and section references for all critical points
      - Identify sections that are ambiguous, one-sided, or could expose a party to undue risk
      
      Your response MUST be formatted as a JSON object with the following keys:
      - overallScore: number between 0-100
      - criticalPoints: array of objects with {title, description, severity (high/medium/low), reference: {section, excerpt}}
      - financialRisks: array of objects with {title, description, severity, implications (monetary impact), reference: {section, excerpt}}
      - unusualLanguage: array of objects with {title, description, severity, reference: {section, excerpt}}
      - recommendations: array of objects with {text, reference (optional)}
      
      Be thorough in identifying financial risks - even standard payment terms should be listed with specific details.
      Make sure the output is valid JSON with no trailing commas or syntax errors.`;

    console.log(`Sending request to OpenAI API using model: ${model}`);
    
    const data = {
      model: model,
      temperature: 0.0, // Lower temperature for more deterministic output
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

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      console.error("OpenAI API error:", response.status, response.statusText, await response.text());
      throw new Error(`OpenAI API request failed with status ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();
    let result;
    
    try {
      // Parse the OpenAI response
      if (responseData.choices && responseData.choices[0] && responseData.choices[0].message) {
        const messageContent = responseData.choices[0].message.content;
        console.log("Received OpenAI response:", messageContent.substring(0, 200) + "...");
        
        try {
          // First attempt: direct parsing
          result = JSON.parse(messageContent);
        } catch (parseError) {
          console.error("Error parsing JSON response:", parseError);
          
          // Second attempt: try to extract JSON from text
          try {
            const jsonMatch = messageContent.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const extractedJson = jsonMatch[0];
              result = JSON.parse(extractedJson);
            } else {
              throw new Error("Could not extract JSON from response");
            }
          } catch (extractError) {
            console.error("Failed to extract JSON:", extractError);
            
            // Fallback: create a structured result from the text
            result = {
              overallScore: 50, // Default middle score
              criticalPoints: [{
                title: "AI Parse Error",
                description: "The AI generated an invalid JSON response. Please try analyzing again or with a different model.",
                severity: "medium",
                reference: { section: "N/A", excerpt: "N/A" }
              }],
              financialRisks: [],
              unusualLanguage: [],
              recommendations: [{
                text: "Retry the analysis or use a different document format."
              }],
              rawResponse: messageContent // Include the raw response for debugging
            };
          }
        }
      } else {
        throw new Error("Unexpected response format from OpenAI");
      }
      
      // Validate and normalize the result structure
      result = ensureValidResponseStructure(result);
      
    } catch (error) {
      console.error("Error processing OpenAI response:", error);
      result = {
        error: true,
        message: "Failed to process AI response: " + error.message,
        overallScore: 0,
        criticalPoints: [],
        financialRisks: [],
        unusualLanguage: [],
        recommendations: [{ text: "An error occurred during analysis. Please try again." }]
      };
    }

    return new Response(
      JSON.stringify(result), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in rapid-action function:', error);
    return new Response(
      JSON.stringify({ 
        error: true, 
        message: error.message,
        overallScore: 0,
        criticalPoints: [],
        financialRisks: [],
        unusualLanguage: [],
        recommendations: [{ text: "An error occurred during analysis. Please try again." }]
      }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to ensure response has the expected structure
function ensureValidResponseStructure(data: any) {
  const result = { ...data };
  
  // Ensure all required arrays exist
  if (!Array.isArray(result.criticalPoints)) result.criticalPoints = [];
  if (!Array.isArray(result.financialRisks)) result.financialRisks = [];
  if (!Array.isArray(result.unusualLanguage)) result.unusualLanguage = [];
  if (!Array.isArray(result.recommendations)) result.recommendations = [];
  
  // Ensure overallScore is a number between 0-100
  result.overallScore = typeof result.overallScore === 'number' 
    ? Math.max(0, Math.min(100, result.overallScore)) 
    : 50;
  
  // Normalize structure of array items
  const normalizeItem = (item: any) => {
    if (!item) return null;
    
    // If item is a string, create a structured object
    if (typeof item === 'string') {
      return {
        title: item.split('.')[0] || "Issue",
        description: item,
        severity: "medium",
        reference: {
          section: null,
          excerpt: null
        }
      };
    }
    
    return {
      title: item.title || item.issue || item.risk || "Unnamed Issue",
      description: item.description || item.issue || item.risk || item.language || "No description provided",
      severity: ["high", "medium", "low"].includes(item.severity?.toLowerCase?.()) 
        ? item.severity.toLowerCase() 
        : "medium",
      reference: {
        section: item.reference?.section || item.section || null,
        excerpt: item.reference?.excerpt || item.excerpt || null
      }
    };
  };
  
  // Enhanced normalization for financial risks to include implications
  const normalizeFinancialRisk = (item: any) => {
    if (!item) return null;
    
    // If item is a string, create a structured financial risk object
    if (typeof item === 'string') {
      // Look for dollar amounts or percentages to highlight in the title
      const moneyPattern = /\$\d+(?:,\d+)*(?:\.\d+)?|\d+%|\d+ percent/;
      const moneyMatch = item.match(moneyPattern);
      
      let title = "Financial Risk";
      if (moneyMatch) {
        title = `Financial Risk: ${moneyMatch[0]}`;
      } else if (item.length > 50) {
        title = item.substring(0, 47) + "...";
      } else {
        title = item;
      }
      
      return {
        title: title,
        description: item,
        severity: "high",
        implications: "Financial implications may apply",
        reference: {
          section: null,
          excerpt: null
        }
      };
    }
    
    const normalizedItem = normalizeItem(item);
    
    // Add financial implications if available
    normalizedItem.implications = item.implications || item.financialImplications || item.impact || 
      "Potential financial impact not specified";
    
    // Enhance title if it's too generic
    if (normalizedItem.title === "Financial Risk" || normalizedItem.title === "Unnamed Issue") {
      // Look for specific terms in the description to create a more descriptive title
      const description = normalizedItem.description.toLowerCase();
      if (description.includes("payment")) {
        normalizedItem.title = "Payment Terms Risk";
      } else if (description.includes("termination")) {
        normalizedItem.title = "Early Termination Fee Risk";
      } else if (description.includes("liability")) {
        normalizedItem.title = "Liability Limitation Risk";
      } else if (description.includes("indemnification") || description.includes("indemnify")) {
        normalizedItem.title = "Indemnification Risk";
      } else if (description.includes("penalty")) {
        normalizedItem.title = "Financial Penalty Risk";
      } else if (description.includes("fee")) {
        normalizedItem.title = "Unexpected Fee Risk";
      } else if (normalizedItem.reference && normalizedItem.reference.section) {
        normalizedItem.title = `Financial Risk in ${normalizedItem.reference.section}`;
      }
    }
    
    return normalizedItem;
  };
  
  // Normalize each array
  result.criticalPoints = result.criticalPoints
    .map(normalizeItem)
    .filter(Boolean);
    
  result.financialRisks = result.financialRisks
    .map(normalizeFinancialRisk)
    .filter(Boolean);
    
  result.unusualLanguage = result.unusualLanguage
    .map(normalizeItem)
    .filter(Boolean);
    
  // Normalize recommendations
  result.recommendations = result.recommendations
    .map((rec: any) => {
      if (!rec) return null;
      
      // If recommendation is a string, create a structured object
      if (typeof rec === 'string') {
        return {
          text: rec,
          reference: null
        };
      }
      
      return {
        text: rec.text || rec.recommendation || "No recommendation text",
        reference: rec.reference ? {
          section: rec.reference.section || null,
          excerpt: rec.reference.excerpt || null
        } : null
      };
    })
    .filter(Boolean);

  // Ensure at least one financial risk is present if none were identified but text contains certain keywords
  if (result.financialRisks.length === 0 && result.criticalPoints.length > 0) {
    // Check if any critical points might be financial in nature
    const potentialFinancialPoints = result.criticalPoints.filter(point => 
      point.description.toLowerCase().includes('payment') ||
      point.description.toLowerCase().includes('fee') ||
      point.description.toLowerCase().includes('cost') ||
      point.description.toLowerCase().includes('price') ||
      point.description.toLowerCase().includes('dollar') ||
      point.description.toLowerCase().includes('$') ||
      point.description.toLowerCase().includes('budget') ||
      point.description.toLowerCase().includes('expense') ||
      point.description.toLowerCase().includes('liability')
    );
    
    // If we found potential financial risks in critical points, add them to financial risks
    if (potentialFinancialPoints.length > 0) {
      potentialFinancialPoints.forEach(point => {
        result.financialRisks.push({
          ...point,
          title: `Financial Risk: ${point.title}`,
          implications: 'Potential financial impact identified from critical issue'
        });
      });
    }
  }
  
  return result;
}
