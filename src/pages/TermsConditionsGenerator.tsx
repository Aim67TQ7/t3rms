import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/navbar/useAuth";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Check } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import AuthPrompt from '@/components/AuthPrompt';

const formSchema = z.object({
  businessName: z.string().min(2, { message: "Business name is required" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().optional(),
  platformType: z.enum(["website", "mobile-app", "ecommerce", "saas"]),
  businessDescription: z.string().min(10, { message: "Please provide a brief description of your business" }),
  jurisdiction: z.string().min(2, { message: "Jurisdiction is required" }),
  
  includeDisputeResolution: z.boolean().default(true),
  includeIntellectualProperty: z.boolean().default(true),
  includeLimitations: z.boolean().default(true),
  includePrivacyPolicy: z.boolean().default(false),
  includeProhibitedActivities: z.boolean().default(true),
  includeTermination: z.boolean().default(true),
  includeUserContent: z.boolean().default(false),
  
  policyType: z.enum(["terms", "privacy", "cookie", "gdpr", "hipaa", "acceptable-use"]),
  dataRetentionPeriod: z.string().optional(),
  dataCollectionMethods: z.array(z.string()).default([]),
  thirdPartyServices: z.array(z.string()).default([]),
  cookieTypes: z.array(z.string()).default([]),
  medicalDataHandling: z.boolean().default(false),
  securityMeasures: z.array(z.string()).default([]),
  customRequirements: z.string().optional(),
});

const policyTypeOptions = [
  { value: "terms", label: "Terms & Conditions" },
  { value: "privacy", label: "Privacy Policy" },
  { value: "cookie", label: "Cookie Policy" },
  { value: "gdpr", label: "GDPR Compliance Statement" },
  { value: "hipaa", label: "HIPAA Compliance Policy" },
  { value: "acceptable-use", label: "Acceptable Use Policy" },
];

const platformOptions = [
  { value: "website", label: "Website" },
  { value: "mobile-app", label: "Mobile App" },
  { value: "ecommerce", label: "E-Commerce Platform" },
  { value: "saas", label: "SaaS Platform" },
];

const TermsConditionsGenerator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [generatedTC, setGeneratedTC] = useState<string | null>(null);
  const [previewFormat, setPreviewFormat] = useState("html");
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      website: "",
      email: "",
      phone: "",
      platformType: "website",
      businessDescription: "",
      jurisdiction: "",
      includeDisputeResolution: true,
      includeIntellectualProperty: true,
      includeLimitations: true,
      includePrivacyPolicy: false,
      includeProhibitedActivities: true,
      includeTermination: true,
      includeUserContent: false,
      customRequirements: "",
    },
  });

  const steps = [
    { id: 0, name: "Business Information" },
    { id: 1, name: "Platform Details" },
    { id: 2, name: "Legal Clauses" },
    { id: 3, name: "Preview & Download" },
  ];

  const handleNext = () => {
    form.trigger();
    
    if (activeStep === 0) {
      const { businessName, email } = form.getValues();
      if (!businessName || !email || form.formState.errors.businessName || form.formState.errors.email) {
        return;
      }
    } else if (activeStep === 1) {
      const { platformType, businessDescription, jurisdiction } = form.getValues();
      if (!platformType || !businessDescription || !jurisdiction || 
          form.formState.errors.platformType || 
          form.formState.errors.businessDescription || 
          form.formState.errors.jurisdiction) {
        return;
      }
    }
    
    if (activeStep === 2) {
      const formValues = form.getValues();
      generateDocument(formValues);
    }
    
    setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
  };

  const generateDocument = (formData: z.infer<typeof formSchema>) => {
    let template = '';
    
    switch(formData.policyType) {
      case 'privacy':
        template = generatePrivacyPolicy(formData);
        break;
      case 'cookie':
        template = generateCookiePolicy(formData);
        break;
      case 'gdpr':
        template = generateGDPRStatement(formData);
        break;
      case 'hipaa':
        template = generateHIPAAPolicy(formData);
        break;
      case 'acceptable-use':
        template = generateAcceptableUsePolicy(formData);
        break;
      default:
        template = generateTermsAndConditions(formData);
    }
    
    setGeneratedTC(template);
  };

  const generateTermsAndConditions = (formData: z.infer<typeof formSchema>) => {
    const currentDate = new Date().toISOString().split('T')[0];
    
    let customRequirementsSection = '';
    if (formData.customRequirements) {
      customRequirementsSection = `
      <h2>8. ADDITIONAL TERMS AND CONDITIONS</h2>
      <p>${processCustomRequirements(formData.customRequirements)}</p>`;
    }
    
    const tcTemplate = `
      <h1>TERMS AND CONDITIONS</h1>
      <p>Last updated: ${currentDate}</p>
      
      <h2>1. AGREEMENT TO TERMS</h2>
      <p>These Terms and Conditions constitute a legally binding agreement made between you and ${formData.businessName} ("we," "us" or "our"), concerning your access to and use of our ${getReadablePlatformType(formData.platformType)}.</p>
      
      <p>By accessing or using our ${getReadablePlatformType(formData.platformType)}, you agree to these Terms and Conditions. If you disagree with any part of the terms, you do not have permission to access our ${getReadablePlatformType(formData.platformType)}.</p>
      
      <h2>2. INTELLECTUAL PROPERTY RIGHTS</h2>
      <p>Our ${getReadablePlatformType(formData.platformType)} and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by ${formData.businessName}, its licensors, or other providers of such material and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.</p>
      
      ${formData.includeProhibitedActivities ? `
      <h2>3. PROHIBITED ACTIVITIES</h2>
      <p>You may not access or use the ${getReadablePlatformType(formData.platformType)} for any purpose other than that for which we make it available. The ${getReadablePlatformType(formData.platformType)} may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>
      
      <p>As a user of the ${getReadablePlatformType(formData.platformType)}, you agree not to:</p>
      <ul>
        <li>Systematically retrieve data or other content from the ${getReadablePlatformType(formData.platformType)} to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
        <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
        <li>Circumvent, disable, or otherwise interfere with security-related features of the ${getReadablePlatformType(formData.platformType)}.</li>
        <li>Engage in unauthorized framing of or linking to the ${getReadablePlatformType(formData.platformType)}.</li>
        <li>Make improper use of our support services or submit false reports of abuse or misconduct.</li>
      </ul>
      ` : ''}
      
      ${formData.includeTermination ? `
      <h2>4. TERMINATION</h2>
      <p>We may terminate or suspend your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms and Conditions.</p>
      <p>Upon termination, your right to use the ${getReadablePlatformType(formData.platformType)} will immediately cease.</p>
      ` : ''}
      
      ${formData.includeDisputeResolution ? `
      <h2>5. DISPUTE RESOLUTION</h2>
      <p>Any legal action of whatever nature brought by either you or us shall be commenced or prosecuted in the courts located in ${formData.jurisdiction}, and you and we hereby consent to, and waive all defenses of lack of personal jurisdiction and forum non conveniens with respect to venue and jurisdiction in such courts.</p>
      <p>These Terms and Conditions and your use of the ${getReadablePlatformType(formData.platformType).toUpperCase()} are governed by and construed in accordance with the laws of ${formData.jurisdiction}.</p>
      ` : ''}
      
      ${formData.includeLimitations ? `
      <h2>6. LIMITATIONS OF LIABILITY</h2>
      <p>IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE ${getReadablePlatformType(formData.platformType).toUpperCase()}, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
      ` : ''}
      
      ${customRequirementsSection}
      
      <h2>7. CONTACT US</h2>
      <p>To resolve a complaint regarding the ${getReadablePlatformType(formData.platformType)} or to receive further information regarding use of the ${getReadablePlatformType(formData.platformType)}, please contact us at:</p>
      <p>${formData.businessName}<br>
      Email: ${formData.email}<br>
      ${formData.phone ? `Phone: ${formData.phone}<br>` : ''}
      ${formData.website ? `Website: ${formData.website}` : ''}</p>
    `;
    
    setGeneratedTC(tcTemplate);
  };

  const generatePrivacyPolicy = (formData: z.infer<typeof formSchema>) => {
    const currentDate = new Date().toISOString().split('T')[0];
    return `
      <h1>PRIVACY POLICY</h1>
      <p>Last updated: ${currentDate}</p>
      
      <h2>1. INTRODUCTION</h2>
      <p>${formData.businessName} ("we," "us," or "our") values your privacy and is committed to protecting your personal data.</p>
      
      <h2>2. DATA WE COLLECT</h2>
      <p>We collect and process the following types of personal data:</p>
      <ul>
        <li>Contact information (name, email, phone number)</li>
        <li>Usage data</li>
        <li>Device information</li>
      </ul>
      
      <h2>3. CONTACT US</h2>
      <p>For privacy-related inquiries, please contact us at:</p>
      <p>${formData.businessName}<br>
      Email: ${formData.email}<br>
      ${formData.phone ? `Phone: ${formData.phone}<br>` : ''}
      ${formData.website ? `Website: ${formData.website}` : ''}</p>
    `;
  };

  const generateCookiePolicy = (formData: z.infer<typeof formSchema>) => {
    const currentDate = new Date().toISOString().split('T')[0];
    return `
      <h1>COOKIE POLICY</h1>
      <p>Last updated: ${currentDate}</p>
      
      <h2>1. INTRODUCTION</h2>
      <p>${formData.businessName} ("we," "us," or "our") values your privacy and is committed to protecting your personal data.</p>
      
      <h2>2. WHAT ARE COOKIES</h2>
      <p>Cookies are small text files that are stored on your device when you visit a website. They are widely used to remember user preferences, to provide personalized content, and to track user behavior.</p>
      
      <h2>3. HOW WE USE COOKIES</h2>
      <p>We use cookies to:</p>
      <ul>
        <li>Remember your preferences</li>
        <li>Provide personalized content</li>
        <li>Track user behavior</li>
      </ul>
      
      <h2>4. TYPES OF COOKIES WE USE</h2>
      <p>We use the following types of cookies:</p>
      <ul>
        <li>Strictly necessary cookies</li>
        <li>Performance cookies</li>
        <li>Functionality cookies</li>
        <li>Targeting cookies</li>
      </ul>
      
      <h2>5. HOW TO MANAGE COOKIES</h2>
      <p>You can manage your cookie preferences by adjusting your browser settings. Most browsers allow you to block cookies or to delete cookies that have already been set.</p>
      
      <h2>6. CONTACT US</h2>
      <p>For privacy-related inquiries, please contact us at:</p>
      <p>${formData.businessName}<br>
      Email: ${formData.email}<br>
      ${formData.phone ? `Phone: ${formData.phone}<br>` : ''}
      ${formData.website ? `Website: ${formData.website}` : ''}</p>
    `;
  };

  const generateGDPRStatement = (formData: z.infer<typeof formSchema>) => {
    const currentDate = new Date().toISOString().split('T')[0];
    return `
      <h1>GDPR COMPLIANCE STATEMENT</h1>
      <p>Last updated: ${currentDate}</p>
      
      <h2>1. INTRODUCTION</h2>
      <p>${formData.businessName} ("we," "us," or "our") values your privacy and is committed to protecting your personal data.</p>
      
      <h2>2. WHAT IS GDPR</h2>
      <p>The General Data Protection Regulation (GDPR) is a set of rules that govern the collection, use, and protection of personal data in the European Union.</p>
      
      <h2>3. HOW WE COMPLY WITH GDPR</h2>
      <p>We comply with GDPR by:</p>
      <ul>
        <li>Obtaining consent from users</li>
        <li>Ensuring the accuracy of personal data</li>
        <li>Providing users with access to their personal data</li>
        <li>Notifying users of data breaches</li>
      </ul>
      
      <h2>4. CONTACT US</h2>
      <p>For privacy-related inquiries, please contact us at:</p>
      <p>${formData.businessName}<br>
      Email: ${formData.email}<br>
      ${formData.phone ? `Phone: ${formData.phone}<br>` : ''}
      ${formData.website ? `Website: ${formData.website}` : ''}</p>
    `;
  };

  const generateHIPAAPolicy = (formData: z.infer<typeof formSchema>) => {
    const currentDate = new Date().toISOString().split('T')[0];
    return `
      <h1>HIPAA COMPLIANCE POLICY</h1>
      <p>Last updated: ${currentDate}</p>
      
      <h2>1. INTRODUCTION</h2>
      <p>${formData.businessName} ("we," "us," or "our") values your privacy and is committed to protecting your personal data.</p>
      
      <h2>2. WHAT IS HIPAA</h2>
      <p>The Health Insurance Portability and Accountability Act (HIPAA) is a set of rules that govern the collection, use, and protection of personal health information in the United States.</p>
      
      <h2>3. HOW WE COMPLY WITH HIPAA</h2>
      <p>We comply with HIPAA by:</p>
      <ul>
        <li>Obtaining consent from users</li>
        <li>Ensuring the accuracy of personal data</li>
        <li>Providing users with access to their personal data</li>
        <li>Notifying users of data breaches</li>
      </ul>
      
      <h2>4. CONTACT US</h2>
      <p>For privacy-related inquiries, please contact us at:</p>
      <p>${formData.businessName}<br>
      Email: ${formData.email}<br>
      ${formData.phone ? `Phone: ${formData.phone}<br>` : ''}
      ${formData.website ? `Website: ${formData.website}` : ''}</p>
    `;
  };

  const generateAcceptableUsePolicy = (formData: z.infer<typeof formSchema>) => {
    const currentDate = new Date().toISOString().split('T')[0];
    return `
      <h1>ACCEPTABLE USE POLICY</h1>
      <p>Last updated: ${currentDate}</p>
      
      <h2>1. INTRODUCTION</h2>
      <p>${formData.businessName} ("we," "us," or "our") values your privacy and is committed to protecting your personal data.</p>
      
      <h2>2. WHAT IS ACCEPTABLE USE</h2>
      <p>Acceptable use is the use of our ${getReadablePlatformType(formData.platformType)} in a manner that is consistent with our policies and laws.</p>
      
      <h2>3. WHAT IS NOT ACCEPTABLE USE</h2>
      <p>Not acceptable use includes:</p>
      <ul>
        <li>Using our ${getReadablePlatformType(formData.platformType)} for illegal activities</li>
        <li>Using our ${getReadablePlatformType(formData.platformType)} to harm others</li>
        <li>Using our ${getReadablePlatformType(formData.platformType)} to violate our policies</li>
      </ul>
      
      <h2>4. CONTACT US</h2>
      <p>For privacy-related inquiries, please contact us at:</p>
      <p>${formData.businessName}<br>
      Email: ${formData.email}<br>
      ${formData.phone ? `Phone: ${formData.phone}<br>` : ''}
      ${formData.website ? `Website: ${formData.website}` : ''}</p>
    `;
  };

  const getReadablePlatformType = (type: string) => {
    switch (type) {
      case 'website': return 'website';
      case 'mobile-app': return 'mobile application';
      case 'ecommerce': return 'e-commerce platform';
      case 'saas': return 'software service';
      default: return 'platform';
    }
  };

  const handleDownload = (format: string) => {
    if (!generatedTC) return;

    let content = generatedTC;
    let mimeType = 'text/html';
    let fileExtension = 'html';
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `terms-and-conditions.${fileExtension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Download Started",
      description: `Your Terms & Conditions have been downloaded in ${format.toUpperCase()} format.`,
    });
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="policyType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select policy type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {policyTypeOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the type of legal document you want to generate
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your Business Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.yourbusiness.com" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your company website (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email *</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@yourbusiness.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="(123) 456-7890" {...field} />
                  </FormControl>
                  <FormDescription>
                    Your contact phone number (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="platformType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform Type *</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {platformOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="businessDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Description *</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Briefly describe your business and services..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jurisdiction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Governing Law/Jurisdiction *</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., State of California, United States" {...field} />
                  </FormControl>
                  <FormDescription>
                    The laws that will govern your Terms & Conditions
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Custom Requirements and Clauses</h3>
            <FormField
              control={form.control}
              name="customRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custom Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your specific requirements or policies (e.g., payment terms, credit holds, service-specific conditions)..."
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add any custom requirements, policies, or conditions specific to your business. Our AI will convert these into professional legal language.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <h3 className="text-lg font-medium mt-8">Standard Clauses</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="includeDisputeResolution"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Dispute Resolution</FormLabel>
                      <FormDescription>
                        Include clauses for resolving disputes and jurisdiction information
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeIntellectualProperty"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Intellectual Property Rights</FormLabel>
                      <FormDescription>
                        Protect your content, trademarks, and other intellectual property
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeLimitations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Limitations of Liability</FormLabel>
                      <FormDescription>
                        Limit your liability for damages related to use of your platform
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeProhibitedActivities"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Prohibited Activities</FormLabel>
                      <FormDescription>
                        Define what users are not allowed to do on your platform
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeTermination"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Termination Clauses</FormLabel>
                      <FormDescription>
                        Conditions under which you can terminate user access
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeUserContent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>User Content</FormLabel>
                      <FormDescription>
                        Rules regarding content uploaded or created by users
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includePrivacyPolicy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Privacy Policy Reference</FormLabel>
                      <FormDescription>
                        Reference to your separate Privacy Policy document
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <div className="flex justify-end space-x-2 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload('html')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                HTML
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload('pdf')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload('docx')}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                DOCX
              </Button>
            </div>
            
            <Tabs defaultValue="html" onValueChange={setPreviewFormat}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="text">Plain Text</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
              </TabsList>
              <TabsContent value="html" className="mt-4">
                {generatedTC ? (
                  <div className="border rounded-md p-4 bg-white max-h-[60vh] overflow-auto">
                    <div dangerouslySetInnerHTML={{ __html: generatedTC }}></div>
                  </div>
                ) : (
                  <div className="border rounded-md p-4 text-center">
                    No document generated yet
                  </div>
                )}
              </TabsContent>
              <TabsContent value="text" className="mt-4">
                {generatedTC ? (
                  <div className="border rounded-md p-4 bg-white font-mono text-sm max-h-[60vh] overflow-auto">
                    {generatedTC.replace(/<[^>]*>/g, '')}
                  </div>
                ) : (
                  <div className="border rounded-md p-4 text-center">
                    No document generated yet
                  </div>
                )}
              </TabsContent>
              <TabsContent value="markdown" className="mt-4">
                {generatedTC ? (
                  <div className="border rounded-md p-4 bg-white font-mono text-sm max-h-[60vh] overflow-auto">
                    {generatedTC
                      .replace(/<h1>(.*?)<\/h1>/g, '# $1')
                      .replace(/<h2>(.*?)<\/h2>/g, '## $1')
                      .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
                      .replace(/<br>/g, '\n')
                      .replace(/<ul>(.*?)<\/ul>/g, '$1')
                      .replace(/<li>(.*?)<\/li>/g, '- $1\n')
                      .replace(/<[^>]*>/g, '')}
                  </div>
                ) : (
                  <div className="border rounded-md p-4 text-center">
                    No document generated yet
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Analysis & Recommendations</h3>
              <div className="border rounded-md p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <p>Your Terms & Conditions include all essential elements required for your platform type.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <p>Legal jurisdiction and governing law are clearly specified.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <p>Contact information is complete and properly formatted.</p>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Note: This is a generated template. We recommend having your Terms & Conditions 
                  reviewed by a legal professional before implementing.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const processCustomRequirements = (requirements: string): string => {
    const lines = requirements.split('\n').filter(line => line.trim());
    
    const processedLines = lines.map(line => {
      let processed = line.trim()
        .replace(/^[-*•]/g, '')
        .trim();
      
      if (!processed.endsWith('.')) {
        processed += '.';
      }
      
      processed = processed
        .replace(/must pay/gi, "shall be required to remit payment")
        .replace(/need to/gi, "shall be required to")
        .replace(/have to/gi, "shall be obligated to")
        .replace(/(\d+)%/g, "$1 percent")
        .replace(/payment/gi, "monetary compensation")
        .replace(/before/gi, "prior to")
        .replace(/cancel/gi, "terminate")
        .replace(/refund/gi, "reimbursement");
      
      return processed;
    });
    
    return processedLines.join(' ');
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Terms & Conditions Generator</h1>
      
      {!isAuthenticated && (
        <div className="mb-6">
          <AuthPrompt showDismiss={false} />
        </div>
      )}
      
      <div className="mb-8">
        <ol className="flex items-center w-full text-sm font-medium text-center bg-white rounded-lg">
          {steps.map((step, index) => (
            <li 
              key={step.id}
              className={`flex items-center ${
                index < steps.length - 1 
                  ? "after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:mx-4" 
                  : ""
              } ${
                index < activeStep 
                  ? "text-primary" 
                  : index === activeStep 
                  ? "text-primary" 
                  : "text-gray-500"
              }`}
            >
              <span className={`flex items-center justify-center w-8 h-8 rounded-full lg:h-10 lg:w-10 shrink-0 border ${
                index < activeStep 
                  ? "border-primary bg-primary text-white" 
                  : index === activeStep 
                  ? "border-primary text-primary" 
                  : "border-gray-300"
              }`}>
                {index < activeStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  index + 1
                )}
              </span>
              <span className="hidden md:inline-flex md:ml-2">{step.name}</span>
            </li>
          ))}
        </ol>
      </div>
      
      <Form {...form}>
        <form className="space-y-8">
          <div className="bg-white p-6 rounded-lg border">
            {renderStepContent()}
          </div>
          
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              Back
            </Button>
            <Button
              type="button"
              onClick={handleNext}
              disabled={activeStep === steps.length - 1}
            >
              {activeStep === steps.length - 2 ? "Generate Document" : "Next"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default TermsConditionsGenerator;
