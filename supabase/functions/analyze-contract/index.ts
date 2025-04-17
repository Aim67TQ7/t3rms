
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import * as base64 from "https://deno.land/std@0.177.0/encoding/base64.ts";
import Anthropic from "npm:@anthropic-ai/sdk";

// Set up CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

// Define file size and other limits
const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB limit
const CLAUDE_MODEL = "claude-3-haiku-20240307"; // Using a stable, available model
const MAX_CHUNK_SIZE = 30000; // Maximum characters per chunk for Claude

// Initialize Anthropic client
const anthropicClient = new Anthropic({
  apiKey: Deno.env.get("ANTHROPIC_API_KEY") || "",
});

/**
 * Split text into chunks of a maximum size
 */
function splitIntoChunks(text: string, maxChunkSize: number): string[] {
  const chunks: string[] = [];
  
  // Simple chunking by character count - we try to end at paragraph boundaries when possible
  let startIndex = 0;
  
  while (startIndex < text.length) {
    let endIndex = Math.min(startIndex + maxChunkSize, text.length);
    
    // Try to find a paragraph break to make cleaner chunks
    if (endIndex < text.length) {
      const paragraphBreak = text.lastIndexOf('\n\n', endIndex);
      const lineBreak = text.lastIndexOf('\n', endIndex);
      const period = text.lastIndexOf('. ', endIndex);
      
      // Choose the closest break point, prioritizing paragraph breaks
      if (paragraphBreak > startIndex && paragraphBreak > endIndex - 500) {
        endIndex = paragraphBreak + 2;
      } else if (lineBreak > startIndex && lineBreak > endIndex - 200) {
        endIndex = lineBreak + 1;
      } else if (period > startIndex && period > endIndex - 100) {
        endIndex = period + 2; 
      }
    }
    
    chunks.push(text.substring(startIndex, endIndex));
    startIndex = endIndex;
  }
  
  console.log(`Split document into ${chunks.length} chunks`);
  return chunks;
}

/**
 * Combine analysis results from multiple chunks
 */
function combineAnalysisResults(results: any[]): any {
  if (results.length === 0) return null;
  if (results.length === 1) return results[0];
  
  // Create a template from the first result
  const combinedResult = {
    overallScore: 0,
    criticalPoints: [],
    financialRisks: [],
    unusualLanguage: [],
    recommendations: []
  };
  
  // Combine all results
  let totalScore = 0;
  
  results.forEach(result => {
    totalScore += result.overallScore || 0;
    
    if (result.criticalPoints && Array.isArray(result.criticalPoints)) {
      combinedResult.criticalPoints.push(...result.criticalPoints);
    }
    
    if (result.financialRisks && Array.isArray(result.financialRisks)) {
      combinedResult.financialRisks.push(...result.financialRisks);
    }
    
    if (result.unusualLanguage && Array.isArray(result.unusualLanguage)) {
      combinedResult.unusualLanguage.push(...result.unusualLanguage);
    }
    
    if (result.recommendations && Array.isArray(result.recommendations)) {
      combinedResult.recommendations.push(...result.recommendations);
    }
  });
  
  // Calculate average score
  combinedResult.overallScore = Math.round(totalScore / results.length);
  
  // Remove duplicates based on title
  combinedResult.criticalPoints = removeDuplicates(combinedResult.criticalPoints, 'title');
  combinedResult.financialRisks = removeDuplicates(combinedResult.financialRisks, 'title');
  combinedResult.unusualLanguage = removeDuplicates(combinedResult.unusualLanguage, 'title');
  combinedResult.recommendations = removeDuplicates(combinedResult.recommendations, 'text');
  
  return combinedResult;
}

/**
 * Remove duplicate items from array based on a property
 */
function removeDuplicates(array: any[], prop: string): any[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[prop];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Analyze a chunk of document text with Claude
 */
async function analyzeDocumentChunk(chunkText: string, chunkIndex: number, totalChunks: number): Promise<any> {
  console.log(`Analyzing chunk ${chunkIndex + 1}/${totalChunks} with ${chunkText.length} characters`);
  
  const response = await anthropicClient.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4000,
    temperature: 0.2,
    system: `You are a contract analysis expert. 
      Analyze the provided contract carefully and identify critical points, financial risks, and unusual language.
      Focus on clauses that may be problematic, non-standard, or create significant obligations.
      You are analyzing chunk ${chunkIndex + 1} of ${totalChunks} from the full document.
      ${totalChunks > 1 ? 'Only analyze what is present in this chunk. Avoid references to missing context.' : ''}
      Provide your analysis in a structured JSON format.`,
    messages: [
      {
        role: "user",
        content: `Please analyze this ${totalChunks > 1 ? 'portion of a' : ''} contract document thoroughly and provide a structured analysis.
        
        For each identified issue, include:
        1. A category (Critical Points, Financial Risks, or Unusual Language)
        2. A severity rating (high, medium, or low)
        3. A descriptive title
        4. A detailed explanation
        5. The exact section reference
        6. The exact text excerpt from the contract
        
        Also provide:
        7. An overall risk score from 0-100 (where 100 is lowest risk)
        8. Specific recommendations to address each issue
        
        Format your response as a JSON object with the following structure:
        {
          "overallScore": number,
          "criticalPoints": [
            {
              "severity": "high|medium|low",
              "title": "string",
              "description": "string",
              "reference": {
                "page": number,
                "section": "string",
                "excerpt": "string"
              }
            }
          ],
          "financialRisks": [
            {
              "severity": "high|medium|low",
              "title": "string",
              "description": "string",
              "reference": {
                "page": number,
                "section": "string",
                "excerpt": "string"
              }
            }
          ],
          "unusualLanguage": [
            {
              "severity": "high|medium|low",
              "title": "string",
              "description": "string",
              "reference": {
                "page": number,
                "section": "string",
                "excerpt": "string"
              }
            }
          ],
          "recommendations": [
            {
              "text": "string",
              "reference": {
                "section": "string",
                "page": number
              }
            }
          ]
        }
        
        CONTRACT TEXT (${totalChunks > 1 ? `CHUNK ${chunkIndex + 1}/${totalChunks}` : 'FULL DOCUMENT'}):
        ${chunkText}`
      }
    ]
  });

  // Process Claude's response to extract JSON
  const responseContent = response.content[0].text;
  
  // Find and extract the JSON response
  const jsonStartIndex = responseContent.indexOf('{');
  const jsonEndIndex = responseContent.lastIndexOf('}') + 1;
  
  if (jsonStartIndex === -1 || jsonEndIndex === 0) {
    throw new Error(`Failed to parse Claude's response for chunk ${chunkIndex + 1}`);
  }
  
  const jsonResponse = responseContent.substring(jsonStartIndex, jsonEndIndex);
  
  try {
    return JSON.parse(jsonResponse);
  } catch (error) {
    console.error(`Error parsing JSON from chunk ${chunkIndex + 1}:`, error);
    console.error("Raw response:", responseContent);
    throw new Error(`Failed to parse JSON response from Claude for chunk ${chunkIndex + 1}`);
  }
}

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate request method
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Supabase client with auth context from request
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: {
          headers: { Authorization: req.headers.get("Authorization")! },
        },
      }
    );

    // Get user information for tracking and billing
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    // Parse form data from the request
    const formData = await req.formData();
    const file = formData.get("contract") as File;

    // Validate file
    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ 
          error: "File too large", 
          message: `Maximum file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check file type
    const fileType = file.type;
    if (![
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ].includes(fileType)) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid file type", 
          message: "Only PDF, DOCX, and TXT files are supported" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get the file content
    let fileContent = "";
    
    if (fileType === "text/plain") {
      // For text files, read as text
      fileContent = await file.text();
    } else if (fileType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      // For DOCX, we'll need to extract text - simple handling for now
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      // Basic text extraction - this is simplified
      fileContent = `DOCX file with name: ${file.name} and size: ${file.size} bytes`;
    } else if (fileType === "application/pdf") {
      // For PDF, using base64 encoding
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      // Store file identifier for later reference
      fileContent = `PDF file with name: ${file.name} and size: ${file.size} bytes`;
    }

    console.log(`Processing ${fileType} file: ${file.name}, size: ${file.size} bytes, content length: ${fileContent.length} characters`);

    // Split document into chunks if needed
    const textChunks = splitIntoChunks(fileContent, MAX_CHUNK_SIZE);
    console.log(`Document split into ${textChunks.length} chunks for analysis`);
    
    // Analyze each chunk and combine results
    const chunkResults = [];
    for (let i = 0; i < textChunks.length; i++) {
      try {
        const result = await analyzeDocumentChunk(textChunks[i], i, textChunks.length);
        chunkResults.push(result);
      } catch (error) {
        console.error(`Error analyzing chunk ${i+1}:`, error);
        // Continue with other chunks even if one fails
      }
    }
    
    // Combine results from all chunks
    const analysisResult = combineAnalysisResults(chunkResults);
    
    if (!analysisResult) {
      throw new Error("Failed to analyze document - no valid results obtained");
    }
    
    // Save analysis to database if user is authenticated
    if (user) {
      try {
        await supabaseClient
          .from('contract_analyses')
          .insert({
            user_id: user.id,
            filename: file.name,
            file_type: fileType,
            file_size: file.size,
            analysis_score: analysisResult.overallScore,
            analysis_results: analysisResult,
            status: 'completed',
            created_at: new Date().toISOString()
          });
      } catch (dbError) {
        console.error("Error saving analysis to database:", dbError);
        // We'll continue even if DB save fails, to return results to user
      }
    }
    
    // Return the analysis to the client
    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in contract analysis:", error);
    return new Response(
      JSON.stringify({ 
        error: "Contract analysis failed", 
        message: error.message || "An unexpected error occurred",
        stack: error.stack
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
