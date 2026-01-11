import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ChevronLeft, MapPinOff, Terminal } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background text-foreground overflow-hidden">
      {/* BACKGROUND VISUALS: The Digital Void */}
      <div className="absolute inset-0 z-0">
        {/* Warped Grid Effect */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)`,
            backgroundSize: '4rem 4rem',
            maskImage: 'radial-gradient(ellipse 60% 50% at 50% 50%, #000 10%, transparent 100%)',
            transform: 'perspective(500px) rotateX(60deg) translateY(-100px)'
          }}
        />
        {/* Deep Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-sky-500/10 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Animated Error Code */}
        <div className="relative inline-block mb-8">
          <MapPinOff className="w-16 h-16 text-sky-500/50 absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce" />
          <h1 className="text-[12rem] md:text-[15rem] font-black leading-none tracking-tighter select-none bg-gradient-to-b from-slate-900 to-slate-200 dark:from-white dark:to-white/5 bg-clip-text text-transparent opacity-20">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-2xl">
              LOST PATH
            </h2>
          </div>
        </div>

        {/* Messaging */}
        <div className="max-w-md mx-auto space-y-6">
          <p className="text-lg md:text-xl text-slate-400 font-light leading-relaxed">
            The career coordinates you're looking for don't exist in our current database. 
          </p>

          {/* Technical Breadcrumb */}
          <div className="flex items-center justify-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-mono text-xs text-sky-400/70">
            <Terminal className="w-3.5 h-3.5" />
            <span>Error: Route "{location.pathname}" not found</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Button 
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full sm:w-auto h-12 px-8 rounded-full border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 font-bold tracking-widest uppercase text-xs"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
            
            <Button 
              onClick={() => navigate('/')}
              className="w-full sm:w-auto h-12 px-8 rounded-full bg-gradient-to-r from-sky-500 to-fuchsia-600 hover:scale-105 transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] font-black tracking-widest uppercase text-xs"
            >
              <Home className="w-4 h-4 mr-2" />
              Back to Reality
            </Button>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-bold tracking-[0.4em] text-slate-600 uppercase">
        NiaPath Navigation System v1.0
      </div>
    </div>
  );
};

export default NotFound;