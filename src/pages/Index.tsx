
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import ParticleEffect from '@/components/ParticleEffect';

const Index = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white page-transition relative overflow-hidden">
      <ParticleEffect />
      <Navbar />
      
      <main className="flex-grow relative z-10">
        <Hero />
        <Features />
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
