
import { Helmet } from "react-helmet-async";

interface SeoProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
}

const Seo = ({ 
  title = "T3RMS - AI-Powered Terms & Conditions Analysis", 
  description = "Advanced AI tool for analyzing and generating terms & conditions documents. Get instant insights and create compliant legal documents.",
  canonicalUrl = "https://t3rms.com"
}: SeoProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "T3RMS",
    "applicationCategory": "LegalServices",
    "description": description,
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": [
      "Terms & Conditions Analysis",
      "Legal Document Generation",
      "Risk Assessment",
      "Compliance Checking"
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
