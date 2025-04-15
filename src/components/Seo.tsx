
import { Helmet } from "react-helmet-async";

interface SeoProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

const Seo = ({ 
  title = "T3RMS - AI-Powered Terms & Conditions Analysis & Creation", 
  description = "Analyze terms & conditions documents instantly or create custom legal documents with our AI. Get 3 free analyses and generate compliant terms tailored to your needs.",
  canonicalUrl = "https://t3rms.com"
}: SeoProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "T3RMS",
    "applicationCategory": "LegalServices",
    "description": description,
    "offers": [
      {
        "@type": "Offer",
        "name": "Free Analysis",
        "price": "0",
        "priceCurrency": "USD",
        "description": "3 free document analyses"
      },
      {
        "@type": "Offer",
        "name": "Document Creation",
        "price": "4.99",
        "priceCurrency": "USD",
        "description": "Create custom terms & conditions document"
      },
      {
        "@type": "Offer",
        "name": "Credit Pack",
        "price": "9.99",
        "priceCurrency": "USD",
        "description": "50 uses for analysis or document creation"
      }
    ],
    "featureList": [
      "Instant Terms & Conditions Analysis",
      "Custom Legal Document Generation",
      "Risk Assessment",
      "Compliance Checking",
      "Three Free Analyses",
      "Pay-as-you-go Options"
    ]
  };

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};

export default Seo;
