
export const formatAnalysisResults = (results: any): string => {
  if (!results) return 'No analysis results available.';
  
  let markdown = '';
  
  // Add overall score
  if (results.overallScore !== undefined) {
    markdown += `# Overall Document Score: ${results.overallScore}/100\n\n`;
  } else {
    markdown += `# Analysis Results\n\n`;
  }
  
  // Add any errors that occurred during analysis
  if (results.errors && results.errors.length > 0) {
    markdown += '## Analysis Warnings\n\n';
    results.errors.forEach((error: any) => {
      markdown += `⚠️ ${error.message || 'Unknown error'}\n`;
    });
    markdown += '\n';
  }

  // Format critical points
  if (results.criticalPoints && results.criticalPoints.length > 0) {
    markdown += '## Critical Points\n\n';
    results.criticalPoints.forEach((point: any) => {
      if (!point) return;
      
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
    });
  }

  // Format financial risks
  if (results.financialRisks && results.financialRisks.length > 0) {
    markdown += '## Financial Risks\n\n';
    results.financialRisks.forEach((risk: any) => {
      if (!risk) return;
      
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
    });
  }

  // Format unusual language
  if (results.unusualLanguage && results.unusualLanguage.length > 0) {
    markdown += '## Unusual Language\n\n';
    results.unusualLanguage.forEach((item: any) => {
      if (!item) return;
      
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
    });
  }

  // Format recommendations
  if (results.recommendations && results.recommendations.length > 0) {
    markdown += '## Recommendations\n\n';
    results.recommendations.forEach((rec: any, index: number) => {
      if (!rec) return;
      
      markdown += `${index + 1}. ${rec.text || 'No recommendation text'}\n`;
      if (rec.reference) {
        markdown += `   _(Section: ${rec.reference.section})_\n`;
      }
      markdown += '\n';
    });
  }

  // If no content was added, provide a default message
  if (markdown === '') {
    markdown = 'No detailed analysis results available.';
  }

  return markdown;
};
