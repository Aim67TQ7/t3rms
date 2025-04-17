
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface GenerateLegalDocRequest {
  policyType: string;
  businessInfo: {
    businessName: string;
    website?: string;
    email: string;
    phone?: string;
    businessDescription: string;
    jurisdiction: string;
    platformType: string;
  };
  options?: {
    includeDisputeResolution?: boolean;
    includeIntellectualProperty?: boolean;
    includeLimitations?: boolean;
    includePrivacyPolicy?: boolean;
    includeProhibitedActivities?: boolean;
    includeTermination?: boolean;
    includeUserContent?: boolean;
  };
  specialConditions?: string;
}

const getPolicyPrompt = (request: GenerateLegalDocRequest): string => {
  const { policyType, businessInfo, options, specialConditions } = request;
  const baseInfo = `
Business Name: ${businessInfo.businessName}
Website: ${businessInfo.website || "N/A"}
Contact Email: ${businessInfo.email}
Phone: ${businessInfo.phone || "N/A"}
Platform Type: ${businessInfo.platformType}
Business Description: ${businessInfo.businessDescription}
Jurisdiction: ${businessInfo.jurisdiction}
`;

  // Add special conditions if provided
  const specialConditionsText = specialConditions ? 
    `\nSpecial Conditions: ${specialConditions}\n` : "";

  // Build policy-specific prompts
  switch (policyType) {
    case "terms":
      return `You are a senior corporate attorney with extensive experience drafting Terms & Conditions for ${businessInfo.platformType} businesses. 
      
Create a comprehensive, legally sound Terms & Conditions document for the following business:

${baseInfo}
${specialConditionsText}

Include the following sections:
${options?.includeDisputeResolution ? "- Detailed dispute resolution procedures\n" : ""}
${options?.includeIntellectualProperty ? "- Intellectual property rights protections\n" : ""}
${options?.includeLimitations ? "- Limitations of liability\n" : ""}
${options?.includeProhibitedActivities ? "- Prohibited activities\n" : ""}
${options?.includeTermination ? "- Termination clauses\n" : ""}
${options?.includeUserContent ? "- User content policies\n" : ""}

Format the document in HTML with appropriate heading tags and paragraph structure. Use formal legal language throughout.

If special conditions were specified above, be sure to incorporate them as standalone clauses with clear legal language.`;

    case "privacy":
      return `You are a senior corporate attorney with expertise in data privacy law. 
      
Create a comprehensive, legally sound Privacy Policy for the following business:

${baseInfo}
${specialConditionsText}

Include sections on data collection, usage, sharing, storage practices, user rights, and compliance with relevant privacy laws based on the jurisdiction.

Format the document in HTML with appropriate heading tags and paragraph structure. Use formal legal language throughout.

If special conditions were specified above, be sure to incorporate them as standalone sections with clear legal language.`;

    case "cookie":
      return `You are a senior corporate attorney specializing in digital compliance and cookie policies.
      
Create a comprehensive, legally sound Cookie Policy for the following business:

${baseInfo}
${specialConditionsText}

Include detailed information about the types of cookies used, their purposes, how users can manage cookies, and relevant compliance information.

Format the document in HTML with appropriate heading tags and paragraph structure. Use formal legal language throughout.

If special conditions were specified above, be sure to incorporate them appropriately.`;

    case "gdpr":
      return `You are a senior corporate attorney specializing in EU data protection law and GDPR compliance.
      
Create a comprehensive, legally sound GDPR Compliance Statement for the following business:

${baseInfo}
${specialConditionsText}

Include sections on data subject rights, data protection measures, legal basis for processing, data retention, international transfers, and data protection officer details if applicable.

Format the document in HTML with appropriate heading tags and paragraph structure. Use formal legal language throughout.

If special conditions were specified above, be sure to incorporate them appropriately.`;

    case "hipaa":
      return `You are a senior healthcare attorney specializing in HIPAA compliance.
      
Create a comprehensive, legally sound HIPAA Compliance Policy for the following business:

${baseInfo}
${specialConditionsText}

Include sections on protected health information handling, security measures, breach notification procedures, patient rights, and compliance mechanisms.

Format the document in HTML with appropriate heading tags and paragraph structure. Use formal legal language throughout.

If special conditions were specified above, be sure to incorporate them appropriately.`;

    case "acceptable-use":
      return `You are a senior corporate attorney specializing in acceptable use policies.
      
Create a comprehensive, legally sound Acceptable Use Policy for the following business:

${baseInfo}
${specialConditionsText}

Include clear guidelines on prohibited uses, content standards, monitoring and enforcement, and consequences of violations.

Format the document in HTML with appropriate heading tags and paragraph structure. Use formal legal language throughout.

If special conditions were specified above, be sure to incorporate them appropriately.`;

    default:
      return `Create a legal document for ${policyType} policy for ${businessInfo.businessName}.
      
Business details:
${baseInfo}
${specialConditionsText}

Format the document in HTML with appropriate heading tags and paragraph structure. Use formal legal language throughout.`;
  }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestData: GenerateLegalDocRequest = await req.json();
    const { policyType } = requestData;

    if (!ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set in environment variables");
    }

    const prompt = getPolicyPrompt(requestData);
    
    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 25000,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const generatedContent = data.content[0].text;

    return new Response(
      JSON.stringify({
        content: generatedContent,
        policyType: policyType
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  } catch (error) {
    console.error("Error in claude-legal-generator function:", error);
    
    return new Response(
      JSON.stringify({
        error: error.message || "Internal server error"
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      }
    );
  }
});
