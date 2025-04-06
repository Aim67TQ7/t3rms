
/**
 * Formats analysis results from JSON to markdown
 */

export const getSeverityIcon = (severity: string) => {
  switch (severity?.toLowerCase()) {
    case 'high':
      return '🔴';
    case 'medium':
      return '🟡';
    case 'low':
      return '🟢';
    default:
      return '⚪';
  }
};

export const formatAnalysisResults = (results: any) => {
  if (!results) return "";
  
  try {
    // Check if the result is already a string
    if (typeof results === 'string') {
      return results;
    }
    
    // Convert JSON object to markdown with improved formatting
    let markdown = "# Contract Analysis Results\n\n";
    
    // Add score if available
    if (results.overallScore !== undefined) {
      markdown += `## Overall Risk Score: ${results.overallScore}/100\n\n`;
      
      // Add color-coded risk assessment
      if (results.overallScore >= 80) {
        markdown += "**Risk Assessment**: 🟢 Low Risk\n\n";
      } else if (results.overallScore >= 50) {
        markdown += "**Risk Assessment**: 🟡 Medium Risk\n\n";
      } else {
        markdown += "**Risk Assessment**: 🔴 High Risk\n\n";
      }
    }
    
    // Critical Points section
    if (results.criticalPoints && results.criticalPoints.length > 0) {
      markdown += "## Critical Points\n\n";
      
      results.criticalPoints.forEach((point: any, index: number) => {
        const severityIcon = getSeverityIcon(point.severity);
        markdown += `### ${index + 1}. ${severityIcon} ${point.title}\n\n`;
        
        if (point.description) {
          // Split description into smaller paragraphs if it's long
          const paragraphs = point.description.split(/\n{2,}/);
          paragraphs.forEach(para => {
            markdown += `${para}\n\n`;
          });
        }
        
        if (point.reference) {
          markdown += "**Location:** ";
          
          const locationParts = [];
          if (point.reference.page) {
            locationParts.push(`Page ${point.reference.page}`);
          }
          
          if (point.reference.section) {
            locationParts.push(`Section ${point.reference.section}`);
          }
          
          markdown += locationParts.join(', ') + "\n\n";
          
          if (point.reference.excerpt) {
            // Format excerpt with line breaks to ensure it wraps properly
            const formattedExcerpt = point.reference.excerpt
              .replace(/(.{80})/g, "$1\n")
              .trim();
            
            markdown += `**Excerpt:**\n\`\`\`\n${formattedExcerpt}\n\`\`\`\n\n`;
          }
        }
      });
    }
    
    // Financial Risks section
    if (results.financialRisks && results.financialRisks.length > 0) {
      markdown += "## Financial Risks\n\n";
      
      results.financialRisks.forEach((risk: any, index: number) => {
        const severityIcon = getSeverityIcon(risk.severity);
        markdown += `### ${index + 1}. ${severityIcon} ${risk.title}\n\n`;
        
        if (risk.description) {
          // Split description into smaller paragraphs
          const paragraphs = risk.description.split(/\n{2,}/);
          paragraphs.forEach(para => {
            markdown += `${para}\n\n`;
          });
        }
        
        if (risk.reference) {
          markdown += "**Location:** ";
          
          const locationParts = [];
          if (risk.reference.page) {
            locationParts.push(`Page ${risk.reference.page}`);
          }
          
          if (risk.reference.section) {
            locationParts.push(`Section ${risk.reference.section}`);
          }
          
          markdown += locationParts.join(', ') + "\n\n";
          
          if (risk.reference.excerpt) {
            // Format excerpt with line breaks to ensure it wraps properly
            const formattedExcerpt = risk.reference.excerpt
              .replace(/(.{80})/g, "$1\n")
              .trim();
            
            markdown += `**Excerpt:**\n\`\`\`\n${formattedExcerpt}\n\`\`\`\n\n`;
          }
        }
      });
    }
    
    // Unusual Language section
    if (results.unusualLanguage && results.unusualLanguage.length > 0) {
      markdown += "## Unusual Language\n\n";
      
      results.unusualLanguage.forEach((item: any, index: number) => {
        const severityIcon = getSeverityIcon(item.severity);
        markdown += `### ${index + 1}. ${severityIcon} ${item.title}\n\n`;
        
        if (item.description) {
          // Split description into smaller paragraphs
          const paragraphs = item.description.split(/\n{2,}/);
          paragraphs.forEach(para => {
            markdown += `${para}\n\n`;
          });
        }
        
        if (item.reference) {
          markdown += "**Location:** ";
          
          const locationParts = [];
          if (item.reference.page) {
            locationParts.push(`Page ${item.reference.page}`);
          }
          
          if (item.reference.section) {
            locationParts.push(`Section ${item.reference.section}`);
          }
          
          markdown += locationParts.join(', ') + "\n\n";
          
          if (item.reference.excerpt) {
            // Format excerpt with line breaks to ensure it wraps properly
            const formattedExcerpt = item.reference.excerpt
              .replace(/(.{80})/g, "$1\n")
              .trim();
            
            markdown += `**Excerpt:**\n\`\`\`\n${formattedExcerpt}\n\`\`\`\n\n`;
          }
        }
      });
    }
    
    // Recommendations section
    if (results.recommendations && results.recommendations.length > 0) {
      markdown += "## Recommendations\n\n";
      
      results.recommendations.forEach((rec: any, index: number) => {
        let recText = "";
        if (typeof rec === 'string') {
          recText = rec;
        } else if (typeof rec === 'object') {
          if (rec.text) {
            recText = rec.text;
          } else if (rec.description) {
            recText = rec.description;
          }
        }
        
        if (recText) {
          markdown += `${index + 1}. ${recText}\n\n`;
          
          // Add reference if available
          if (rec.reference) {
            const locationParts = [];
            if (rec.reference.section) {
              locationParts.push(`Section ${rec.reference.section}`);
            }
            
            if (rec.reference.page) {
              locationParts.push(`Page ${rec.reference.page}`);
            }
            
            if (locationParts.length > 0) {
              markdown += `   *(Ref: ${locationParts.join(', ')})*\n\n`;
            }
          }
        }
      });
    }
    
    return markdown;
  } catch (error) {
    // If any error occurs during formatting, fall back to JSON
    return "```json\n" + JSON.stringify(results, null, 2) + "\n```";
  }
};
