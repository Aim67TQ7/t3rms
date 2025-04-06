
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
    
    // Convert JSON object to markdown with added blank lines
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
        markdown += `### ${severityIcon} ${point.title}\n\n`;
        
        if (point.description) {
          markdown += `${point.description}\n\n`;
        }
        
        if (point.reference) {
          markdown += "**Location:**\n";
          
          if (point.reference.page) {
            markdown += `- Page: ${point.reference.page}\n`;
          }
          
          if (point.reference.section) {
            markdown += `- Section: ${point.reference.section}\n\n`;
          }
          
          if (point.reference.excerpt) {
            markdown += `**Excerpt:**\n\`\`\`\n${point.reference.excerpt}\n\`\`\`\n\n\n`;
          }
        }
      });
    }
    
    // Financial Risks section
    if (results.financialRisks && results.financialRisks.length > 0) {
      markdown += "## Financial Risks\n\n";
      
      results.financialRisks.forEach((risk: any, index: number) => {
        const severityIcon = getSeverityIcon(risk.severity);
        markdown += `### ${severityIcon} ${risk.title}\n\n`;
        
        if (risk.description) {
          markdown += `${risk.description}\n\n`;
        }
        
        if (risk.reference) {
          markdown += "**Location:**\n";
          
          if (risk.reference.page) {
            markdown += `- Page: ${risk.reference.page}\n`;
          }
          
          if (risk.reference.section) {
            markdown += `- Section: ${risk.reference.section}\n\n`;
          }
          
          if (risk.reference.excerpt) {
            markdown += `**Excerpt:**\n\`\`\`\n${risk.reference.excerpt}\n\`\`\`\n\n\n`;
          }
        }
      });
    }
    
    // Unusual Language section
    if (results.unusualLanguage && results.unusualLanguage.length > 0) {
      markdown += "## Unusual Language\n\n";
      
      results.unusualLanguage.forEach((item: any, index: number) => {
        const severityIcon = getSeverityIcon(item.severity);
        markdown += `### ${severityIcon} ${item.title}\n\n`;
        
        if (item.description) {
          markdown += `${item.description}\n\n`;
        }
        
        if (item.reference) {
          markdown += "**Location:**\n";
          
          if (item.reference.page) {
            markdown += `- Page: ${item.reference.page}\n`;
          }
          
          if (item.reference.section) {
            markdown += `- Section: ${item.reference.section}\n\n`;
          }
          
          if (item.reference.excerpt) {
            markdown += `**Excerpt:**\n\`\`\`\n${item.reference.excerpt}\n\`\`\`\n\n\n`;
          }
        }
      });
    }
    
    // Recommendations section
    if (results.recommendations && results.recommendations.length > 0) {
      markdown += "## Recommendations\n\n";
      
      results.recommendations.forEach((rec: any, index: number) => {
        if (typeof rec === 'string') {
          markdown += `${index + 1}. ${rec}\n\n`;
        } else if (typeof rec === 'object') {
          if (rec.text) {
            markdown += `${index + 1}. ${rec.text}\n\n`;
          } else if (rec.description) {
            markdown += `${index + 1}. ${rec.description}\n\n`;
          }
          
          // Add reference if available
          if (rec.reference) {
            markdown += `   *(Ref: `;
            
            if (rec.reference.section) {
              markdown += `Section ${rec.reference.section}`;
            }
            
            if (rec.reference.page) {
              markdown += rec.reference.section ? `, Page ${rec.reference.page}` : `Page ${rec.reference.page}`;
            }
            
            markdown += `)*\n\n\n`;
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
