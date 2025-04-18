
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
const MIN_CHUNK_SIZE = 1000; // Minimum chunk size to avoid tiny fragments
const RATE_LIMIT_DELAY = 500; // Milliseconds between API calls

// Initialize Anthropic client
const anthropicClient = new Anthropic({
  apiKey: Deno.env.get("ANTHROPIC_API_KEY") || "",
});

/**
 * Enhanced text extraction with better error handling
 */
async function extractTextFromFile(buffer: ArrayBuffer, fileType: string): Promise<string> {
  const decoder = new TextDecoder();
  try {
    if (fileType === 'application/pdf') {
      // Basic PDF text extraction (placeholder for now)
      return extractTextFromPDF(buffer);
    } else {
      // Handle text files directly
      return decoder.decode(buffer);
    }
  } catch (error) {
    console.error('Text extraction error:', error);
    throw new Error(`Failed to extract text from ${fileType} file: ${error.message}`);
  }
}

/**
 * Improved PDF text extraction placeholder
 */
async function extractTextFromPDF(buffer: ArrayBuffer): Promise<string> {
  // For now, return basic text representation
  // TODO: Implement proper PDF parsing
  const bytes = new Uint8Array(buffer);
  return `PDF content (${bytes.length} bytes). PDF parsing will be implemented in future updates.`;
}

/**
 * Enhanced text chunking with smart splitting
 */
function splitIntoChunks(text: string): string[] {
  if (!text || text.trim() === '') {
    return [];
  }
  
  const chunks: string[] = [];
  let currentChunk = '';
  
  try {
    const paragraphs = text.split(/\n\n+/);
    console.log(`Split text into ${paragraphs.length} paragraphs`);

    for (const paragraph of paragraphs) {
      if (currentChunk.length + paragraph.length + 2 <= MAX_CHUNK_SIZE) {
        currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
      } else {
        // If current chunk is not empty and meets minimum size, add it
        if (currentChunk.length >= MIN_CHUNK_SIZE) {
          chunks.push(currentChunk);
        }
        
        // Start new chunk with current paragraph
        if (paragraph.length > MAX_CHUNK_SIZE) {
          // Split long paragraphs by sentences
          const sentences = paragraph.match(/[^.!?]+[.!?]+/g) || [paragraph];
          let sentenceChunk = '';
          
          for (const sentence of sentences) {
            if (sentenceChunk.length + sentence.length <= MAX_CHUNK_SIZE) {
              sentenceChunk += sentence;
            } else {
              if (sentenceChunk) chunks.push(sentenceChunk);
              sentenceChunk = sentence;
            }
          }
          if (sentenceChunk) chunks.push(sentenceChunk);
        } else {
          currentChunk = paragraph;
        }
      }
    }

    if (currentChunk.length >= MIN_CHUNK_SIZE) {
      chunks.push(currentChunk);
    }
  } catch (error) {
    console.error('Error splitting text into chunks:', error);
    // If chunking fails, try to use the whole text as one chunk if it's small enough
    if (text.length <= MAX_CHUNK_SIZE) {
      chunks.push(text);
    } else {
      // Otherwise use the first portion that fits
      chunks.push(text.substring(0, MAX_CHUNK_SIZE));
    }
  }

  console.log(`Split document into ${chunks.length} chunks`);
  return chunks;
}

/**
 * Analyze document chunks with rate limiting
 */
async function analyzeDocumentChunks(chunks: string[]): Promise<any[]> {
  const results = [];
  
  if (chunks.length === 0) {
    // If there are no chunks, return a default error result
    return [{
      error: true,
      message: "No valid text content to analyze",
      severity: "high",
      overallScore: 0,
      criticalPoints: [],
      financialRisks: [],
      unusualLanguage: [],
      recommendations: [{ text: "Please provide a document with valid content to analyze." }]
    }];
  }
  
  for (let i = 0; i < chunks.length; i++) {
    try {
      // Add delay between API calls
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
      
      const result = await analyzeDocumentChunk(chunks[i], i, chunks.length);
      results.push(result);
      
      console.log(`Successfully analyzed chunk ${i + 1}/${chunks.length}`);
    } catch (error) {
      console.error(`Error analyzing chunk ${i + 1}:`, error);
      // Add error result for this chunk
      results.push({
        error: true,
        chunkIndex: i,
        message: error.message,
        severity: "high",
        overallScore: 0
      });
    }
  }
  
  return results;
}

/**
 * Analyze a single chunk with Claude
 */
async function analyzeDocumentChunk(chunkText: string, chunkIndex: number, totalChunks: number): Promise<any> {
  console.log(`Analyzing chunk ${chunkIndex + 1}/${totalChunks} (${chunkText.length} chars)`);

  try {
    const response = await anthropicClient.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      temperature: 0.2,
      system: `You are an expert legal document analyzer. Analyze this document chunk (${chunkIndex + 1}/${totalChunks}) 
        and identify critical points, financial risks, and unusual language. Focus on problematic clauses, 
        non-standard terms, or significant obligations. Return a structured analysis in JSON format.`,
      messages: [{
        role: "user",
        content: `Please analyze this contract text carefully and provide a structured analysis.
          Focus on:
          1. Critical legal points and potential issues
          2. Financial obligations and risks
          3. Unusual or non-standard language
          4. Specific recommendations
          
          Format your response as a JSON object with:
          - overallScore (0-100, higher is better)
          - criticalPoints (array of issues)
          - financialRisks (array of risks)
          - unusualLanguage (array of concerns)
          - recommendations (array of suggestions)
          
          Document text (chunk ${chunkIndex + 1}/${totalChunks}):
          ${chunkText}`
      }]
    });

    const analysisText = response.content[0].text;
    
    // First try to parse as JSON, if that fails, include the raw text
    let result = safeJsonParse(analysisText);
    
    // If JSON parsing failed, add the raw text to the result
    if (result.error) {
      result.content = analysisText;
    }
    
    return result;
  } catch (error) {
    console.error(`Error in chunk analysis:`, error);
    throw new Error(`Failed to analyze chunk ${chunkIndex + 1}: ${error.message}`);
  }
}

/**
 * Improved JSON parsing with better error handling
 */
function safeJsonParse(text: string): any {
  try {
    // First attempt: direct parsing
    return JSON.parse(text);
  } catch (e1) {
    try {
      // Second attempt: find JSON object in text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const jsonText = jsonMatch[0];
        // Replace problematic control characters that might be causing parsing issues
        const cleanJson = jsonText.replace(/[\u0000-\u001F\u007F-\u009F]/g, "");
        return JSON.parse(cleanJson);
      }
    } catch (e2) {
      console.error('JSON parsing failed:', e2);
    }
    // If all parsing attempts fail, return a default object with the raw text
    return {
      error: true,
      message: "Failed to parse analysis results",
      overallScore: 0,
      criticalPoints: [],
      financialRisks: [],
      unusualLanguage: [],
      recommendations: [{ text: "Analysis completed but results couldn't be structured properly." }],
      content: text // Include the raw text
    };
  }
}

/**
 * Combine analysis results with deduplication
 */
function combineAnalysisResults(results: any[]): any {
  if (results.length === 0) {
    // Return default empty analysis if no results
    return {
      overallScore: 0,
      criticalPoints: [],
      financialRisks: [],
      unusualLanguage: [],
      recommendations: [{ text: "No content was analyzed. Please check your document and try again." }],
      errors: [{ message: "No content was analyzed" }]
    };
  }
  
  if (results.length === 1) return results[0];

  const combinedResult = {
    overallScore: 0,
    criticalPoints: [],
    financialRisks: [],
    unusualLanguage: [],
    recommendations: [],
    errors: [],
    content: "" // Store raw content if available
  };

  let totalScore = 0;
  let validResults = 0;
  let hasRawContent = false;

  results.forEach((result, index) => {
    if (result.error) {
      combinedResult.errors.push({
        chunkIndex: index,
        message: result.message
      });
      
      // If this result has raw content from Claude, save it
      if (result.content) {
        combinedResult.content += (combinedResult.content ? "\n\n" : "") + 
          `--- Chunk ${index + 1} Analysis ---\n\n${result.content}`;
        hasRawContent = true;
      }
      
      return;
    }

    totalScore += result.overallScore || 0;
    validResults++;

    // Merge arrays with deduplication
    ['criticalPoints', 'financialRisks', 'unusualLanguage', 'recommendations'].forEach(key => {
      if (Array.isArray(result[key])) {
        combinedResult[key].push(...result[key]);
      }
    });
    
    // If this result has content, add it
    if (result.content) {
      combinedResult.content += (combinedResult.content ? "\n\n" : "") + 
        `--- Chunk ${index + 1} Analysis ---\n\n${result.content}`;
      hasRawContent = true;
    }
  });

  // Calculate average score from valid results
  if (validResults > 0) {
    combinedResult.overallScore = Math.round(totalScore / validResults);
  }

  // Deduplicate arrays
  ['criticalPoints', 'financialRisks', 'unusualLanguage'].forEach(key => {
    combinedResult[key] = removeDuplicates(combinedResult[key], 'title');
  });
  combinedResult.recommendations = removeDuplicates(combinedResult.recommendations, 'text');

  // If we have raw content but no structured data, set generatedText for the formatter
  if (hasRawContent && 
      !combinedResult.criticalPoints.length && 
      !combinedResult.financialRisks.length && 
      !combinedResult.unusualLanguage.length &&
      !combinedResult.recommendations.length) {
    combinedResult.generatedText = combinedResult.content;
  }

  return combinedResult;
}

/**
 * Remove duplicate items based on a property
 */
function removeDuplicates(array: any[], prop: string): any[] {
  const seen = new Set();
  return array.filter(item => {
    if (!item || typeof item !== 'object') return false;
    const value = item[prop];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if the ANTHROPIC_API_KEY is set
    if (!Deno.env.get("ANTHROPIC_API_KEY")) {
      throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
    }

    // Improved request parsing with better error handling
    let requestBody;
    try {
      const contentType = req.headers.get('content-type') || '';
      
      if (contentType.includes('application/json')) {
        requestBody = await req.json();
      } else if (contentType.includes('multipart/form-data')) {
        // Handle form data (not implemented here, would need a form-data parser)
        throw new Error("Multipart form data is not supported yet. Please use JSON format.");
      } else {
        throw new Error(`Unsupported content type: ${contentType}`);
      }
    } catch (parseError) {
      console.error('Request parsing error:', parseError);
      throw new Error(`Failed to parse request: ${parseError.message}`);
    }

    // Validate the request body
    const { content, fileType, fileName } = requestBody || {};
    
    if (!content) {
      throw new Error("Missing required field: content");
    }
    
    if (!fileType) {
      throw new Error("Missing required field: fileType");
    }

    console.log(`Received document: ${fileName}, type: ${fileType}, content length: ${content.length}`);

    // Convert base64 to buffer
    let buffer;
    let text;
    try {
      // Check if content is a data URI
      if (content.startsWith('data:')) {
        const base64Content = content.split(',')[1];
        buffer = base64.decode(base64Content);
        text = new TextDecoder().decode(buffer);
      } else {
        // If it's already text, use it directly
        text = content;
        buffer = new TextEncoder().encode(content);
      }
      
      console.log(`Decoded text length: ${text.length} characters`);
    } catch (decodeError) {
      console.error('Content processing error:', decodeError);
      throw new Error("Invalid content format. Expected base64 encoded content or plain text.");
    }
    
    // Check file size
    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    if (!text || text.trim().length === 0) {
      console.error('Empty text content after decoding');
      // Return a default empty analysis for empty content
      const emptyAnalysis = {
        overallScore: 0,
        criticalPoints: [],
        financialRisks: [],
        unusualLanguage: [],
        recommendations: [{ text: "The document appears to be empty. Please provide a document with content to analyze." }],
        errors: [{ message: "Empty document content" }]
      };
      
      return new Response(JSON.stringify(emptyAnalysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    
    // Split into chunks
    const chunks = splitIntoChunks(text);
    
    // Analyze all chunks
    const results = await analyzeDocumentChunks(chunks);
    
    // Combine results
    const combinedResults = combineAnalysisResults(results);

    return new Response(JSON.stringify(combinedResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-contract function:', error);
    // Return a structured error response with default values
    const errorResponse = {
      error: true,
      message: error.message,
      overallScore: 0,
      criticalPoints: [],
      financialRisks: [],
      unusualLanguage: [],
      recommendations: [{ text: "An error occurred during analysis. Please try again." }],
      errors: [{ message: error.message }]
    };
    
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
