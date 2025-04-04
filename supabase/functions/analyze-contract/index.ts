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
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB limit
const MAX_CLAUDE_CHUNK_SIZE = 20 * 1024 * 1024; // 20MB max chunk for Claude API
const MAX_PAGES_PER_CHUNK = 40; // Maximum pages to process in a single API call
const CLAUDE_MODEL = "claude-3-7-sonnet-20250219"; // Latest Claude model for best results

// Initialize Anthropic client
const anthropicClient = new Anthropic({
  apiKey: Deno.env.get("ANTHROPIC_API_KEY") || "",
  // Add beta header for PDF support
  defaultHeaders: {
    "anthropic-beta": "pdfs-2024-09-25"
  }
});

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
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

    if (userError) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

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

    // Get the file content as bytes
    const fileBytes = await file.arrayBuffer();
    
    if (fileType === "application/pdf") {
      // Use background task feature to handle large PDFs
      // This allows function to continue running beyond request-response cycle
      const loadingResponse = JSON.stringify({ 
        status: "processing", 
        message: "PDF analysis started. For large documents, this may take a few minutes." 
      });

      // Create a UUID for this analysis job to track it
      const analysisId = crypto.randomUUID();
      
      // Store the initial status in Supabase
      await supabaseClient
        .from('contract_analyses')
        .insert({
          id: analysisId,
          user_id: user?.id,
          filename: file.name,
          file_type: fileType,
          file_size: file.size,
          status: 'processing',
          created_at: new Date().toISOString()
        });

      // Begin processing in background
      const processingPromise = processPdfInChunks(fileBytes, analysisId, file.name, user?.id, supabaseClient);
      
      // Use EdgeRuntime.waitUntil to keep function running after response is sent
      // @ts-ignore - EdgeRuntime is available in Supabase Edge Functions
      EdgeRuntime.waitUntil(processingPromise);
      
      // Return immediate response to client with job ID
      return new Response(
        JSON.stringify({ 
          status: "processing", 
          message: "PDF analysis started",
          analysisId: analysisId 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } else {
      // For DOCX and TXT, we can process directly as they're typically smaller
      const decoder = new TextDecoder();
      const fileContent = decoder.decode(new Uint8Array(fileBytes));
      
      const result = await analyzeTextDocument(fileContent);
      
      // Log the analysis in Supabase
      await supabaseClient
        .from('contract_analyses')
        .insert({
          user_id: user?.id,
          filename: file.name,
          file_type: fileType,
          file_size: file.size,
          analysis_score: result.overallScore,
          analysis_results: result,
          status: 'completed',
          created_at: new Date().toISOString()
        });
      
      // Return the analysis to the client
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
  } catch (error) {
    console.error("Error in contract analysis:", error);
    return new Response(
      JSON.stringify({ 
        error: "Contract analysis failed", 
        message: error.message || "An unexpected error occurred" 
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Process a large PDF document by breaking it into chunks
 * and analyzing each chunk separately, then combining the results.
 */
async function processPdfInChunks(
  fileBytes: ArrayBuffer, 
  analysisId: string,
  filename: string,
  userId: string | undefined,
  supabaseClient: any
): Promise<void> {
  try {
    // For large PDFs, we need to determine if we need to chunk it
    // We'll use PDF.js or a similar library to get page count
    // Simplified placeholder logic:
    const totalFileSize = fileBytes.byteLength;
    const estimatedPageCount = Math.ceil(totalFileSize / 100000); // Rough estimate
    
    // Convert entire PDF to base64 - we'll extract chunks as needed
    const base64EncodedPdf = base64.encode(new Uint8Array(fileBytes));
    
    let combinedResults: any = {
      overallScore: 0,
      criticalPoints: [],
      financialRisks: [],
      unusualLanguage: [],
      recommendations: []
    };
    
    // Update status to processing
    await updateAnalysisStatus(analysisId, 'chunking', supabaseClient);
    
    if (estimatedPageCount <= MAX_PAGES_PER_CHUNK) {
      // If PDF is small enough, process it in one go
      const result = await analyzeEntirePdf(base64EncodedPdf);
      combinedResults = result;
    } else {
      // For large PDFs, we need to chunk it
      // In a real implementation, you would extract page ranges
      // Here's a simplified version assuming we can analyze by page ranges
      
      // Calculate number of chunks needed
      const chunkCount = Math.ceil(estimatedPageCount / MAX_PAGES_PER_CHUNK);
      
      // Process each chunk and collect results
      const chunkPromises = [];
      
      for (let i = 0; i < chunkCount; i++) {
        const startPage = i * MAX_PAGES_PER_CHUNK + 1;
        const endPage = Math.min((i + 1) * MAX_PAGES_PER_CHUNK, estimatedPageCount);
        
        // Update status with current chunk
        await updateAnalysisStatus(
          analysisId, 
          `processing_chunk_${i+1}_of_${chunkCount}`, 
          supabaseClient
        );
        
        // In a real implementation, you would extract just these pages
        // For this example, we'll send the full PDF but tell Claude to focus on specific pages
        const chunkResult = await analyzePdfChunk(base64EncodedPdf, startPage, endPage);
        
        // Merge chunk results into combined results
        combinedResults.criticalPoints.push(...chunkResult.criticalPoints);
        combinedResults.financialRisks.push(...chunkResult.financialRisks);
        combinedResults.unusualLanguage.push(...chunkResult.unusualLanguage);
        combinedResults.recommendations.push(...chunkResult.recommendations);
      }
      
      // Now do a final pass to get an overall score and reconcile any overlaps
      // Update status to final analysis
      await updateAnalysisStatus(analysisId, 'finalizing', supabaseClient);
      
      // Calculate overall score based on all findings
      combinedResults.overallScore = calculateOverallScore(combinedResults);
    }
    
    // Update Supabase with final results
    await supabaseClient
      .from('contract_analyses')
      .update({
        analysis_results: combinedResults,
        analysis_score: combinedResults.overallScore,
        status: 'completed',
        completed_at: new Date().toISOString()
      })
      .eq('id', analysisId);
      
  } catch (error) {
    console.error("Error processing PDF in chunks:", error);
    
    // Update Supabase with error
    await supabaseClient
      .from('contract_analyses')
      .update({
        status: 'error',
        error_message: error.message || "An unexpected error occurred during processing",
        completed_at: new Date().toISOString()
      })
      .eq('id', analysisId);
  }
}

/**
 * Calculate an overall risk score based on all findings.
 */
function calculateOverallScore(results: any): number {
  // Start with a perfect score
  let score = 100;
  
  // Count the number of issues by severity
  const highSeverityCount = 
    results.criticalPoints.filter((item: any) => item.severity === 'high').length +
    results.financialRisks.filter((item: any) => item.severity === 'high').length +
    results.unusualLanguage.filter((item: any) => item.severity === 'high').length;
    
  const mediumSeverityCount = 
    results.criticalPoints.filter((item: any) => item.severity === 'medium').length +
    results.financialRisks.filter((item: any) => item.severity === 'medium').length +
    results.unusualLanguage.filter((item: any) => item.severity === 'medium').length;
    
  const lowSeverityCount = 
    results.criticalPoints.filter((item: any) => item.severity === 'low').length +
    results.financialRisks.filter((item: any) => item.severity === 'low').length +
    results.unusualLanguage.filter((item: any) => item.severity === 'low').length;
  
  // Deduct points based on severity
  score -= highSeverityCount * 10;  // 10 points per high severity issue
  score -= mediumSeverityCount * 5; // 5 points per medium severity issue
  score -= lowSeverityCount * 2;    // 2 points per low severity issue
  
  // Ensure score doesn't go below 0
  return Math.max(0, score);
}

/**
 * Update the status of an analysis job in the database.
 */
async function updateAnalysisStatus(analysisId: string, status: string, supabaseClient: any): Promise<void> {
  await supabaseClient
    .from('contract_analyses')
    .update({
      status: status,
      updated_at: new Date().toISOString()
    })
    .eq('id', analysisId);
}

/**
 * Analyze a text-based document (DOCX or TXT).
 */
async function analyzeTextDocument(fileContent: string): Promise<any> {
  const response = await anthropicClient.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4000,
    temperature: 0.2,
    system: `You are a contract analysis expert. 
      Analyze the provided contract carefully and identify critical points, financial risks, and unusual language.
      Focus on clauses that may be problematic, non-standard, or create significant obligations.
      Provide your analysis in a structured format.`,
    messages: [
      {
        role: "user",
        content: `Please analyze this contract document thoroughly and provide a structured analysis.
        
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
        
        CONTRACT TEXT:
        ${fileContent}`
      }
    ]
  });

  // Process Claude's response to extract JSON
  const responseContent = response.content[0].text;
  
  // Find and extract the JSON response
  const jsonStartIndex = responseContent.indexOf('{');
  const jsonEndIndex = responseContent.lastIndexOf('}') + 1;
  
  if (jsonStartIndex === -1 || jsonEndIndex === 0) {
    throw new Error("Failed to parse Claude's response");
  }
  
  const jsonResponse = responseContent.substring(jsonStartIndex, jsonEndIndex);
  
  // Parse and return the JSON
  return JSON.parse(jsonResponse);
}

/**
 * Analyze an entire PDF document in one API call.
 */
async function analyzeEntirePdf(base64EncodedPdf: string): Promise<any> {
  const response = await anthropicClient.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4000,
    temperature: 0.2,
    system: `You are a contract analysis expert. 
      Analyze the provided contract carefully and identify critical points, financial risks, and unusual language.
      Focus on clauses that may be problematic, non-standard, or create significant obligations.
      Provide your analysis in a structured format with precise references to the specific page numbers and sections.`,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Please analyze this contract document thoroughly and provide a structured analysis.
            
            For each identified issue, include:
            1. A category (Critical Points, Financial Risks, or Unusual Language)
            2. A severity rating (high, medium, or low)
            3. A descriptive title
            4. A detailed explanation
            5. The exact page number and section reference
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
            }`
          },
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: base64EncodedPdf
            }
          }
        ]
      }
    ]
  });

  // Process Claude's response to extract JSON
  const responseContent = response.content[0].text;
  
  // Find and extract the JSON response
  const jsonStartIndex = responseContent.indexOf('{');
  const jsonEndIndex = responseContent.lastIndexOf('}') + 1;
  
  if (jsonStartIndex === -1 || jsonEndIndex === 0) {
    throw new Error("Failed to parse Claude's response");
  }
  
  const jsonResponse = responseContent.substring(jsonStartIndex, jsonEndIndex);
  
  // Parse and return the JSON
  return JSON.parse(jsonResponse);
}

/**
 * Analyze a specific page range from a PDF document.
 */
async function analyzePdfChunk(base64EncodedPdf: string, startPage: number, endPage: number): Promise<any> {
  const response = await anthropicClient.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 4000,
    temperature: 0.2,
    system: `You are a contract analysis expert. 
      Analyze the provided contract carefully and identify critical points, financial risks, and unusual language.
      Focus only on pages ${startPage} through ${endPage} of the document.
      Focus on clauses that may be problematic, non-standard, or create significant obligations.
      Provide your analysis in a structured format with precise references to the specific page numbers and sections.`,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `Please analyze ONLY pages ${startPage} through ${endPage} of this contract document and provide a structured analysis.
            
            For each identified issue, include:
            1. A category (Critical Points, Financial Risks, or Unusual Language)
            2. A severity rating (high, medium, or low)
            3. A descriptive title
            4. A detailed explanation
            5. The exact page number and section reference
            6. The exact text excerpt from the contract
            
            Do NOT provide an overall risk score for this chunk.
            
            Format your response as a JSON object with the following structure:
            {
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
            }`
          },
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: base64EncodedPdf
            }
          }
        ]
      }
    ]
  });

  // Process Claude's response to extract JSON
  const responseContent = response.content[0].text;
  
  // Find and extract the JSON response
  const jsonStartIndex = responseContent.indexOf('{');
  const jsonEndIndex = responseContent.lastIndexOf('}') + 1;
  
  if (jsonStartIndex === -1 || jsonEndIndex === 0) {
    throw new Error("Failed to parse Claude's response");
  }
  
  const jsonResponse = responseContent.substring(jsonStartIndex, jsonEndIndex);
  
  // Parse and return the JSON, adding an empty overallScore property
  const result = JSON.parse(jsonResponse);
  result.overallScore = 0; // Will be calculated later when combining chunks
  
  return result;
}
