
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/navbar/useAuth";
import Seo from "@/components/Seo";
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
import { FileText, Download, Check, AlertCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import AuthPrompt from '@/components/AuthPrompt';
import { SavedTermsList } from '@/components/terms/SavedTermsList';
import LegalPreview from '@/components/terms/LegalPreview';
import AiEnhancementSection from '@/components/terms/AiEnhancementSection';
import { supabase } from "@/integrations/supabase/client";
import { 
  FormData, 
  PolicyType,
  generateDocument 
} from '@/utils/termsGenerator';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define policy types as a constant to ensure type safety
const POLICY_TYPES = ["terms", "privacy", "cookie", "gdpr", "hipaa", "acceptable-use"] as const;

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
  
  policyTypes: z.array(z.enum(POLICY_TYPES)).default([]),
  
  dataRetentionPeriod: z.string().optional(),
  dataCollectionMethods: z.array(z.string()).default([]),
  thirdPartyServices: z.array(z.string()).default([]),
  cookieTypes: z.array(z.string()).default([]),
  medicalDataHandling: z.boolean().default(false),
  securityMeasures: z.array(z.string()).default([]),
  customRequirements: z.string().optional(),
  specialConditions: z.string().optional(),
});

// Ensure the form schema matches our FormData interface
type FormValues = z.infer<typeof formSchema>;

const policyTypeOptions = [
  { value: "terms" as PolicyType, label: "Terms & Conditions" },
  { value: "privacy" as PolicyType, label: "Privacy Policy" },
  { value: "cookie" as PolicyType, label: "Cookie Policy" },
  { value: "gdpr" as PolicyType, label: "GDPR Compliance Statement" },
  { value: "hipaa" as PolicyType, label: "HIPAA Compliance Policy" },
  { value: "acceptable-use" as PolicyType, label: "Acceptable Use Policy" },
];

const platformOptions = [
  { value: "website", label: "Website" },
  { value: "mobile-app", label: "Mobile App" },
  { value: "ecommerce", label: "E-Commerce Platform" },
  { value: "saas", label: "SaaS Platform" },
];

const businessDescriptionOptions = [
  { value: "ecommerce", label: "E-commerce Store / Online Retail" },
  { value: "saas", label: "Software as a Service (SaaS)" },
  { value: "consulting", label: "Consulting Services" },
  { value: "digital_products", label: "Digital Products / Downloads" },
  { value: "online_courses", label: "Online Courses / Education" },
  { value: "marketplace", label: "Online Marketplace / Platform" },
  { value: "subscription", label: "Subscription-based Service" },
  { value: "content_creation", label: "Content Creation / Media" },
  { value: "agency", label: "Agency Services" },
  { value: "other", label: "Other" }
];

const jurisdictionOptions = [
  { value: "US-CA", label: "United States - California" },
  { value: "US-NY", label: "United States - New York" },
  { value: "US-TX", label: "United States - Texas" },
  { value: "US-FL", label: "United States - Florida" },
  { value: "UK", label: "United Kingdom" },
  { value: "EU", label: "European Union" },
  { value: "CA", label: "Canada" },
  { value: "AU", label: "Australia" },
  { value: "SG", label: "Singapore" },
  { value: "other", label: "Other Jurisdiction" }
];

const TermsConditionsGenerator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [generatedTC, setGeneratedTC] = useState<string | null>(null);
  const [aiEnhancedText, setAiEnhancedText] = useState<string[]>([]);
  const [generatedPolicies, setGeneratedPolicies] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentPolicyIndex, setCurrentPolicyIndex] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { isAuthenticated, userId } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormValues>({
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
      specialConditions: "",
      policyTypes: ["terms"] as PolicyType[],
    },
  });

  const steps = [
    { id: 0, name: "Business Information" },
    { id: 1, name: "Platform Details" },
    { id: 2, name: "Legal Clauses" },
    { id: 3, name: "Special Conditions" },
    { id: 4, name: "AI Enhancement" },
    { id: 5, name: "Preview & Download" },
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
    
    if (activeStep === 4) {
      handleGeneratePolicies();
    } else {
      setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => Math.max(prev - 1, 0));
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

  const generatePolicyWithClaude = async (policyType: PolicyType) => {
    try {
      const formData = form.getValues();
      
      const requestData = {
        policyType,
        businessInfo: {
          businessName: formData.businessName,
          website: formData.website,
          email: formData.email,
          phone: formData.phone,
          businessDescription: formData.businessDescription,
          jurisdiction: formData.jurisdiction,
          platformType: formData.platformType
        },
        options: {
          includeDisputeResolution: formData.includeDisputeResolution,
          includeIntellectualProperty: formData.includeIntellectualProperty,
          includeLimitations: formData.includeLimitations,
          includePrivacyPolicy: formData.includePrivacyPolicy,
          includeProhibitedActivities: formData.includeProhibitedActivities,
          includeTermination: formData.includeTermination,
          includeUserContent: formData.includeUserContent
        },
        specialConditions: formData.specialConditions
      };
      
      const response = await supabase.functions.invoke('claude-legal-generator', {
        body: requestData
      });
      
      if (response.error) {
        throw new Error(`Error generating ${policyType}: ${response.error.message}`);
      }
      
      return response.data.content;
    } catch (error) {
      console.error(`Error generating ${policyType}:`, error);
      throw error;
    }
  };

  const handleGeneratePolicies = async () => {
    const selectedPolicyTypes = form.getValues().policyTypes;
    
    if (selectedPolicyTypes.length === 0) {
      toast({
        title: "No Policy Types Selected",
        description: "Please select at least one policy type to generate.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    setGenerationError(null);
    setCurrentPolicyIndex(0);
    setGenerationProgress(0);
    
    const policies: Record<string, string> = {};
    
    try {
      for (let i = 0; i < selectedPolicyTypes.length; i++) {
        const policyType = selectedPolicyTypes[i];
        setCurrentPolicyIndex(i);
        
        // Update progress
        const progressPerPolicy = 100 / selectedPolicyTypes.length;
        setGenerationProgress((i / selectedPolicyTypes.length) * 100);
        
        toast({
          title: `Generating ${policyTypeOptions.find(p => p.value === policyType)?.label}`,
          description: `Progress: ${i + 1} of ${selectedPolicyTypes.length} policies`,
        });
        
        // Generate policy with Claude
        const policyContent = await generatePolicyWithClaude(policyType);
        policies[policyType] = policyContent;
        
        // Update progress
        setGenerationProgress(((i + 1) / selectedPolicyTypes.length) * 100);
      }
      
      setGeneratedPolicies(policies);
      
      // Combine all generated policies into one document
      let combinedContent = "";
      for (const policyType of selectedPolicyTypes) {
        combinedContent += policies[policyType] + '\n\n';
      }
      
      // Add any AI enhanced text
      if (aiEnhancedText.length > 0) {
        combinedContent += '<div class="additional-clauses">\n';
        combinedContent += '<h2>ADDITIONAL CLAUSES</h2>\n';
        combinedContent += aiEnhancedText.join('\n\n');
        combinedContent += '\n</div>';
      }
      
      setGeneratedTC(combinedContent);
      
      // Save the generated terms to the database
      if (isAuthenticated) {
        try {
          const formData = form.getValues();
          
          const { error } = await supabase
            .from('generated_terms')
            .insert({
              user_id: userId,
              business_name: formData.businessName,
              policy_types: formData.policyTypes,
              form_data: formData,
              generated_content: combinedContent
            });

          if (error) {
            console.error("Error saving to database:", error);
            toast({
              title: "Warning",
              description: "Generated document was created but could not be saved to your account.",
              variant: "destructive",
            });
          }
        } catch (error) {
          console.error("Error saving to database:", error);
        }
      }
      
      // Move to the preview step
      setActiveStep(5);
    } catch (error) {
      console.error("Error generating policies:", error);
      setGenerationError(error.message || "Failed to generate policies. Please try again.");
      
      toast({
        title: "Error",
        description: "Failed to generate policies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleAddAiEnhancedText = (text: string) => {
    setAiEnhancedText((prev) => [...prev, text]);
    
    toast({
      title: "Text Added",
      description: "Your enhanced legal text has been added to the document.",
    });
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="policyTypes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Policy Types *</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {policyTypeOptions.map((option) => (
                      <FormItem
                        key={option.value}
                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(option.value)}
                            onCheckedChange={(checked) => {
                              const currentValue = field.value || [];
                              const newValue = checked
                                ? [...currentValue, option.value]
                                : currentValue.filter((value) => value !== option.value);
                              field.onChange(newValue);
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>{option.label}</FormLabel>
                          <FormDescription>
                            Include {option.label.toLowerCase()} in your document
                          </FormDescription>
                        </div>
                      </FormItem>
                    ))}
                  </div>
                  <FormDescription>
                    Select all the policies you want to include in your document
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
                  <FormLabel>Business Type *</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      const description = businessDescriptionOptions.find(opt => opt.value === value)?.label;
                      field.onChange(description || value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your business type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {businessDescriptionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.value && field.value !== businessDescriptionOptions.find(opt => opt.value === field.value)?.label && (
                    <FormControl>
                      <Textarea 
                        placeholder="Additional details about your business..."
                        className="mt-2"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                  )}
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
                  <Select 
                    onValueChange={(value) => {
                      const label = jurisdictionOptions.find(opt => opt.value === value)?.label;
                      field.onChange(label || value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select jurisdiction" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {jurisdictionOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.value && field.value !== jurisdictionOptions.find(opt => opt.value === field.value)?.label && (
                    <FormControl>
                      <Input 
                        className="mt-2"
                        placeholder="Enter your specific jurisdiction"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </FormControl>
                  )}
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
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <h3 className="text-lg font-medium text-blue-800">Special Conditions</h3>
              <p className="text-sm text-blue-600 mt-1">
                Add any special conditions that should be included in your legal documents, such as:
                <ul className="list-disc ml-5 mt-2">
                  <li>Payment terms (e.g., "40% down payment required")</li>
                  <li>Financial penalties for late payments</li>
                  <li>Quality standards and requirements</li>
                  <li>Communication protocols</li>
                  <li>Delivery timeframes</li>
                </ul>
              </p>
            </div>
            
            <FormField
              control={form.control}
              name="specialConditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Special Conditions</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter any special conditions (e.g., '40% down payment required before work begins', 'All deliverables must meet ISO 9001 standards', etc.)"
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    These special conditions will be converted into formal legal clauses and included in your document.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <h3 className="text-lg font-medium text-blue-800">AI Language Enhancement</h3>
              <p className="text-sm text-blue-600 mt-1">
                Add custom requirements in plain language, and our AI will convert them into formal legal language.
                Any enhanced text will be incorporated into your final document.
              </p>
            </div>
            
            <AiEnhancementSection onAddToDocument={handleAddAiEnhancedText} />
            
            {aiEnhancedText.length > 0 && (
              <div className="mt-8">
                <h4 className="font-medium mb-2">Added to Document:</h4>
                <div className="space-y-2">
                  {aiEnhancedText.map((text, index) => (
                    <div 
                      key={index}
                      className="border rounded-md p-3 bg-gray-50"
                      dangerouslySetInnerHTML={{ __html: text }}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {isGenerating && (
              <div className="space-y-4 mt-6">
                <h4 className="font-medium">Generating Policy Documents</h4>
                <Progress value={generationProgress} className="w-full h-2" />
                <p className="text-sm text-gray-500">
                  Generating {currentPolicyIndex + 1} of {form.getValues().policyTypes.length} policies...
                </p>
              </div>
            )}
            
            {generationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  {generationError}
                </AlertDescription>
              </Alert>
            )}
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            {generatedTC ? (
              <LegalPreview 
                content={generatedTC} 
                businessName={form.getValues().businessName}
                policyTypes={form.getValues().policyTypes}
                onDownload={handleDownload} 
              />
            ) : (
              <div className="text-center py-8">
                <FileText className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Document Generated Yet</h3>
                <p className="text-gray-500 mb-4">
                  Complete all the previous steps and click "Generate Document" to create your legal document.
                </p>
                <Button onClick={handleGeneratePolicies}>Generate Document</Button>
              </div>
            )}
            
            {isAuthenticated && (
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Your Saved Terms</h3>
                <SavedTermsList />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Seo
        title="Terms & Conditions Generator | Create Legal Documents"
        description="Generate professional, legally-sound terms and conditions documents for your website, app, or business with our advanced AI-powered generator."
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Terms & Conditions Generator</h1>
        <p className="text-gray-600">
          Generate comprehensive, professional legal documents for your business with advanced AI enhancements.
        </p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-1">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`flex items-center ${
                step.id === activeStep
                  ? "text-primary"
                  : step.id < activeStep
                  ? "text-gray-500"
                  : "text-gray-300"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                  step.id === activeStep
                    ? "bg-primary text-white"
                    : step.id < activeStep
                    ? "bg-gray-500 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.id < activeStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id + 1
                )}
              </div>
              <span className="hidden md:inline">{step.name}</span>
              {step.id < steps.length - 1 && (
                <div className="w-10 h-1 mx-2 bg-gray-200">
                  <div
                    className={`h-1 bg-primary ${
                      step.id < activeStep ? "w-full" : "w-0"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={isGenerating}
          >
            {activeStep === steps.length - 1 ? "Download" : activeStep === 4 ? "Generate" : "Next"}
          </Button>
        </div>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        {renderStepContent()}
      </div>
    </div>
  );
};

export default TermsConditionsGenerator;
