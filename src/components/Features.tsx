
import { ArrowUpRight, FileText, Shield, Zap, LineChart, Lock, Users } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <FileText className="h-5 w-5 text-t3rms-blue" />,
      title: "Document Chunking",
      description: "Efficiently process large contracts by breaking them into manageable sections for detailed analysis."
    },
    {
      icon: <Shield className="h-5 w-5 text-t3rms-blue" />,
      title: "Risk Identification",
      description: "Automatically highlight uncommon language, potential concerns, and financial risks in contracts."
    },
    {
      icon: <Zap className="h-5 w-5 text-t3rms-blue" />,
      title: "AI-Powered Analysis",
      description: "Anthropic Claude 3.5 Sonnet API provides state-of-the-art natural language understanding for accurate insights."
    },
    {
      icon: <LineChart className="h-5 w-5 text-t3rms-blue" />,
      title: "Risk Scoring",
      description: "Quantify contract riskiness with an easy-to-understand scoring system and visual indicators."
    },
    {
      icon: <Lock className="h-5 w-5 text-t3rms-blue" />,
      title: "Data Security",
      description: "Your documents are processed with enterprise-grade security and never stored permanently."
    },
    {
      icon: <Users className="h-5 w-5 text-t3rms-blue" />,
      title: "Team Collaboration",
      description: "Share analysis results with team members and collaborate on contract reviews."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-t3rms-charcoal mb-4">
            Powerful Features for Contract Analysis
          </h2>
          <p className="text-xl text-gray-600">
            Our AI-powered tools help you understand complex legal documents without the legal degree.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative group bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 card-hover"
            >
              <div className="flex items-start gap-4">
                <div className="bg-t3rms-blue/10 rounded-lg p-3">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-t3rms-charcoal mb-2 group-hover:text-t3rms-blue transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="h-4 w-4 text-t3rms-blue" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
