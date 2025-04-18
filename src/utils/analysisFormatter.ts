
export const formatAnalysisResults = (results: any): string => {
  if (!results) return 'No analysis results available.';
  
  let markdown = '';
  
  // Add overall score
  if (results.overallScore !== undefined) {
    markdown += `# Overall Document Score: ${results.overallScore}/100\n\n`;
  }
  
  // Add any errors that occurred during analysis
  if (results.errors && results.errors.length > 0) {
    markdown += '## Analysis Warnings\n\n';
    results.errors.forEach((error: any) => {
      markdown += `⚠️ ${error.message}\n`;
    });
    markdown += '\n';
  }

  // Format critical points
  if (results.criticalPoints && results.criticalPoints.length > 0) {
    markdown += '## Critical Points\n\n';
    results.criticalPoints.forEach((point: any) => {
      markdown += `### ${point.title}\n`;
      markdown += `**Severity:** ${point.severity}\n\n`;
      markdown += `${point.description}\n\n`;
      if (point.reference) {
        markdown += `**Location:** ${point.reference.section}\n`;
        markdown += `**Excerpt:** "${point.reference.excerpt}"\n\n`;
      }
    });
  }

  // Format financial risks
  if (results.financialRisks && results.financialRisks.length > 0) {
    markdown += '## Financial Risks\n\n';
    results.financialRisks.forEach((risk: any) => {
      markdown += `### ${risk.title}\n`;
      markdown += `**Severity:** ${risk.severity}\n\n`;
      markdown += `${risk.description}\n\n`;
      if (risk.reference) {
        markdown += `**Location:** ${risk.reference.section}\n`;
        markdown += `**Excerpt:** "${risk.reference.excerpt}"\n\n`;
      }
    });
  }

  // Format unusual language
  if (results.unusualLanguage && results.unusualLanguage.length > 0) {
    markdown += '## Unusual Language\n\n';
    results.unusualLanguage.forEach((item: any) => {
      markdown += `### ${item.title}\n`;
      markdown += `**Severity:** ${item.severity}\n\n`;
      markdown += `${item.description}\n\n`;
      if (item.reference) {
        markdown += `**Location:** ${item.reference.section}\n`;
        markdown += `**Excerpt:** "${item.reference.excerpt}"\n\n`;
      }
    });
  }

  // Format recommendations
  if (results.recommendations && results.recommendations.length > 0) {
    markdown += '## Recommendations\n\n';
    results.recommendations.forEach((rec: any, index: number) => {
      markdown += `${index + 1}. ${rec.text}\n`;
      if (rec.reference) {
        markdown += `   _(Section: ${rec.reference.section})_\n`;
      }
      markdown += '\n';
    });
  }

  return markdown;
};
