import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Target, BookOpen, Users, Sparkles, CheckCircle2 } from 'lucide-react';

const Index = () => {
  const { user, devMode } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Personalized Recommendations",
      description: "Get career suggestions tailored to your interests and academic strengths",
      glow: "shadow-[0_0_20px_rgba(56,189,248,0.3)]",
      border: "border-sky-500/50",
      iconColor: "text-sky-400"
    },
    {
      icon: BookOpen,
      title: "Educational Pathways",
      description: "Discover degree programs and universities that match your career goals",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
      border: "border-purple-500/50",
      iconColor: "text-purple-400"
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Benefit from career counseling insights and industry expertise",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.3)]",
      border: "border-emerald-500/50",
      iconColor: "text-emerald-400"
    }
  ];

  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden font-sans">
      {/* STUNNING VISUAL BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Mesh Gradients */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]" />
        
        {/* Particle/Star effect using CSS Radial Gradients */}
        <div className="absolute inset-0 opacity-30" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="container mx-auto px-4 pt-8 pb-0 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-24 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-muted/60 dark:bg-white/5 backdrop-blur-md animate-in fade-in zoom-in duration-700 text-slate-700 dark:text-white">
              <Sparkles className="w-4 h-4 text-sky-500 dark:text-sky-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-700 dark:text-sky-400">AI-Powered Guidance</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-slate-700 to-slate-400 dark:from-white dark:via-white dark:to-white/40 bg-clip-text text-transparent">DISCOVER YOUR</span> <br />
              <span className="bg-gradient-to-r from-sky-500 via-fuchsia-500 to-emerald-400 bg-clip-text text-transparent italic">
                PERFECT CAREER
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-700 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
              We analyze your unique profile to bridge the gap between education and your dream career. Fast, accurate, and hyper-personalized.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                onClick={() => navigate(user || devMode ? '/recommendation' : '/signup')}
                className="h-14 px-10 text-lg font-bold bg-white text-black hover:bg-sky-400 hover:text-white transition-all duration-300 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                GET STARTED NOW
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                onClick={() => navigate(user || devMode ? '/profile-setup' : '/login')}
                variant="outline"
                className="h-14 px-10 text-lg font-bold border-white/20 bg-white/5 backdrop-blur-md hover:bg-white/10 rounded-full"
              >
                {user || devMode ? 'UPDATE PROFILE' : 'SIGN IN'}
              </Button>
            </div>
          </div>

          {/* Features Section - Glassmorphism Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-32">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className={`group relative p-8 rounded-3xl border ${feature.border} bg-muted/60 dark:bg-black/40 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 ${feature.glow}`}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl pointer-events-none" />
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-500`}>
                    <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white">{feature.title}</h3>
                  <p className="text-slate-700 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section - Ultra Glass Container */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-fuchsia-600 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative overflow-hidden rounded-[40px] border border-slate-200/60 dark:border-white/10 bg-white/80 dark:bg-[#0a0a0c] p-12 md:p-20 text-center backdrop-blur-xl">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight text-slate-900 dark:text-white">READY TO SHAPE YOUR FUTURE?</h2>
              <p className="text-xl text-slate-700 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                Join 10,000+ students navigating their future with precision.
              </p>
              
              <div className="flex flex-wrap justify-center gap-8 mb-12">
                {['Personalized AI', 'Market Insights', 'Free to Start'].map((text) => (
                  <div key={text} className="flex items-center gap-2 text-sm font-bold tracking-widest text-slate-700 dark:text-slate-300 uppercase">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    {text}
                  </div>
                ))}
              </div>

              <Button 
                onClick={() => navigate('/signup')}
                className="group relative h-16 px-12 rounded-full overflow-hidden bg-gradient-to-r from-sky-500 to-fuchsia-600 text-xl font-black shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  START YOUR JOURNEY <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;