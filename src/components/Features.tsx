
import { ArrowUpRight, FileText, Shield, Zap, LineChart, Lock, Users } from 'lucide-react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";

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
    <section className="py-16 md:py-24 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center mb-16 relative">
          {/* Add gradient background elements */}
          <div className="absolute -top-20 -left-4 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 right-0 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl"></div>
          
          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-200 to-purple-300 mb-4">
              Powerful Features for Contract Analysis
            </h2>
            <p className="text-xl text-purple-300/70">
              Our AI-powered tools help you understand complex legal documents without the legal degree.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="relative group card-hover"
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="bg-purple-500/10 rounded-lg p-3">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white mb-2 group-hover:text-purple-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-purple-300/70 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="h-4 w-4 text-purple-400" />
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
