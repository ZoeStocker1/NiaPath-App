import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, UserPlus, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

const signupSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }).max(255),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Signup() {
  const { signUp, user, devMode } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (user || devMode) {
      navigate('/profile-setup');
    }
  }, [user, devMode, navigate]);

  // Dynamic Password Strength Logic
  const passwordStrength = useMemo(() => {
    let score = 0;
    if (!password) return { score: 0, label: "Awaiting Input", color: "bg-slate-800", textColor: "text-slate-600" };
    
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const levels = [
      { label: "Vulnerable", color: "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]", textColor: "text-red-400" },
      { label: "Weak", color: "bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]", textColor: "text-orange-400" },
      { label: "Moderate", color: "bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]", textColor: "text-yellow-400" },
      { label: "Secure", color: "bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.5)]", textColor: "text-sky-400" },
      { label: "Unbreakable", color: "bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.6)]", textColor: "text-fuchsia-400" }
    ];
    return { score, ...levels[score] };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const validatedData = signupSchema.parse({ email, password, confirmPassword });
      setLoading(true);
      
      const { error } = await signUp(validatedData.email, validatedData.password);
      if (error) throw error;

      toast({ 
        title: "Initialization Successful", 
        description: "Verify your email to complete the uplink." 
      });
      navigate('/profile-setup');
    } catch (error: any) {
      toast({
        title: error instanceof z.ZodError ? "Validation Conflict" : "Uplink Failed",
        description: error instanceof z.ZodError ? error.errors[0].message : error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-sky-500/30">
      {/* Background Cinematic Ambience */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Branding/Logo Area */}
        <div className="flex flex-col items-center mb-8 space-y-3">
           <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-500 to-fuchsia-600 shadow-[0_0_30px_rgba(56,189,248,0.4)] transition-transform hover:scale-110 duration-500 text-slate-900 dark:text-white">
              <UserPlus className="w-8 h-8 text-white" />
           </div>
           <div className="text-center">
             <h2 className="text-xs font-black tracking-[0.4em] text-sky-400 uppercase">Registry Terminal</h2>
             <div className="h-[1px] w-12 bg-sky-500/30 mx-auto mt-2" />
           </div>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-3xl shadow-2xl relative overflow-hidden ring-1 ring-white/10">
          {/* Top scanning line effect */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
          
          <CardHeader className="space-y-2 text-center pt-8">
            <CardTitle className="text-4xl font-black tracking-tighter text-white uppercase italic">
              Create <span className="text-sky-400">Account</span>
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Establish your credentials for AI pathfinding
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Network Identity (Email)
                </Label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 group-focus-within:text-sky-400 transition-colors" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@niapath.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-black/40 border-white/10 text-white placeholder:text-slate-700 focus:border-sky-500/50 focus:ring-sky-500/10 h-12 rounded-xl transition-all"
                    required
                  />
                </div>
              </div>

              {/* Password Field with Strength Meter */}
              <div className="space-y-2">
                <div className="flex justify-between items-end mb-1 px-1">
                  <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Access Key
                  </Label>
                  <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors duration-500 ${passwordStrength.textColor}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 group-focus-within:text-fuchsia-400 transition-colors" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-black/40 border-white/10 text-white placeholder:text-slate-700 focus:border-fuchsia-500/50 focus:ring-fuchsia-500/10 h-12 rounded-xl transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Segmented Strength Meter */}
                <div className="grid grid-cols-4 gap-2 px-1 pt-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`h-1 rounded-full transition-all duration-700 ease-out ${
                        passwordStrength.score >= step 
                          ? passwordStrength.color 
                          : "bg-white/5"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">
                  Confirm Access Key
                </Label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4 group-focus-within:text-fuchsia-400 transition-colors" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 bg-black/40 border-white/10 text-white placeholder:text-slate-700 focus:border-fuchsia-500/50 focus:ring-fuchsia-500/10 h-12 rounded-xl transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-xl bg-gradient-to-r from-sky-500 to-fuchsia-600 text-white font-black tracking-[0.2em] uppercase hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_10px_30px_-10px_rgba(56,189,248,0.5)] group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-14 group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>Initialize Uplink <Sparkles className="w-4 h-4" /></>
                  )}
                </span>
              </Button>
            </form>

            <div className="mt-10 text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Identified User?{' '}
                <Link 
                  to="/login" 
                  className="text-sky-400 hover:text-white transition-colors ml-2 underline underline-offset-4 decoration-sky-500/30"
                >
                  Return to Terminal
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* System Footer */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-[9px] text-slate-600 uppercase tracking-[0.3em] font-medium leading-relaxed">
            NiaPath Protocol v2.0.4 <br />
            Secure Encrypted Transaction
          </p>
        </div>
      </div>
    </div>
  );
}