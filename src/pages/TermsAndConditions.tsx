import { useToast } from "@/hooks/use-toast";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col">
      <Seo 
        title="Terms & Conditions - T3RMS" 
        description="Legal agreement governing the use of T3RMS services and platform"
      />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="prose prose-slate max-w-none">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-8">
            <p className="text-sm">Last updated: April 17, 2025</p>
            <p className="text-sm mt-2">These Terms and Conditions govern your use of T3RMS services and platform.</p>
          </div>

          <h1>TERMS AND CONDITIONS</h1>

          <h2>INTRODUCTION</h2>
          <p>Welcome to T3RMS.com (the "Website"), operated by NOV8V LLC ("Company", "we", "us", or "our"). T3RMS.com specializes in developing and evaluating Terms and Conditions policies for businesses and organizations.</p>
          
          <p>By accessing or using our Website, you agree to be bound by these Terms and Conditions (the "Terms"). Please read these Terms carefully before using our services. If you do not agree with any part of these Terms, you must not use our Website or services.</p>

          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md my-8">
            <p className="font-bold">IMPORTANT NOTICE:</p>
            <p>THE INFORMATION PROVIDED ON THIS WEBSITE IS FOR GENERAL INFORMATIONAL PURPOSES ONLY AND SHOULD NOT BE CONSIDERED AS LEGAL ADVICE. ALWAYS CONSULT WITH A QUALIFIED LEGAL PROFESSIONAL BEFORE IMPLEMENTING ANY TERMS AND CONDITIONS FOR YOUR BUSINESS.</p>
          </div>

          <h2>1. DEFINITIONS</h2>
          <p>In these Terms, unless the context requires otherwise:</p>
          <ul>
            <li><strong>"Content"</strong> means any text, graphics, images, audio, video, software, data compilations, and any other form of information that appears on or forms part of our Website.</li>
            <li><strong>"User," "you," and "your"</strong> refer to the individual, company, or organization that has visited or is using the Website or services.</li>
            <li><strong>"Services"</strong> means any services, features, content, or applications offered by the Company, including but not limited to terms and conditions creation, evaluation, and related consultancy services.</li>
            <li><strong>"Intellectual Property"</strong> means all patents, rights to inventions, utility models, copyright and related rights, trademarks, service marks, trade, business and domain names, rights in trade dress or get-up, rights in goodwill or to sue for passing off, unfair competition rights, rights in designs, rights in computer software, database rights, topography rights, moral rights, rights in confidential information (including know-how and trade secrets) and any other intellectual property rights.</li>
          </ul>

          <h2>2. ACCEPTANCE OF TERMS</h2>
          <p>By accessing the Website, creating an account, or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms, as well as our Privacy Policy. If you are using the Services on behalf of a company or other legal entity, you represent that you have the authority to bind such entity to these Terms.</p>

          <h2>3. ELIGIBILITY</h2>
          <p>You must be at least 18 years of age or the age of legal majority in your jurisdiction, whichever is greater, to use our Services. By using our Services, you represent and warrant that you meet all eligibility requirements.</p>

          <h2>4. ACCOUNT REGISTRATION</h2>
          <p>To access certain features of the Website or Services, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
          <p>You are solely responsible for safeguarding the password that you use to access the Services and for any activities or actions under your password. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

          <h2>5. SERVICES AND PRICING</h2>
          <h3>5.1 Services Description</h3>
          <p>T3RMS.com provides tools and services for the development, evaluation, and management of terms and conditions and related legal documents. The specific features and functionality of the Services are as described on the Website.</p>

          <h3>5.2 Pricing and Payment</h3>
          <p>Prices for our Services are as quoted on our Website. We reserve the right to modify our prices at any time. Price changes will not affect orders that have already been confirmed.</p>
          <p>Payment must be made in full before the provision of Services unless otherwise agreed upon in writing. We accept payment via the methods specified on our Website.</p>

          <h3>5.3 Service Modifications</h3>
          <p>We reserve the right to modify, suspend, or discontinue, temporarily or permanently, the Services or any part thereof, with or without notice. You agree that we shall not be liable to you or any third party for any modification, suspension, or discontinuance of the Services.</p>

          <h2>6. USER OBLIGATIONS</h2>
          <h3>6.1 General Obligations</h3>
          <p>You agree to use the Website and Services only for lawful purposes and in accordance with these Terms. You agree not to use the Website or Services:</p>
          <ul>
            <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation.</li>
            <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Website or Services, or which may harm the Company or users of the Website or Services or expose them to liability.</li>
          </ul>

          <h3>6.2 User Content</h3>
          <p>Any content that you submit, post, or display on or through the Services ("User Content") is subject to our review. We reserve the right to remove any User Content that violates these Terms or that we find objectionable for any reason.</p>
          <p>By submitting User Content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content in any media.</p>

          <h2>7. INTELLECTUAL PROPERTY RIGHTS</h2>
          <h3>7.1 Our Intellectual Property</h3>
          <p>The Website and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by the Company, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>

          <h3>7.2 License to Use</h3>
          <p>We grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the Website and Services for your personal or internal business purposes. This license does not include:</p>
          <ul>
            <li>The right to modify, reproduce, distribute, or sell any content from our Website.</li>
            <li>The right to use any data mining, robots, or similar data gathering or extraction methods.</li>
            <li>The right to download any portion of the Website, except as expressly permitted.</li>
          </ul>

          <h3>7.3 Trademarks</h3>
          <p>The Company name, the term "T3RMS," the Company logo, and all related names, logos, product and service names, designs, and slogans are trademarks of the Company or its affiliates or licensors. You may not use such marks without the prior written permission of the Company.</p>

          <h2>8. USER REPRESENTATIONS AND WARRANTIES</h2>
          <p>You represent and warrant that:</p>
          <ul>
            <li>Your use of the Website and Services will be in strict accordance with these Terms, the Privacy Policy, and all applicable laws and regulations.</li>
            <li>You will not infringe the rights of any third party.</li>
            <li>You have the legal capacity to enter into these Terms.</li>
            <li>All information provided by you is true, accurate, current, and complete.</li>
          </ul>

          <h2>9. DISCLAIMER OF WARRANTIES</h2>
          <p>THE WEBSITE AND SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. THE COMPANY DISCLAIMS ALL WARRANTIES, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
          <p>WE DO NOT WARRANT THAT THE WEBSITE OR SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, THAT THE RESULTS THAT MAY BE OBTAINED FROM THE USE OF THE WEBSITE OR SERVICES WILL BE ACCURATE OR RELIABLE, OR THAT ANY ERRORS IN THE WEBSITE OR SERVICES WILL BE CORRECTED.</p>

          <h2>10. LIMITATION OF LIABILITY</h2>
          <p>IN NO EVENT SHALL THE COMPANY, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, PARTNERS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:</p>
          <ul>
            <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE WEBSITE OR SERVICES;</li>
            <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE WEBSITE;</li>
            <li>ANY CONTENT OBTAINED FROM THE WEBSITE; AND</li>
            <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE.</li>
          </ul>
          <p>THE FOREGOING DOES NOT AFFECT ANY LIABILITY WHICH CANNOT BE EXCLUDED OR LIMITED UNDER APPLICABLE LAW.</p>
          <p>IN JURISDICTIONS WHICH DO NOT ALLOW THE EXCLUSION OR LIMITATION OF LIABILITY FOR CONSEQUENTIAL OR INCIDENTAL DAMAGES, OUR LIABILITY IS LIMITED TO THE MAXIMUM EXTENT PERMITTED BY LAW.</p>

          <h2>11. INDEMNIFICATION</h2>
          <p>You agree to defend, indemnify, and hold harmless the Company, its directors, officers, employees, agents, partners, suppliers, and affiliates from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Website or Services.</p>

          <h2>12. EXTERNAL LINKS</h2>
          <p>The Website may contain links to third-party websites or services that are not owned or controlled by the Company. The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any such websites or services.</p>

          <h2>13. TERMINATION</h2>
          <p>We may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the Services will immediately cease.</p>

          <h2>14. GOVERNING LAW</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the state where NOV8V LLC is registered, without regard to its conflict of law provisions. Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Website shall be instituted exclusively in the federal courts of the United States or the courts of the state where NOV8V LLC is registered.</p>

          <h2>15. DISPUTE RESOLUTION</h2>
          <h3>15.1 Mandatory Arbitration</h3>
          <p>Any dispute arising out of or relating to these Terms, including the breach, termination, enforcement, interpretation, or validity thereof, shall be submitted to and resolved by binding arbitration in accordance with the rules of the American Arbitration Association, and judgment on the award rendered by the arbitrator(s) may be entered in any court having jurisdiction thereof.</p>

          <h3>15.2 Class Action Waiver</h3>
          <p>Any proceedings to resolve or litigate any dispute in any forum will be conducted solely on an individual basis. Neither you nor we will seek to have any dispute heard as a class action or in any other proceeding in which either party acts or proposes to act in a representative capacity. No arbitration or proceeding will be combined with another without the prior written consent of all parties to all affected arbitrations or proceedings.</p>

          <h3>15.3 Exceptions</h3>
          <p>Notwithstanding the foregoing, nothing in these Terms will prevent either party from seeking injunctive relief in the event that a delay in seeking such relief would result in irreparable harm, nor will it prevent us from pursuing collection activities or enforcing our intellectual property rights.</p>

          <h2>16. MODIFICATIONS TO THE TERMS</h2>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
          <p>By continuing to access or use our Website or Services after any revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, you are no longer authorized to use the Website or Services.</p>

          <h2>17. PRIVACY POLICY</h2>
          <p>Please review our Privacy Policy, which also governs your use of the Website and Services and explains how we collect, use, and disclose information that pertains to your privacy. The Privacy Policy is incorporated into these Terms by reference.</p>

          <h2>18. SEVERABILITY</h2>
          <p>If any provision of these Terms is held to be invalid, illegal, or unenforceable for any reason, such provision shall be eliminated or limited to the minimum extent such that the remaining provisions of the Terms will continue in full force and effect.</p>

          <h2>19. ENTIRE AGREEMENT</h2>
          <p>These Terms, together with the Privacy Policy and any other legal notices published by us on the Website, shall constitute the entire agreement between you and us concerning the Website and Services.</p>

          <h2>20. WAIVER</h2>
          <p>No waiver of any term of these Terms shall be deemed a further or continuing waiver of such term or any other term, and our failure to assert any right or provision under these Terms shall not constitute a waiver of such right or provision.</p>

          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md my-8">
            <p className="font-bold mb-4">DISCLAIMER:</p>
            <p>THE INFORMATION PROVIDED ON THIS WEBSITE IS FOR GENERAL INFORMATIONAL PURPOSES ONLY AND DOES NOT CONSTITUTE LEGAL ADVICE. ALWAYS CONSULT WITH A QUALIFIED LEGAL PROFESSIONAL REGARDING YOUR SPECIFIC CIRCUMSTANCES BEFORE IMPLEMENTING ANY TERMS AND CONDITIONS FOR YOUR BUSINESS OR WEBSITE. NOV8V LLC AND T3RMS.COM ARE RELEASED FROM ANY LIABILITY ARISING FROM YOUR USE OF THE SERVICES OR IMPLEMENTATION OF ANY TERMS AND CONDITIONS GENERATED OR EVALUATED THROUGH THIS WEBSITE WITHOUT PROPER LEGAL CONSULTATION.</p>
          </div>

          <h2>21. CONTACT INFORMATION</h2>
          <p>Questions about the Terms should be sent to us at <a href="mailto:contact@t3rms.com">contact@t3rms.com</a>.</p>

          <div className="border-t border-gray-200 mt-8 pt-8">
            <p className="font-bold">BY USING T3RMS.COM, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM. IF YOU DO NOT UNDERSTAND OR AGREE TO BE BOUND BY THESE TERMS OF SERVICE, YOU MUST NOT USE THE WEBSITE OR SERVICES.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
