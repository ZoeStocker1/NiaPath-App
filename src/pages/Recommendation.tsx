import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Loader2,
  Sparkles,
  TrendingUp,
  Award,
  BookOpen,
  Download,
  Star,
  ArrowRight,
  ExternalLink,
  MapPin,
  Trophy,
} from "lucide-react";
import FloatingChat from "@/components/FloatingChat";
import { pdf } from "@react-pdf/renderer";
import CareerReport from "@/components/Report";

export default function Recommendation() {
  const { user, session, devMode } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<any | null>(null);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [universities, setUniversities] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (devMode) {
        setUserProfile({ id: "d3c25e6a-71a0-4b0d-a125-8e0731c06a8b", full_name: "Test User", location: "Nairobi" });
      } else if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
        if (data) setUserProfile({ id: user.id, full_name: data.full_name || "User", location: data.location || "Not specified" });
      }
    };
    const fetchUniversities = async () => {
      const { data } = await supabase.from('universities').select('*');
      if (data) {
        const uniMap: Record<string, any> = {};
        data.forEach((u: any) => { uniMap[u.name] = u; });
        setUniversities(uniMap);
      }
    };
    fetchUserProfile();
    fetchUniversities();
  }, [user, devMode]);

  const handleGetRecommendation = async () => {
    setLoading(true);
    try {
      let profileId = userProfile?.id;
      if (!profileId) throw new Error("No profile found.");
      
      const response = await fetch(`https://uxabftbphomuhputdrrc.supabase.co/functions/v1/get-recommendation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile_id: profileId }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setRecommendation(data);
      toast({ title: "Roadmap Generated", description: "Your career intelligence is ready." });
    } catch (error: any) {
      toast({ title: "Analysis Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!recommendation || !userProfile) return;
    setDownloadingPdf(true);
    try {
      const response = await fetch("https://uxabftbphomuhputdrrc.supabase.co/functions/v1/rec-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: devMode ? "" : `Bearer ${session?.access_token}`,
          apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", // Ideally from env
        },
        body: JSON.stringify({
          user: userProfile,
          recommendation: recommendation.recommendation,
          alternatives: recommendation.alternatives || [],
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch report data.");

      const data = await response.json();

      // Generate PDF Blob using @react-pdf/renderer
      const blob = await pdf(<CareerReport data={data} />).toBlob();

      // Trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${userProfile.full_name.replace(/\s+/g, "_")}_Career_Roadmap.pdf`;
      link.click();

      // Clean up URL object
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast({ title: "Download Error", description: error.message, variant: "destructive" });
    } finally {
      setDownloadingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-sky-500/30">
      {/* Dynamic Aura Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-sky-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-fuchsia-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          {/* STATE 1: INITIAL GENERATION */}
          {!recommendation && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
              <div className="p-4 rounded-3xl bg-white/5 border border-white/10 animate-bounce">
                <Sparkles className="w-12 h-12 text-sky-400" />
              </div>
              <div className="space-y-4">
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
                  Find Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-fuchsia-500 text-glow">North Star</span>
                </h1>
                <p className="text-slate-700 dark:text-slate-400 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
                  Our AI engine is ready to synthesize your passions and grades into a 5-year professional blueprint.
                </p>
              </div>
              
              <Button
                onClick={handleGetRecommendation}
                disabled={loading}
                className="h-20 px-12 rounded-2xl bg-white text-black hover:bg-sky-500 hover:text-white transition-all shadow-[0_20px_40px_rgba(255,255,255,0.1)] group relative overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center gap-3 font-black text-lg">
                    <Loader2 className="w-6 h-6 animate-spin" /> SYNTHESIZING DATA...
                  </span>
                ) : (
                  <span className="flex items-center gap-3 font-black text-lg uppercase tracking-tighter">
                    Analyze My Potential <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* STATE 2: RECOMMENDATION DISPLAY */}
          {recommendation && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
              {/* Header Stats */}
              <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/10 pb-8">
                <div className="space-y-2">
                  <Badge className="bg-sky-500/10 text-sky-400 border-sky-500/20 px-3 py-1 uppercase tracking-widest text-[10px] font-black">
                    Analysis Complete
                  </Badge>
                  <h2 className="text-4xl md:text-6xl font-black italic uppercase">Career <span className="text-sky-500">Blueprint</span></h2>
                </div>
                <div className="flex gap-8">
                  <div className="text-right">
                    <div className="text-4xl font-black text-slate-900 dark:text-white">{recommendation.recommendation.score || "98"}%</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Match Strength</div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-fuchsia-600 dark:text-fuchsia-500">{recommendation.alternatives?.length || 0}</div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pathways Found</div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* PRIMARY CAREER SECTION */}
                <div className="lg:col-span-2 space-y-8">
                  <Card className="bg-white/[0.03] border-white/10 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-10 pb-0">
                      <div className="p-3 w-fit rounded-2xl bg-sky-500/20 mb-6">
                        <Trophy className="w-8 h-8 text-sky-400" />
                      </div>
                      <CardTitle className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight uppercase leading-none">
                        {recommendation.recommendation.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-10 space-y-8">
                      <div className="p-6 rounded-2xl bg-sky-100 dark:bg-sky-500/5 border border-sky-200 dark:border-sky-500/10">
                        <h3 className="text-xs font-black text-sky-700 dark:text-sky-500 uppercase tracking-widest mb-3">The AI Verdict</h3>
                        <p className="text-slate-700 dark:text-slate-200 text-lg leading-relaxed italic font-medium">
                          "{recommendation.recommendation.explanation}"
                        </p>
                      </div>
                      <div className="space-y-4">
                        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">Industry Role Description</h3>
                        <p className="text-slate-400 leading-relaxed text-lg font-light">
                          {recommendation.recommendation.description}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ALTERNATIVES */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {recommendation.alternatives?.map((alt: any, i: number) => (
                      <div key={i} className="group p-8 rounded-[2rem] bg-white/5 border border-white/5 hover:border-fuchsia-500/30 transition-all cursor-default">
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-fuchsia-400 transition-colors uppercase italic">{alt.title}</h4>
                          <span className="text-xs font-black text-fuchsia-500 bg-fuchsia-500/10 px-2 py-1 rounded-md">{alt.score}%</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-500 text-sm leading-relaxed line-clamp-3 group-hover:text-slate-400">
                          {alt.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* SIDEBAR: ACADEMIC & TOOLS */}
                <div className="space-y-8">
                  {/* Academic Roadmap */}
                  <div className="p-8 rounded-[2.5rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <BookOpen className="w-5 h-5 text-sky-700 dark:text-sky-400" />
                      <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Education Pathway</h3>
                    </div>
                    <div className="space-y-4">
                      {recommendation.recommendation.recommended_degrees?.map((degree: any, i: number) => {
                        const uni = universities[degree.university];
                        return (
                          <div key={i} className="relative pl-6 border-l-2 border-slate-200 dark:border-white/10 py-1 hover:border-sky-500 transition-colors group">
                            <div className="absolute -left-[5px] top-2 w-2 h-2 rounded-full bg-slate-300 dark:bg-white/20 group-hover:bg-sky-500 transition-colors" />
                            <h4 className="font-bold text-slate-700 dark:text-slate-200 text-sm leading-tight">{degree.title}</h4>
                            <div className="flex items-center gap-2 mt-1">
                              <MapPin className="w-3 h-3 text-slate-500 dark:text-slate-600" />
                              <span className="text-xs text-slate-600 dark:text-slate-500 font-medium">{degree.university}</span>
                            </div>
                            {uni?.website && (
                              <a href={uni.website} target="_blank" className="inline-flex items-center gap-1 text-[10px] text-sky-700 dark:text-sky-400 font-bold uppercase mt-2 hover:underline">
                                Course Info <ExternalLink className="w-2 h-2" />
                              </a>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* PDF Download Area */}
                  <div className="p-8 rounded-[2.5rem] bg-sky-500 text-black flex flex-col gap-6 shadow-[0_20px_50px_rgba(56,189,248,0.2)]">
                    <h3 className="text-2xl font-black uppercase leading-none italic">Download Full Dossier</h3>
                    <p className="text-black/70 text-sm font-bold leading-tight">
                      Includes 5-year skill roadmap, salary expectations, and local university intake deadlines.
                    </p>
                    <Button
                      onClick={handleDownloadReport}
                      disabled={downloadingPdf}
                      className="w-full h-14 bg-black text-white hover:bg-slate-900 rounded-2xl font-black uppercase tracking-widest transition-transform active:scale-95"
                    >
                      {downloadingPdf ? <Loader2 className="w-5 h-5 animate-spin" /> : "Get PDF Report"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <FloatingChat
          recommendation={recommendation}
          session={session}
          devMode={devMode}
        />
      </div>

      <style>{`
        .text-glow {
          text-shadow: 0 0 30px rgba(56,189,248,0.3);
        }
      `}</style>
    </div>
  );
}