
export const formatAnalysisResults = (results: any): string => {
  if (!results) return 'No analysis results available.';
  
  let markdown = '';
  
  // Try to extract nested JSON if it exists in the content field
  let processedResults = { ...results };
  if (results.content && typeof results.content === 'string') {
    try {
      const jsonMatch = results.content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const extractedData = JSON.parse(jsonMatch[0]);
        // Merge the extracted data with existing data, prioritizing existing data
        processedResults = { ...extractedData, ...results };
        console.log("Extracted JSON data from content:", extractedData);
      }
    } catch (error) {
      console.error("Error extracting JSON from content:", error);
    }
  }
  
  // Add overall score
  if (processedResults.overallScore !== undefined) {
    markdown += `# Overall Document Score: ${processedResults.overallScore}/100\n\n`;
  } else {
    markdown += `# Analysis Results\n\n`;
  }
  
  // Add sampling note for large documents
  if (processedResults.documentApproach === "sampled" && processedResults.samplingNote) {
    markdown += `> ⚠️ ${processedResults.samplingNote}\n\n`;
  }
  
  // Add any errors that occurred during analysis
  if (processedResults.errors && processedResults.errors.length > 0) {
    markdown += '## Analysis Warnings\n\n';
    processedResults.errors.forEach((error: any) => {
      markdown += `⚠️ ${error.message || 'Unknown error'}\n`;
    });
    markdown += '\n';
  }

  // Format critical points - handle both object and string array formats
  if (processedResults.criticalPoints && processedResults.criticalPoints.length > 0) {
    markdown += '## Critical Points\n\n';
    processedResults.criticalPoints.forEach((point: any) => {
      if (!point) return;
      
      if (typeof point === 'string') {
        markdown += `### Critical Issue\n`;
        markdown += `**Severity:** High\n\n`;
        markdown += `${point}\n\n`;
      } else {
        markdown += `### ${point.title || 'Unnamed Point'}\n`;
        markdown += `**Severity:** ${point.severity || 'Unknown'}\n\n`;
        
        if (point.description) {
          markdown += `${point.description}\n\n`;
        }
        
        if (point.reference) {
          if (point.reference.section) {
            markdown += `**Location:** ${point.reference.section}\n`;
          }
          if (point.reference.excerpt) {
            markdown += `**Excerpt:** "${point.reference.excerpt}"\n\n`;
          }
        }
      }
    });
  }

  // Format financial risks - handle both object and string array formats
  if (processedResults.financialRisks && processedResults.financialRisks.length > 0) {
    markdown += '## Financial Risks\n\n';
    processedResults.financialRisks.forEach((risk: any) => {
      if (!risk) return;
      
      if (typeof risk === 'string') {
        markdown += `### Financial Risk\n`;
        markdown += `**Severity:** High\n\n`;
        markdown += `${risk}\n\n`;
      } else {
        markdown += `### ${risk.title || 'Unnamed Risk'}\n`;
        markdown += `**Severity:** ${risk.severity || 'Unknown'}\n\n`;
        
        if (risk.description) {
          markdown += `${risk.description}\n\n`;
        }
        
        if (risk.reference) {
          if (risk.reference.section) {
            markdown += `**Location:** ${risk.reference.section}\n`;
          }
          if (risk.reference.excerpt) {
            markdown += `**Excerpt:** "${risk.reference.excerpt}"\n\n`;
          }
        }
      }
    });
  }

  // Format unusual language - handle both object and string array formats
  if (processedResults.unusualLanguage && processedResults.unusualLanguage.length > 0) {
    markdown += '## Unusual Language\n\n';
    processedResults.unusualLanguage.forEach((item: any) => {
      if (!item) return;
      
      if (typeof item === 'string') {
        markdown += `### Unusual Language\n`;
        markdown += `**Severity:** Medium\n\n`;
        markdown += `${item}\n\n`;
      } else {
        markdown += `### ${item.title || 'Unnamed Issue'}\n`;
        markdown += `**Severity:** ${item.severity || 'Unknown'}\n\n`;
        
        if (item.description) {
          markdown += `${item.description}\n\n`;
        }
        
        if (item.reference) {
          if (item.reference.section) {
            markdown += `**Location:** ${item.reference.section}\n`;
          }
          if (item.reference.excerpt) {
            markdown += `**Excerpt:** "${item.reference.excerpt}"\n\n`;
          }
        }
      }
    });
  }

  // Format recommendations - handle both object and string array formats
  if (processedResults.recommendations && processedResults.recommendations.length > 0) {
    markdown += '## Recommendations\n\n';
    processedResults.recommendations.forEach((rec: any, index: number) => {
      if (!rec) return;
      
      if (typeof rec === 'string') {
        markdown += `${index + 1}. ${rec}\n`;
      } else {
        markdown += `${index + 1}. ${rec.text || 'No recommendation text'}\n`;
        if (rec.reference) {
          markdown += `   _(Section: ${rec.reference.section})_\n`;
        }
      }
      markdown += '\n';
    });
  }

  // Add raw analysis content if available (for debugging or when the structured data is missing)
  if (Object.keys(processedResults).length > 0 && 
      (!processedResults.criticalPoints?.length && 
       !processedResults.financialRisks?.length && 
       !processedResults.unusualLanguage?.length && 
       !processedResults.recommendations?.length)) {
    
    markdown += '## Complete Analysis\n\n';
    
    // If there's generatedText, content, or raw text from Claude
    if (processedResults.generatedText || processedResults.content || processedResults.rawContent) {
      markdown += processedResults.generatedText || processedResults.content || processedResults.rawContent;
    } else {
      // As a last resort, stringify the entire object but format it nicely
      try {
        const cleanResults = { ...processedResults };
        // Remove any large or circular references that might cause issues
        delete cleanResults.rawContent;
        delete cleanResults.errors;
        
        markdown += '```json\n';
        markdown += JSON.stringify(cleanResults, null, 2);
        markdown += '\n```\n';
      } catch (error) {
        markdown += "Unable to display complete analysis data.";
      }
    }
  }

  // If no content was added, provide a default message
  if (markdown === '') {
    markdown = 'No detailed analysis results available.';
  }

  return markdown;
};
