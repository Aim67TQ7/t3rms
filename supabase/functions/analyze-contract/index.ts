
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
 * Extract text from a PDF file
 * Note: This is a simplified approach since we can't fully parse PDFs in Deno
 * For production, consider using a dedicated PDF extraction service
 */
async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  // In a real implementation, you would use a PDF parsing library or service
  // For now, we'll return a placeholder text with file details
  const bytes = new Uint8Array(buffer);
  return `PDF file content placeholder. This is a simplified representation as PDF extraction 
  requires specialized libraries. File size: ${bytes.length} bytes.
  
  For full PDF analysis, consider uploading text content directly or using a TXT export of your document.`;
}

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
    if (!item || typeof item !== 'object') return false;
    const value = item[prop];
    if (seen.has(value)) {
      return false;
    }
    seen.add(value);
    return true;
  });
}

/**
 * Safely parse JSON from a string with robust error handling
 */
function safeJsonParse(text: string): any {
  try {
    // First attempt: direct parsing
    return JSON.parse(text);
  } catch (e) {
    try {
      // Second attempt: find JSON object in text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e2) {
      // Third attempt: try to fix common JSON issues
      try {
        // Replace single quotes with double quotes
        const fixedText = text.replace(/'/g, '"');
        return JSON.parse(fixedText);
      } catch (e3) {
        // If all parsing attempts fail, return a structured error object
        console.error("JSON parsing failed:", e3);
        return {
          error: "Failed to parse JSON",
          rawText: text.substring(0, 200) + "..." // First 200 chars for debugging
        };
      }
    }
  }
}

/**
 * Analyze a chunk of document text with Claude
 */
async function analyzeDocumentChunk(chunkText: string, chunkIndex: number, totalChunks: number): Promise<any> {
  console.log(`Analyzing chunk ${chunkIndex + 1}/${totalChunks} with ${chunkText.length} characters`);

  try {
    const response = await anthropicClient.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      temperature: 0.2,
      system: `You are a contract analysis expert. 
        Analyze the provided contract carefully and identify critical points, financial risks, and unusual language.
        Focus on clauses that may be problematic, non-standard, or create significant obligations.
        You are analyzing chunk ${chunkIndex + 1} of ${totalChunks} from the full document.
        ${totalChunks > 1 ? 'Only analyze what is present in this chunk. Avoid references to missing context.' : ''}
        VERY IMPORTANT: Your entire response must be valid JSON. Do not include any text outside the JSON object.`,
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
          
          Format your response EXCLUSIVELY as a JSON object with the following structure:
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

          IMPORTANT: If the text doesn't appear to be a legal document or contract, please provide a default analysis indicating this, but still in JSON format.
          
          CONTRACT TEXT (${totalChunks > 1 ? `CHUNK ${chunkIndex + 1}/${totalChunks}` : 'FULL DOCUMENT'}):
          ${chunkText}`
        }
      ]
    });

    // Process Claude's response to extract JSON
    const responseContent = response.content[0].text;
    console.log(`Received response for chunk ${chunkIndex + 1}, length: ${responseContent.length} characters`);
    
    // Attempt to parse the JSON response with our robust parser
    const parsedResponse = safeJsonParse(responseContent);
    
    // If we got an error object back, throw an error
    if (parsedResponse.error) {
      throw new Error(`JSON parsing failed: ${parsedResponse.error}`);
    }
    
    return parsedResponse;
  } catch (error) {
    console.error(`Error in chunk ${chunkIndex + 1} analysis:`, error);
    
    // Return a fallback result for this chunk
    return {
      overallScore: 50, // Neutral score
      criticalPoints: [{
        severity: "medium",
        title: `Analysis failed for chunk ${chunkIndex + 1}`,
        description: "The AI model was unable to properly analyze this section of the document. Consider reviewing this section manually.",
        reference: {
          page: 1,
          section: `Chunk ${chunkIndex + 1}`,
          excerpt: chunkText.substring(0, 100) + "..."
        }
      }],
      financialRisks: [],
      unusualLanguage: [],
      recommendations: [{
        text: "Review this section manually as automated analysis failed.",
        reference: {
          section: `Chunk ${chunkIndex + 1}`,
          page: 1
        }
      }]
    };
  }
}

async function handleFileAnalysis(file: File): Promise<any> {
  // Extract text from file based on type
  let fileContent = "";
  
  if (file.type === "text/plain") {
    // For text files, read as text
    fileContent = await file.text();
  } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    // For DOCX, simplified handling with placeholder
    fileContent = `DOCX file content (${file.name}). For best results, please convert to TXT or plain text.`;
  } else if (file.type === "application/pdf") {
    // For PDF, attempt extraction (simplified)
    const buffer = await file.arrayBuffer();
    fileContent = await extractTextFromPDF(buffer);
  }

  console.log(`Extracted content from ${file.type} file: ${file.name}, content length: ${fileContent.length} characters`);
  
  // If we couldn't extract meaningful content, return an error
  if (fileContent.length < 50) {
    throw new Error("Unable to extract sufficient text from the file. Please try a plain text file or convert your document to TXT format.");
  }

  // Split document into chunks if needed
  const textChunks = splitIntoChunks(fileContent, MAX_CHUNK_SIZE);
  console.log(`Document split into ${textChunks.length} chunks for analysis`);
  
  // Analyze each chunk
  const chunkResults = [];
  const chunkPromises = [];
  
  for (let i = 0; i < textChunks.length; i++) {
    // Use Promise.all for parallel processing with a small delay between chunks to avoid rate limits
    const chunkPromise = new Promise<void>(async (resolve) => {
      if (i > 0) {
        // Add a small delay between API calls to avoid rate limits
        await new Promise(r => setTimeout(r, 500 * i));
      }
      
      try {
        const result = await analyzeDocumentChunk(textChunks[i], i, textChunks.length);
        chunkResults.push(result);
      } catch (error) {
        console.error(`Error analyzing chunk ${i+1}:`, error);
        // Add a placeholder result for failed chunks
        chunkResults.push({
          overallScore: 50,
          criticalPoints: [{
            severity: "medium", 
            title: `Analysis error in section ${i+1}`,
            description: "This section could not be analyzed properly. Please review manually.",
            reference: { section: `Section ${i+1}`, page: i+1, excerpt: textChunks[i].substring(0, 100) + "..." }
          }],
          financialRisks: [],
          unusualLanguage: [],
          recommendations: [{ 
            text: "Review this section manually as automated analysis failed.",
            reference: { section: `Section ${i+1}`, page: i+1 }
          }]
        });
      }
      resolve();
    });
    
    chunkPromises.push(chunkPromise);
  }
  
  // Wait for all chunks to be analyzed
  await Promise.all(chunkPromises);
  
  // Combine results from all chunks
  return combineAnalysisResults(chunkResults);
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

    // Check if Anthropic API key is configured
    if (!Deno.env.get("ANTHROPIC_API_KEY")) {
      return new Response(
        JSON.stringify({ 
          error: "Configuration error",
          message: "ANTHROPIC_API_KEY is not configured. Please add this secret in the Supabase dashboard."
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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
    const acceptedTypes = [
      "application/pdf", 
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];
    
    if (!acceptedTypes.includes(fileType)) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid file type", 
          message: "Only PDF, DOCX, and TXT files are supported" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Processing ${fileType} file: ${file.name}, size: ${file.size} bytes`);

    // Track processing request in database for authenticated users
    let analysisId = null;
    if (user) {
      try {
        const { data: recordData, error: recordError } = await supabaseClient
          .from('contract_analyses')
          .insert({
            user_id: user.id,
            filename: file.name,
            file_type: fileType,
            file_size: file.size,
            status: 'processing',
            created_at: new Date().toISOString()
          })
          .select('id')
          .single();
        
        if (recordError) {
          console.error("Error creating analysis record:", recordError);
        } else if (recordData) {
          analysisId = recordData.id;
        }
      } catch (dbError) {
        console.error("Error creating analysis record:", dbError);
        // Continue even if DB save fails
      }
    }

    // Analyze the document
    const analysisResult = await handleFileAnalysis(file);
    
    if (!analysisResult) {
      throw new Error("Failed to analyze document - no valid results obtained");
    }
    
    // Save analysis to database if user is authenticated and we have an analysis ID
    if (user && analysisId) {
      try {
        await supabaseClient
          .from('contract_analyses')
          .update({
            analysis_score: analysisResult.overallScore,
            analysis_results: analysisResult,
            status: 'completed',
            completed_at: new Date().toISOString()
          })
          .eq('id', analysisId);
      } catch (dbError) {
        console.error("Error updating analysis in database:", dbError);
        // Continue even if DB update fails
      }
    }
    
    // Return the analysis to the client
    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in contract analysis:", error);
    
    // More structured error response
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : "";
    
    return new Response(
      JSON.stringify({ 
        error: "Contract analysis failed", 
        message: errorMessage,
        details: errorStack
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
