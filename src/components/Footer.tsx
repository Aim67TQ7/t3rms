
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0a] border-t border-purple-500/20">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="font-mono text-xl font-bold text-white">
                T<span className="text-purple-500">3</span>RMS
              </span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              AI reads the fine print, so you don't have to.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-purple-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-purple-400 transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-white mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/analyzer" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                  Document Analyzer
                </Link>
              </li>
              <li>
                <Link to="/tcgenerator" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                  T&C Generator
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a href="/terms.html" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                  Terms &amp; Conditions
                </a>
              </li>
              <li>
                <a href="/privacy.html" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1">
            <h3 className="font-medium text-white mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a href="mailto:contact@t3rms.ai" className="text-gray-400 hover:text-purple-400 text-sm transition-colors">
                  contact@t3rms.ai
                </a>
              </li>
            </ul>
          </div>
          
          <div className="col-span-1 md:col-span-2 lg:col-span-4">
            <div className="border-t border-purple-500/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © {currentYear} T3RMS. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-purple-400 text-sm flex items-center gap-1 transition-colors"
                >
                  Status <ExternalLink size={12} />
                </a>
                <a 
                  href="#" 
                  className="text-gray-400 hover:text-purple-400 text-sm flex items-center gap-1 transition-colors"
                >
                  Sitemap <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
