
/**
 * Legal Language Generator Utility
 * Enhances basic statements with more formal legal terminology and structure
 */

// Helper to get current date in formal legal format
const getLegalFormattedDate = () => {
  const date = new Date();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

// Convert a simple statement to legalistic format
export const enhanceToLegalLanguage = (statement: string): string => {
  // Replace simple terms with more formal alternatives
  const formalizedStatement = statement
    .replace(/use/gi, "utilization")
    .replace(/agree/gi, "hereby acknowledge and consent")
    .replace(/must/gi, "shall be obligated to")
    .replace(/can/gi, "is hereby authorized and permitted to")
    .replace(/stop/gi, "cease and desist")
    .replace(/end/gi, "terminate")
    .replace(/break/gi, "breach")
    .replace(/rules/gi, "provisions herein")
    .replace(/pay/gi, "remit payment")
    .replace(/cancel/gi, "effect cancellation of")
    .replace(/refund/gi, "monetary reimbursement");
    
  return formalizedStatement;
};

// Convert simple input to a legal clause
export const convertToLegalClause = (input: string, clauseTitle: string): string => {
  if (!input.trim()) return "";
  
  // Start with a formal heading
  let legalClause = `<h3>${clauseTitle}</h3>\n<p>`;
  
  // Add appropriate legal preamble
  legalClause += "It is hereby acknowledged, understood, and agreed upon by all parties that ";
  
  // Enhance user input with legal terminology
  legalClause += enhanceToLegalLanguage(input);
  
  // Add appropriate legal closing
  legalClause += ". The aforementioned terms shall be construed in accordance with the laws of the applicable jurisdiction and shall be binding upon all relevant parties.";
  
  legalClause += "</p>";
  
  return legalClause;
};

// Generate various types of legal clauses for more comprehensive documents
export const generateExtendedLegalClauses = () => {
  const clauses = {
    representations: `
      <h3>REPRESENTATIONS AND WARRANTIES</h3>
      <p>Each party hereby represents and warrants to the other party that: (a) it has the full right, power, and authority to enter into and perform its obligations under these Terms and Conditions; (b) the execution of these Terms and Conditions by such party and the performance of its obligations hereunder do not and will not violate or conflict with any agreement to which it is a party or by which it is otherwise bound; and (c) when accepted, these Terms and Conditions will constitute the legal, valid, and binding obligation of such party, enforceable against such party in accordance with their terms.</p>
    `,
    force_majeure: `
      <h3>FORCE MAJEURE</h3>
      <p>Neither party shall be liable or responsible to the other party, nor be deemed to have defaulted under or breached these Terms and Conditions, for any failure or delay in fulfilling or performing any term of these Terms and Conditions when and to the extent such failure or delay is caused by or results from acts beyond the affected party's reasonable control, including, without limitation: (a) acts of God; (b) flood, fire, earthquake, epidemics, pandemics, or explosion; (c) war, invasion, hostilities (whether war is declared or not), terrorist threats or acts, riot or other civil unrest; (d) government order, law, or actions; (e) embargoes or blockades in effect on or after the date of this Agreement; (f) national or regional emergency; (g) strikes, labor stoppages or slowdowns, or other industrial disturbances; and (h) shortage of adequate power or transportation facilities.</p>
    `,
    severability: `
      <h3>SEVERABILITY</h3>
      <p>If any term or provision of these Terms and Conditions is invalid, illegal, or unenforceable in any jurisdiction, such invalidity, illegality, or unenforceability shall not affect any other term or provision of these Terms and Conditions or invalidate or render unenforceable such term or provision in any other jurisdiction. Upon such determination that any term or other provision is invalid, illegal, or unenforceable, the parties hereto shall negotiate in good faith to modify these Terms and Conditions so as to effect the original intent of the parties as closely as possible in a mutually acceptable manner in order that the transactions contemplated hereby be consummated as originally contemplated to the greatest extent possible.</p>
    `,
    waiver: `
      <h3>WAIVER</h3>
      <p>No waiver by any party of any of the provisions hereof shall be effective unless explicitly set forth in writing and signed by the party so waiving. No waiver by any party shall operate or be construed as a waiver in respect of any failure, breach, or default not expressly identified by such written waiver, whether of a similar or different character, and whether occurring before or after that waiver. No failure to exercise, or delay in exercising, any right, remedy, power, or privilege arising from these Terms and Conditions shall operate or be construed as a waiver thereof; nor shall any single or partial exercise of any right, remedy, power, or privilege hereunder preclude any other or further exercise thereof or the exercise of any other right, remedy, power, or privilege.</p>
    `,
    assignment: `
      <h3>ASSIGNMENT</h3>
      <p>These Terms and Conditions shall be binding upon and shall inure to the benefit of the parties hereto and their respective successors and permitted assigns. Neither party may assign its rights or obligations hereunder without the prior written consent of the other party, which consent shall not be unreasonably withheld, conditioned, or delayed; provided, however, that either party may assign its rights and obligations under these Terms and Conditions without the other party's consent in connection with a merger, acquisition, corporate reorganization, or sale of all or substantially all of its assets.</p>
    `,
    notices: `
      <h3>NOTICES</h3>
      <p>All notices, requests, consents, claims, demands, waivers, and other communications hereunder (each, a "Notice") shall be in writing and addressed to the parties at the addresses set forth on the first page of these Terms and Conditions (or to such other address that may be designated by the receiving party from time to time in accordance with this section). All Notices shall be delivered by personal delivery, nationally recognized overnight courier (with all fees pre-paid), or certified or registered mail (in each case, return receipt requested, postage prepaid). Except as otherwise provided in these Terms and Conditions, a Notice is effective only (a) upon receipt by the receiving party, and (b) if the party giving the Notice has complied with the requirements of this Section.</p>
    `,
    thirdPartyBeneficiaries: `
      <h3>THIRD-PARTY BENEFICIARIES</h3>
      <p>These Terms and Conditions are for the sole benefit of the parties hereto and their respective successors and permitted assigns and nothing herein, express or implied, is intended to or shall confer upon any other person or entity any legal or equitable right, benefit, or remedy of any nature whatsoever under or by reason of these Terms and Conditions.</p>
    `,
    relationshipOfParties: `
      <h3>RELATIONSHIP OF THE PARTIES</h3>
      <p>Nothing contained in these Terms and Conditions shall be construed as creating any agency, partnership, joint venture, or other form of joint enterprise, employment, or fiduciary relationship between the parties, and neither party shall have authority to contract for or bind the other party in any manner whatsoever.</p>
    `,
    equitableRemedies: `
      <h3>EQUITABLE REMEDIES</h3>
      <p>Each party acknowledges and agrees that a breach or threatened breach by such party of any of its obligations under these Terms and Conditions would cause the other party irreparable harm for which monetary damages would not be an adequate remedy and agrees that, in the event of such breach or threatened breach, the other party will be entitled to equitable relief, including a restraining order, an injunction, specific performance, and any other relief that may be available from any court, without any requirement to post a bond or other security, or to prove actual damages or that monetary damages are not an adequate remedy. Such remedies are not exclusive and are in addition to all other remedies that may be available at law, in equity, or otherwise.</p>
    `
  };
  
  return clauses;
};

// Legal disclaimers for different policy types
export const generateLegalDisclaimers = (policyType: string): string => {
  switch(policyType) {
    case 'terms':
      return `
        <h3>LEGAL DISCLAIMER</h3>
        <p>THE INFORMATION, CONTENT, AND SERVICES PROVIDED HEREIN ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITH NO WARRANTIES WHATSOEVER. TO THE FULLEST EXTENT PERMISSIBLE UNDER APPLICABLE LAW, WE HEREBY DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, AND IMPLIED WARRANTIES ARISING FROM COURSE OF DEALING OR COURSE OF PERFORMANCE. WE DO NOT WARRANT THAT THE FUNCTIONS PROVIDED BY THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE OR THE SERVER THAT MAKES IT AVAILABLE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>
      `;
    case 'privacy':
      return `
        <h3>PRIVACY POLICY DISCLAIMER</h3>
        <p>WHILE WE ENDEAVOR TO PROTECT YOUR PERSONAL INFORMATION THROUGH THE IMPLEMENTATION OF REASONABLE TECHNICAL AND ORGANIZATIONAL MEASURES, WE CANNOT GUARANTEE THE ABSOLUTE SECURITY OF ANY INFORMATION TRANSMITTED TO OR STORED ON OUR SYSTEMS. BY USING OUR SERVICES, YOU ACKNOWLEDGE AND ACCEPT THAT THE TRANSMISSION OF INFORMATION OVER THE INTERNET IS INHERENTLY INSECURE, AND WE CANNOT GUARANTEE THE SECURITY OF DATA SENT OVER THE INTERNET. YOU AGREE THAT WE SHALL NOT BE LIABLE FOR ANY UNAUTHORIZED ACCESS, USE, OR DISCLOSURE OF YOUR PERSONAL INFORMATION RESULTING FROM CIRCUMSTANCES BEYOND OUR REASONABLE CONTROL.</p>
      `;
    case 'cookie':
      return `
        <h3>COOKIE POLICY DISCLAIMER</h3>
        <p>CERTAIN ASPECTS OF THE SERVICES MAY NOT FUNCTION PROPERLY IF YOU DISABLE OR REFUSE COOKIES. BY CONTINUING TO USE OUR SERVICES WITHOUT ADJUSTING YOUR BROWSER SETTINGS TO REJECT COOKIES, YOU CONSENT TO OUR USE OF COOKIES IN ACCORDANCE WITH THIS COOKIE POLICY. YOU ACKNOWLEDGE AND AGREE THAT WE SHALL HAVE NO LIABILITY FOR ANY REDUCED FUNCTIONALITY, INABILITY TO ACCESS CERTAIN FEATURES, OR ERRORS IN THE DISPLAY OR OPERATION OF THE SERVICES THAT RESULT FROM YOUR REJECTION OR BLOCKING OF COOKIES.</p>
      `;
    default:
      return `
        <h3>GENERAL DISCLAIMER</h3>
        <p>THE INFORMATION CONTAINED HEREIN IS PROVIDED FOR GENERAL INFORMATIONAL PURPOSES ONLY AND SHOULD NOT BE CONSTRUED AS PROFESSIONAL ADVICE. YOU SHOULD CONSULT WITH A QUALIFIED PROFESSIONAL REGARDING YOUR SPECIFIC CIRCUMSTANCES BEFORE TAKING ANY ACTION BASED ON THE INFORMATION PROVIDED HEREIN. TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, WE HEREBY DISCLAIM ANY AND ALL LIABILITY ARISING FROM YOUR USE OF OR RELIANCE UPON THE INFORMATION PROVIDED HEREIN.</p>
      `;
  }
};

export const wrapInVerbosePreamble = (businessName: string, content: string): string => {
  const dateFormal = getLegalFormattedDate();
  
  return `
    <div class="legal-document">
      <div class="document-header">
        <h1>TERMS AND CONDITIONS OF USE AND SERVICE</h1>
        <p class="document-date">Last Updated: ${dateFormal}</p>
      </div>

      <div class="preamble">
        <p><strong>IMPORTANT NOTICE:</strong> PLEASE READ THESE TERMS AND CONDITIONS CAREFULLY BEFORE ACCESSING OR USING THE SERVICES PROVIDED BY ${businessName.toUpperCase()} (HEREINAFTER REFERRED TO AS "COMPANY," "WE," "US," OR "OUR"). BY ACCESSING OR USING THE SERVICES, YOU (HEREINAFTER REFERRED TO AS "USER," "CUSTOMER," "YOU," OR "YOUR") AGREE TO BE LEGALLY BOUND BY THESE TERMS AND CONDITIONS IN THEIR ENTIRETY. IF YOU DO NOT AGREE TO THESE TERMS AND CONDITIONS, YOU MUST IMMEDIATELY CEASE USING THE SERVICES.</p>
        
        <p>THESE TERMS AND CONDITIONS CONSTITUTE A LEGALLY BINDING AGREEMENT BETWEEN YOU AND ${businessName.toUpperCase()}, GOVERNING YOUR ACCESS TO AND USE OF THE SERVICES PROVIDED BY THE COMPANY. THESE TERMS AND CONDITIONS MAY BE MODIFIED FROM TIME TO TIME WITHOUT PRIOR NOTICE. IT IS YOUR RESPONSIBILITY TO REVIEW THESE TERMS AND CONDITIONS PERIODICALLY.</p>

        <p>BY ACCESSING OR USING THE SERVICES, YOU REPRESENT AND WARRANT THAT YOU HAVE THE LEGAL CAPACITY AND AUTHORITY TO ENTER INTO THIS AGREEMENT AND TO ABIDE BY ALL TERMS AND CONDITIONS CONTAINED HEREIN.</p>
      </div>

      ${content}

      <div class="document-footer">
        <p>IN WITNESS WHEREOF, by accessing or using the services provided by ${businessName}, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.</p>
        
        <p class="date-effective">Effective Date: ${dateFormal}</p>
      </div>
    </div>
  `;
};
