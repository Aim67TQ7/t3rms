
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
  const chunks: string[] = [];
  let currentChunk = '';
  const paragraphs = text.split(/\n\n+/);

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

  console.log(`Split document into ${chunks.length} chunks`);
  return chunks;
}

/**
 * Analyze document chunks with rate limiting
 */
async function analyzeDocumentChunks(chunks: string[]): Promise<any[]> {
  const results = [];
  
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
    return safeJsonParse(analysisText);
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
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e2) {
      console.error('JSON parsing failed:', e2);
      throw new Error('Failed to parse analysis results');
    }
  }
}

/**
 * Combine analysis results with deduplication
 */
function combineAnalysisResults(results: any[]): any {
  if (results.length === 0) return null;
  if (results.length === 1) return results[0];

  const combinedResult = {
    overallScore: 0,
    criticalPoints: [],
    financialRisks: [],
    unusualLanguage: [],
    recommendations: [],
    errors: []
  };

  let totalScore = 0;
  let validResults = 0;

  results.forEach((result, index) => {
    if (result.error) {
      combinedResult.errors.push({
        chunkIndex: index,
        message: result.message
      });
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
    const { content, fileType, fileName } = await req.json();

    // Convert base64 to buffer
    const buffer = base64.decode(content.split(',')[1]);
    
    // Check file size
    if (buffer.length > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
    }

    // Extract text from file
    const text = await extractTextFromFile(buffer, fileType);
    
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
    return new Response(JSON.stringify({
      error: true,
      message: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
