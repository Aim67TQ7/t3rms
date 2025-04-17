
import { enhanceToLegalLanguage, convertToLegalClause, generateExtendedLegalClauses, generateLegalDisclaimers, wrapInVerbosePreamble } from './legalLanguageGenerator';

// Function to process custom requirements (enhanced with legal language)
export const processCustomRequirements = (requirements: string): string => {
  if (!requirements.trim()) return '';
  
  // Split the requirements by lines to process each as a separate clause
  const requirementLines = requirements.split(/\n+/).filter(line => line.trim());
  
  let processedContent = '';
  
  // Process each line as a separate custom clause with appropriate legal enhancement
  requirementLines.forEach((line, index) => {
    const clauseTitle = `CUSTOM PROVISION ${index + 1}`;
    processedContent += convertToLegalClause(line, clauseTitle);
  });
  
  return processedContent;
};

export type PolicyType = 'terms' | 'privacy' | 'cookie' | 'gdpr' | 'hipaa' | 'acceptable-use';

// Define interface for form data
export interface FormData {
  businessName: string;
  website?: string;
  email: string;
  phone?: string;
  platformType: 'website' | 'mobile-app' | 'ecommerce' | 'saas';
  businessDescription: string;
  jurisdiction: string;
  includeDisputeResolution: boolean;
  includeIntellectualProperty: boolean;
  includeLimitations: boolean;
  includePrivacyPolicy: boolean;
  includeProhibitedActivities: boolean;
  includeTermination: boolean;
  includeUserContent: boolean;
  customRequirements?: string;
  policyTypes: PolicyType[];
  dataRetentionPeriod?: string;
  dataCollectionMethods?: string[];
  thirdPartyServices?: string[];
  cookieTypes?: string[];
  medicalDataHandling?: boolean;
  securityMeasures?: string[];
}

export const getReadablePlatformType = (type: string): string => {
  switch (type) {
    case 'website': return 'website';
    case 'mobile-app': return 'mobile application';
    case 'ecommerce': return 'e-commerce platform';
    case 'saas': return 'software service';
    default: return 'platform';
  }
};

// Generate a document based on form data
export const generateDocument = (formData: FormData): string => {
  let template = '';
  
  formData.policyTypes.forEach(policyType => {
    switch(policyType) {
      case 'privacy':
        template += generatePrivacyPolicy(formData);
        break;
      case 'cookie':
        template += generateCookiePolicy(formData);
        break;
      case 'gdpr':
        template += generateGDPRStatement(formData);
        break;
      case 'hipaa':
        template += generateHIPAAPolicy(formData);
        break;
      case 'acceptable-use':
        template += generateAcceptableUsePolicy(formData);
        break;
      case 'terms':
      default:
        template += generateTermsAndConditions(formData);
    }
    
    template += '<hr class="my-8" />';
  });
  
  return template;
};

export const generateTermsAndConditions = (formData: FormData): string => {
  const legalClauses = generateExtendedLegalClauses();
  
  // Process custom requirements with legal enhancement
  let customRequirementsSection = '';
  if (formData.customRequirements) {
    customRequirementsSection = `
      <h2>8. ADDITIONAL TERMS AND CONDITIONS</h2>
      ${processCustomRequirements(formData.customRequirements)}
    `;
  }
  
  // Get platform type in readable format
  const platformType = getReadablePlatformType(formData.platformType);
  
  const tcTemplate = `
    <h2>1. AGREEMENT TO TERMS</h2>
    <p>These Terms and Conditions (hereinafter referred to as the "Agreement") constitute a legally binding agreement made between you, whether personally or on behalf of an entity (hereinafter referred to as "you," "your," or "User") and ${formData.businessName} (hereinafter referred to as "Company," "we," "us," or "our"), concerning your access to and utilization of our ${platformType} (hereinafter referred to as the "Service").</p>
    
    <p>By accessing, registering for, or otherwise using the Service, you hereby acknowledge and consent to be bound by all of the terms and conditions contained herein. If you do not agree to abide by these Terms and Conditions in their entirety, you are expressly prohibited from accessing or utilizing the Service and must discontinue use immediately.</p>
    
    <p>We reserve the right, at our sole discretion, to make modifications or revisions to these Terms and Conditions at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Terms and Conditions, and you waive any right to receive specific notice of each such change. It is your responsibility to periodically review these Terms and Conditions to stay informed of updates. You shall be subject to, and shall be deemed to have been made aware of and to have accepted, the changes in any revised Terms and Conditions by your continued use of the Service after the date such revised Terms and Conditions are posted.</p>
    
    <p>The information provided on the Service is not intended for distribution to or use by any person or entity in any jurisdiction or country where such distribution or use would be contrary to law or regulation or which would subject us to any registration requirement within such jurisdiction or country. Accordingly, those persons who choose to access the Service from other locations do so on their own initiative and are solely responsible for compliance with local laws, if and to the extent local laws are applicable.</p>
    
    <h2>2. INTELLECTUAL PROPERTY RIGHTS</h2>
    <p>Unless otherwise indicated, the Service is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Service (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of the United States, international copyright laws, and international conventions.</p>
    
    <p>The Content and the Marks are provided on the Service "AS IS" for your information and personal use only. Except as expressly provided in these Terms and Conditions, no part of the Service and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.</p>
    
    <p>Provided that you are eligible to use the Service, you are hereby granted a limited license to access and use the Service and to download or print a copy of any portion of the Content to which you have properly gained access solely for your personal, non-commercial use. We reserve all rights not expressly granted to you in and to the Service, the Content, and the Marks.</p>
    
    ${formData.includeProhibitedActivities ? `
    <h2>3. PROHIBITED ACTIVITIES</h2>
    <p>You may not access or use the Service for any purpose other than that for which we make the Service available. The Service may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
    
    <p>As a user of the Service, you hereby agree not to engage in any of the following prohibited activities:</p>
    <ol type="a">
      <li>Systematically retrieve data or other content from the Service to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
      <li>Make any unauthorized use of the Service, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</li>
      <li>Use the Service to advertise or offer to sell goods and services, or to conduct or forward surveys, contests, or chain letters.</li>
      <li>Circumvent, disable, or otherwise interfere with security-related features of the Service, including features that prevent or restrict the use or copying of any Content or enforce limitations on the use of the Service and/or the Content contained therein.</li>
      <li>Engage in unauthorized framing of or linking to the Service.</li>
      <li>Interfere with, disrupt, or create an undue burden on the Service or the networks or services connected to the Service.</li>
      <li>Use any device, software, or routine that interferes with the proper working of the Service.</li>
      <li>Use the Service in a manner inconsistent with any applicable laws or regulations.</li>
      <li>Attempt to bypass any measures of the Service designed to prevent or restrict access to the Service, or any portion of the Service.</li>
      <li>Except as permitted by applicable law, decipher, decompile, disassemble, or reverse engineer any of the software comprising or in any way making up a part of the Service.</li>
      <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
      <li>Harass, annoy, intimidate, or threaten any of our employees or agents engaged in providing any portion of the Service to you.</li>
    </ol>
    ` : ''}
    
    ${formData.includeTermination ? `
    <h2>4. TERMINATION</h2>
    <p>We reserve the right, in our sole discretion, to terminate your access to all or any part of the Service, without notice, for any reason or no reason at all, including without limitation, breach of these Terms and Conditions. We shall not be liable to you or any third party for any claims or damages arising out of any termination or suspension of the Service or your access thereto. We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms and Conditions.</p>
    <p>Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service, or notify us that you wish to delete your account. All provisions of these Terms and Conditions which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity, limitations of liability, and dispute resolution provisions.</p>
    ` : ''}
    
    ${formData.includeDisputeResolution ? `
    <h2>5. DISPUTE RESOLUTION</h2>
    <h3>5.1 Informal Negotiations</h3>
    <p>To expedite resolution and control the cost of any dispute, controversy, or claim arising under or related to these Terms and Conditions, the Service, or any aspect of your relationship with Company (each a "Dispute" and collectively, the "Disputes"), you and Company agree to first attempt to negotiate any Dispute (except those Disputes expressly provided below) informally for at least thirty (30) days before initiating any arbitration or court proceeding. Such informal negotiations commence upon written notice from one person to the other.</p>
    
    <h3>5.2 Binding Arbitration</h3>
    <p>If the parties are unable to resolve a Dispute through informal negotiations, the Dispute (except those Disputes expressly excluded below) shall be finally and exclusively resolved by binding arbitration. Arbitration is less formal than a lawsuit in court. Arbitration uses a neutral arbitrator instead of a judge or jury, may allow for more limited discovery than in court, and can be subject to very limited review by courts. Arbitrators can award the same damages and relief that a court can award. Any arbitration shall take place in ${formData.jurisdiction}, and shall be conducted in the English language.</p>
    
    <h3>5.3 Restrictions</h3>
    <p>You and Company agree that any arbitration shall be limited to the Dispute between Company and you individually. To the full extent permitted by law, (a) no arbitration shall be joined with any other proceeding; (b) there is no right or authority for any Dispute to be arbitrated on a class-action basis or to utilize class action procedures; and (c) there is no right or authority for any Dispute to be brought in a purported representative capacity on behalf of the general public or any other persons.</p>
    
    <h3>5.4 Exceptions to Informal Negotiations and Arbitration</h3>
    <p>The parties agree that the following Disputes are not subject to the above provisions concerning informal negotiations and binding arbitration: (a) any Disputes seeking to enforce or protect, or concerning the validity of, any of the intellectual property rights of a party; (b) any Dispute related to, or arising from, allegations of theft, piracy, invasion of privacy, or unauthorized use; and (c) any claim for injunctive relief.</p>
    
    <h3>5.5 Governing Law</h3>
    <p>These Terms and Conditions and your use of the Service are governed by and construed in accordance with the laws of ${formData.jurisdiction}, without regard to its conflict of law principles. The application of the United Nations Convention on Contracts for the International Sale of Goods is expressly excluded.</p>
    ` : ''}
    
    ${formData.includeLimitations ? `
    <h2>6. LIMITATIONS OF LIABILITY</h2>
    <p>IN NO EVENT SHALL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
    
    <p>NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING. CERTAIN STATE LAWS DO NOT ALLOW LIMITATIONS ON IMPLIED WARRANTIES OR THE EXCLUSION OR LIMITATION OF CERTAIN DAMAGES. IF THESE LAWS APPLY TO YOU, SOME OR ALL OF THE ABOVE DISCLAIMERS OR LIMITATIONS MAY NOT APPLY TO YOU, AND YOU MAY HAVE ADDITIONAL RIGHTS.</p>
    
    <p>IF YOU ARE A CALIFORNIA RESIDENT, YOU WAIVE CALIFORNIA CIVIL CODE SECTION 1542, WHICH SAYS: "A GENERAL RELEASE DOES NOT EXTEND TO CLAIMS WHICH THE CREDITOR DOES NOT KNOW OR SUSPECT TO EXIST IN HIS OR HER FAVOR AT THE TIME OF EXECUTING THE RELEASE, WHICH, IF KNOWN BY HIM OR HER MUST HAVE MATERIALLY AFFECTED HIS OR HER SETTLEMENT WITH THE DEBTOR."</p>
    ` : ''}
    
    ${formData.includeUserContent ? `
    <h2>7. USER CONTENT</h2>
    <h3>7.1 User Content Generally</h3>
    <p>You retain your intellectual property ownership rights over content you submit to us for publication on our Service ("User Content"). We will never claim ownership of your User Content, but we do require a license from you in order to use it. When you upload or post User Content to our Service, you grant us a worldwide, non-exclusive, royalty-free, transferable license to use, reproduce, distribute, prepare derivative works of, display, and perform that User Content in connection with the provision of our Service.</p>
    
    <h3>7.2 Your Representations and Warranties Regarding User Content</h3>
    <p>You are solely responsible for your User Content and the consequences of posting or publishing it. By posting or publishing User Content, you represent and warrant that: (a) you are the creator and owner of, or have the necessary licenses, rights, consents, and permissions to use and to authorize us and other users of the Service to use your User Content as necessary to exercise the licenses granted by you herein; (b) your User Content does not and will not infringe, violate, or misappropriate any third-party right, including any copyright, trademark, patent, trade secret, moral right, privacy right, right of publicity, or any other intellectual property or proprietary right; and (c) your User Content does not violate any applicable laws or regulations.</p>
    
    <h3>7.3 Our Right to Remove or Modify User Content</h3>
    <p>We reserve the right, but not the obligation, to review any User Content, and to, in our sole discretion, remove, screen, edit, or monitor User Content. We may remove or disable access to any User Content for any reason or no reason at all. If you believe that your User Content was improperly removed, you may contact us to request a review of our decision.</p>
    ` : ''}
    
    ${customRequirementsSection}
    
    ${legalClauses.representations}
    ${legalClauses.force_majeure}
    ${legalClauses.severability}
    ${legalClauses.waiver}
    ${legalClauses.assignment}
    ${legalClauses.notices}
    ${legalClauses.thirdPartyBeneficiaries}
    ${legalClauses.relationshipOfParties}
    ${legalClauses.equitableRemedies}
    
    ${generateLegalDisclaimers('terms')}
    
    <h2>9. CONTACT US</h2>
    <p>In order to resolve a complaint regarding the Service or to receive further information regarding utilization of the Service, please contact us at:</p>
    <p>${formData.businessName}<br>
    Email: ${formData.email}<br>
    ${formData.phone ? `Phone: ${formData.phone}<br>` : ''}
    ${formData.website ? `Website: ${formData.website}` : ''}</p>
  `;
  
  return wrapInVerbosePreamble(formData.businessName, tcTemplate);
};

export const generatePrivacyPolicy = (formData: FormData): string => {
  const legalClauses = generateExtendedLegalClauses();
  
  const policy = `
    <h2>1. INTRODUCTION</h2>
    <p>${formData.businessName} ("we," "us," or "our") is committed to protecting the privacy and security of your personal information. This Privacy Policy describes how we collect, use, disclose, and safeguard your information when you visit our ${getReadablePlatformType(formData.platformType)} and use our services. Please read this Privacy Policy carefully. By accessing or utilizing our services, you acknowledge that you have read, understood, and agree to be bound by all terms and conditions outlined in this Privacy Policy.</p>
    
    <p>We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last Updated" date of this Privacy Policy. Any changes or modifications will be effective immediately upon posting the updated Privacy Policy on our ${getReadablePlatformType(formData.platformType)}, and you waive the right to receive specific notice of each such change or modification. You are encouraged to periodically review this Privacy Policy to stay informed of updates.</p>
    
    <h2>2. COLLECTION OF YOUR INFORMATION</h2>
    <p>We may collect information about you in a variety of ways. The information we may collect via the ${getReadablePlatformType(formData.platformType)} includes:</p>
    
    <h3>2.1 Personal Data</h3>
    <p>Personally identifiable information that you voluntarily provide to us when registering with the ${getReadablePlatformType(formData.platformType)}, expressing an interest in obtaining information about us or our products and services, or otherwise contacting us. The personal information we collect may include your name, address, email address, telephone number, and any other information you choose to provide.</p>
    
    <h3>2.2 Derivative Data</h3>
    <p>Information our servers automatically collect when you access the ${getReadablePlatformType(formData.platformType)}, such as your IP address, browser type, operating system, access times, and the pages you have viewed directly before and after accessing the ${getReadablePlatformType(formData.platformType)}.</p>
    
    <h3>2.3 Financial Data</h3>
    <p>Financial information, such as data related to your payment method (e.g., valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the ${getReadablePlatformType(formData.platformType)}. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor, and you are encouraged to review their privacy policy and contact them directly for responses to your questions.</p>
    
    <h3>2.4 Mobile Device Data</h3>
    <p>Device information, such as your mobile device ID, model, and manufacturer, and information about the location of your device, if you access the ${getReadablePlatformType(formData.platformType)} from a mobile device.</p>
    
    <h3>2.5 Third-Party Data</h3>
    <p>Information from third parties, such as personal information or network friends, if you connect your account to the third party and grant the ${getReadablePlatformType(formData.platformType)} permission to access this information.</p>
    
    <h2>3. USE OF YOUR INFORMATION</h2>
    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the ${getReadablePlatformType(formData.platformType)} to:</p>
    
    <ol type="a">
      <li>Create and manage your account.</li>
      <li>Process your transactions.</li>
      <li>Compile anonymous statistical data and analysis for use internally or with third parties.</li>
      <li>Deliver targeted advertising, newsletters, and other information regarding promotions and the ${getReadablePlatformType(formData.platformType)} to you.</li>
      <li>Email you regarding your account or order.</li>
      <li>Enable user-to-user communications.</li>
      <li>Fulfill and manage purchases, orders, payments, and other transactions related to the ${getReadablePlatformType(formData.platformType)}.</li>
      <li>Generate a personal profile about you to make future visits to the ${getReadablePlatformType(formData.platformType)} more personalized.</li>
      <li>Increase the efficiency and operation of the ${getReadablePlatformType(formData.platformType)}.</li>
      <li>Monitor and analyze usage and trends to improve your experience with the ${getReadablePlatformType(formData.platformType)}.</li>
      <li>Notify you of updates to the ${getReadablePlatformType(formData.platformType)}.</li>
      <li>Offer new products, services, and/or recommendations to you.</li>
      <li>Perform other business activities as needed.</li>
      <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
      <li>Process payments and refunds.</li>
      <li>Request feedback and contact you about your use of the ${getReadablePlatformType(formData.platformType)}.</li>
      <li>Resolve disputes and troubleshoot problems.</li>
      <li>Respond to product and customer service requests.</li>
      <li>Send you a newsletter.</li>
    </ol>
    
    <h2>4. DISCLOSURE OF YOUR INFORMATION</h2>
    <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
    
    <h3>4.1 By Law or to Protect Rights</h3>
    <p>If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation. This includes exchanging information with other entities for fraud protection and credit risk reduction.</p>
    
    <h3>4.2 Third-Party Service Providers</h3>
    <p>We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</p>
    
    <h3>4.3 Marketing Communications</h3>
    <p>With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.</p>
    
    <h3>4.4 Interactions with Other Users</h3>
    <p>If you interact with other users of the ${getReadablePlatformType(formData.platformType)}, those users may see your name, profile photo, and descriptions of your activity.</p>
    
    <h3>4.5 Online Postings</h3>
    <p>When you post comments, contributions, or other content to the ${getReadablePlatformType(formData.platformType)}, your posts may be viewed by all users and may be publicly distributed outside the ${getReadablePlatformType(formData.platformType)} in perpetuity.</p>
    
    <h3>4.6 Third-Party Advertisers</h3>
    <p>We may use third-party advertising companies to serve ads when you visit the ${getReadablePlatformType(formData.platformType)}. These companies may use information about your visits to the ${getReadablePlatformType(formData.platformType)} and other websites that are contained in web cookies in order to provide advertisements about goods and services of interest to you.</p>
    
    <h3>4.7 Business Partners</h3>
    <p>We may share your information with our business partners to offer you certain products, services, or promotions.</p>
    
    <h2>5. DATA RETENTION</h2>
    <p>We will retain your information for as long as your account is active or as needed to provide you services. If you wish to cancel your account or request that we no longer use your information to provide you services, contact us. We will retain and use your information as necessary to comply with our legal obligations, resolve disputes, and enforce our agreements.</p>
    
    ${generateLegalDisclaimers('privacy')}
    
    <h2>9. CONTACT US</h2>
    <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
    <p>${formData.businessName}<br>
    Email: ${formData.email}<br>
    ${formData.phone ? `Phone: ${formData.phone}<br>` : ''}
    ${formData.website ? `Website: ${formData.website}` : ''}</p>
  `;
  
  return wrapInVerbosePreamble(formData.businessName, policy);
};

export const generateCookiePolicy = (formData: FormData): string => {
  return wrapInVerbosePreamble(formData.businessName, `
    <h2>1. INTRODUCTION</h2>
    <p>This Cookie Policy explains how ${formData.businessName} ("we", "us", or "our") uses cookies and similar technologies to recognize and track your usage of our ${getReadablePlatformType(formData.platformType)}. It explains what these technologies are and why we use them, as well as your rights to control our use of them.</p>
    
    <h2>2. WHAT ARE COOKIES</h2>
    <p>Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.</p>
    
    <h2>3. WHY DO WE USE COOKIES</h2>
    <p>We use first-party and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our ${getReadablePlatformType(formData.platformType)} to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our ${getReadablePlatformType(formData.platformType)}. Third parties serve cookies through our ${getReadablePlatformType(formData.platformType)} for advertising, analytics and other purposes.</p>
    
    <h2>4. TYPES OF COOKIES WE USE</h2>
    <p>The specific types of first and third-party cookies served through our ${getReadablePlatformType(formData.platformType)} and the purposes they perform are described below:</p>
    
    <h3>4.1 Essential Cookies</h3>
    <p>These cookies are strictly necessary to provide you with services available through our ${getReadablePlatformType(formData.platformType)} and to use some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver the ${getReadablePlatformType(formData.platformType)}, you cannot refuse them without impacting how our ${getReadablePlatformType(formData.platformType)} functions.</p>
    
    <h3>4.2 Performance and Functionality Cookies</h3>
    <p>These cookies are used to enhance the performance and functionality of our ${getReadablePlatformType(formData.platformType)} but are non-essential to their use. However, without these cookies, certain functionality may become unavailable.</p>
    
    <h3>4.3 Analytics and Customization Cookies</h3>
    <p>These cookies collect information that is used either in aggregate form to help us understand how our ${getReadablePlatformType(formData.platformType)} is being used or how effective our marketing campaigns are, or to help us customize our ${getReadablePlatformType(formData.platformType)} for you.</p>
    
    <h3>4.4 Advertising Cookies</h3>
    <p>These cookies are used to make advertising messages more relevant to you. They perform functions like preventing the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some cases selecting advertisements that are based on your interests.</p>
    
    <h3>4.5 Social Media Cookies</h3>
    <p>These cookies are used to enable you to share pages and content that you find interesting on our ${getReadablePlatformType(formData.platformType)} through third-party social networking and other websites. These cookies may also be used for advertising purposes.</p>
    
    ${generateLegalDisclaimers('cookie')}
    
    <h2>9. CONTACT US</h2>
    <p>If you have questions or comments about this Cookie Policy, please contact us at:</p>
    <p>${formData.businessName}<br>
    Email: ${formData.email}<br>
    ${formData.phone ? `Phone: ${formData.phone}<br>` : ''}
    ${formData.website ? `Website: ${formData.website}` : ''}</p>
  `);
};

// Placeholder implementations for other policy types
export const generateGDPRStatement = (formData: FormData): string => {
  return wrapInVerbosePreamble(formData.businessName, `
    <h2>GDPR COMPLIANCE STATEMENT</h2>
    <p>This GDPR Compliance Statement (this "Statement") describes how ${formData.businessName} ("we", "us", or "our") processes personal data in compliance with the European Union's General Data Protection Regulation ("GDPR"). This Statement applies to all personal data we process regardless of the media on which that data is stored.</p>
    
    <h2>1. DATA CONTROLLER</h2>
    <p>${formData.businessName} is the data controller for the personal data we process, and can be contacted at:</p>
    <p>Email: ${formData.email}<br>
    ${formData.phone ? `Phone: ${formData.phone}<br>` : ''}
    ${formData.website ? `Website: ${formData.website}` : ''}</p>
    
    <h2>2. LEGAL BASIS FOR PROCESSING</h2>
    <p>We process personal data only on a lawful basis under Article 6 of the GDPR. Our primary basis for processing is consent, but we may also process data based on contractual necessity, legal obligation, vital interests, public interest, or legitimate interests as appropriate.</p>
    
    ${generateLegalDisclaimers('gdpr')}
  `);
};

export const generateHIPAAPolicy = (formData: FormData): string => {
  return wrapInVerbosePreamble(formData.businessName, `
    <h2>HIPAA COMPLIANCE POLICY</h2>
    <p>This HIPAA Compliance Policy (this "Policy") describes how ${formData.businessName} ("we", "us", or "our") handles protected health information ("PHI") in compliance with the Health Insurance Portability and Accountability Act of 1996 and its implementing regulations ("HIPAA").</p>
    
    <h2>1. SAFEGUARDS</h2>
    <p>We employ appropriate administrative, technical, and physical safeguards to protect the privacy of PHI.</p>
    
    ${generateLegalDisclaimers('hipaa')}
  `);
};

export const generateAcceptableUsePolicy = (formData: FormData): string => {
  return wrapInVerbosePreamble(formData.businessName, `
    <h2>ACCEPTABLE USE POLICY</h2>
    <p>This Acceptable Use Policy (this "Policy") describes prohibited uses of the services offered by ${formData.businessName} ("we", "us", or "our") and the ${getReadablePlatformType(formData.platformType)} (the "Service"). By using the Service, you agree to comply with this Policy.</p>
    
    <h2>1. PROHIBITED ACTIVITIES</h2>
    <p>You agree not to engage in any of the following prohibited activities when using the Service:</p>
    <ol type="a">
      <li>Violating any applicable laws, regulations, or third-party rights.</li>
      <li>Distributing malware or engaging in hacking activities.</li>
      <li>Sending unsolicited communications or spam.</li>
      <li>Storing, distributing, or transmitting material that is obscene, harmful to minors, or otherwise objectionable.</li>
      <li>Interfering with the proper functioning of the Service.</li>
    </ol>
    
    ${generateLegalDisclaimers('acceptable-use')}
  `);
};
