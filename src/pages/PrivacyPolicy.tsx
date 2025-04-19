
import { useToast } from "@/hooks/use-toast";
import Seo from "@/components/Seo";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const { toast } = useToast();

  return (
    <div className="min-h-screen flex flex-col">
      <Seo 
        title="Privacy Policy - T3RMS | GDPR & Google Auth Compliant" 
        description="Comprehensive privacy policy detailing data collection, usage, and protection, including specific disclosures for Google authentication and user data handling in compliance with GDPR and Google API Services User Data Policy"
      />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="prose prose-slate max-w-none">
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md mb-8">
            <p className="text-sm">Last updated: April 17, 2025</p>
            <p className="text-sm mt-2">This Privacy Policy is compliant with the General Data Protection Regulation (GDPR), Google API Services User Data Policy, and other applicable data protection laws.</p>
          </div>

          <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

          <h2>1. INTRODUCTION</h2>
          <p>T3RMS ("we," "our," or "us"), operated by NOV8V LLC, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.</p>

          <h2>2. INFORMATION WE COLLECT</h2>
          <h3>2.1 Personal Information</h3>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Email address</li>
            <li>Name</li>
            <li>Payment information (processed securely through our payment providers)</li>
            <li>Usage data and preferences</li>
          </ul>

          <h3>2.2 Google Account Information</h3>
          <p>When you choose to sign in using Google, we collect:</p>
          <ul>
            <li>Google Account email address</li>
            <li>Google Account public profile information</li>
            <li>Google Account ID (for authentication purposes)</li>
          </ul>

          <h2>3. HOW WE USE YOUR INFORMATION</h2>
          <p>We use the collected information for:</p>
          <ul>
            <li>Authentication and account creation</li>
            <li>Providing and improving our services</li>
            <li>Communication about your account and our services</li>
            <li>Processing your transactions</li>
            <li>Analytics and service improvement</li>
          </ul>

          <h3>3.1 Google User Data Usage</h3>
          <p>Google user data is specifically used for:</p>
          <ul>
            <li>Authentication and account creation</li>
            <li>User identification</li>
            <li>Communication purposes</li>
          </ul>

          <h2>4. DATA STORAGE AND SECURITY</h2>
          <p>We implement appropriate security measures to protect your information:</p>
          <ul>
            <li>All data is stored in secure databases with encryption</li>
            <li>We use HTTPS encryption for all data transmission</li>
            <li>Regular security audits and updates</li>
            <li>Limited employee access to personal data</li>
          </ul>

          <h2>5. DATA SHARING</h2>
          <p>We do not share or sell your personal information to third parties except:</p>
          <ul>
            <li>When required by law</li>
            <li>With your explicit consent</li>
            <li>To our service providers who assist in operating our website and services</li>
          </ul>

          <h3>5.1 Google User Data Sharing</h3>
          <p>We do not share Google user data with third parties except as required by law. Any sharing of Google user data is in compliance with Google API Services User Data Policy.</p>

          <h2>6. YOUR RIGHTS AND CHOICES</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Object to or restrict processing of your information</li>
            <li>Request a copy of your information</li>
          </ul>

          <h2>7. DATA RETENTION</h2>
          <p>We retain your information for as long as necessary to provide our services and comply with legal obligations. You can request deletion of your data by contacting privacy@t3rms.ai.</p>

          <h2>8. CHILDREN'S PRIVACY</h2>
          <p>Our services are not intended for users under 18 years of age. We do not knowingly collect information from children under 18.</p>

          <h2>9. CHANGES TO THIS PRIVACY POLICY</h2>
          <p>We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>

          <h2>10. CONTACT US</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at:</p>
          <p>Email: privacy@t3rms.ai</p>

          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-md my-8">
            <p className="font-bold">Data Protection Rights (GDPR):</p>
            <p>For EU residents: You have the right to access, correct, or delete your personal data. Contact our Data Protection Officer at privacy@t3rms.ai for assistance with your data protection rights.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
