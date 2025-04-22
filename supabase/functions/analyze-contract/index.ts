// Combined Claude + GPT-4o Contract Analyzer
// Supports: JSON & File Uploads, PDF Parsing, Model Switching, and Unified Output
// Flags: forceClaude, forceGPT

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as pdfjs from 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.0.379/build/pdf.min.mjs';
import Anthropic from "npm:@anthropic-ai/sdk";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Authorization, X-Client-Info, apikey, Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400"
};

const CLAUDE_MODEL = "claude-3-haiku-20240307";
const MAX_CHUNK_SIZE = 30000;
const MIN_CHUNK_SIZE = 1000;
const RATE_LIMIT_DELAY = 500;

const anthropicClient = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") || "" });
const openaiKey = Deno.env.get("OPENAI_API_KEY") || "";

function splitIntoChunks(text) {
  if (!text || text.trim() === '') return [];
  const chunks = [];
  let currentChunk = '';
  const paragraphs = text.split(/\n\n+/);
  for (const paragraph of paragraphs) {
    if (currentChunk.length + paragraph.length + 2 <= MAX_CHUNK_SIZE) {
      currentChunk += (currentChunk ? '\n\n' : '') + paragraph;
    } else {
      if (currentChunk.length >= MIN_CHUNK_SIZE) chunks.push(currentChunk);
      if (paragraph.length > MAX_CHUNK_SIZE) {
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
  if (currentChunk.length >= MIN_CHUNK_SIZE) chunks.push(currentChunk);
  return chunks;
}

async function analyzeWithClaude(text) {
  const chunks = splitIntoChunks(text);
  const results = [];
  for (let i = 0; i < chunks.length; i++) {
    if (i > 0) await new Promise(r => setTimeout(r, RATE_LIMIT_DELAY));
    const chunk = chunks[i];
    const response = await anthropicClient.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4000,
      temperature: 0.2,
      system: `You are a contract analyzer. Return JSON only.`,
      messages: [{
        role: "user",
        content: `Analyze chunk ${i + 1}/${chunks.length}: \"\"\"${chunk}\"\"\"`
      }]
    });
    const parsed = safeJsonParse(response.content[0].text);
    results.push(parsed);
  }
  return combineResults(results);
}

async function analyzeWithGPT(content) {
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${openaiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0.0,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a legal contract analyzer. Return detailed financial risks and critical points. Output must be JSON.`
        },
        {
          role: "user",
          content: content
        }
      ]
    })
  });

  const result = await response.json();
  const raw = result.choices?.[0]?.message?.content;
  return safeJsonParse(raw);
}

function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    try {
      const match = text.match(/\{[\s\S]*\}/);
      return JSON.parse(match?.[0] || '{}');
    } catch {
      return { error: true, message: "Invalid JSON response", raw: text };
    }
  }
}

function combineResults(results) {
  const combined = {
    overallScore: 0,
    criticalPoints: [],
    financialRisks: [],
    unusualLanguage: [],
    recommendations: [],
    errors: [],
    rawContent: ""
  };
  let totalScore = 0, valid = 0;
  for (const r of results) {
    if (r.error) {
      combined.errors.push(r.message);
      combined.rawContent += r.raw || "";
    } else {
      valid++;
      totalScore += r.overallScore || 0;
      ["criticalPoints", "financialRisks", "unusualLanguage", "recommendations"].forEach(k => {
        if (Array.isArray(r[k])) combined[k].push(...r[k]);
      });
    }
  }
  combined.overallScore = valid ? Math.round(totalScore / valid) : 50;
  return combined;
}

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let content = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const text = await page.getTextContent();
    content += text.items.map((item) => item.str).join(' ') + '\n';
  }
  return content;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  let content = '', fileType = 'text/plain';
  let forceClaude = false, forceGPT = false;

  const contentType = req.headers.get('content-type') || '';
  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const file = form.get('file');
    const flag = form.get('llm');
    forceClaude = flag === 'claude';
    forceGPT = flag === 'gpt';
    if (file.name.endsWith('.pdf')) {
      fileType = 'application/pdf';
      content = await extractTextFromPDF(file);
    } else {
      content = await file.text();
    }
  } else if (contentType.includes('application/json')) {
    const body = await req.json();
    content = body.content || '';
    fileType = body.fileType || 'text/plain';
    forceClaude = body.forceClaude || false;
    forceGPT = body.forceGPT || false;
  } else {
    return new Response(JSON.stringify({ error: 'Unsupported content type' }), {
      status: 415,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  if (!content || content.trim() === '') {
    return new Response(JSON.stringify({ error: 'Empty content' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    let result;
    if (forceClaude || (!forceGPT && content.length > 12000)) {
      result = await analyzeWithClaude(content);
    } else {
      result = await analyzeWithGPT(content);
    }
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: true,
      message: err.message || 'Unexpected error',
      overallScore: 0,
      criticalPoints: [],
      financialRisks: [],
      unusualLanguage: [],
      recommendations: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
