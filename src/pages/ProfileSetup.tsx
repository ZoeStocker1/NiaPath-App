import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  BookOpen, 
  Heart, 
  ArrowRight, 
  Sparkles, 
  Plus, 
  Check,
  Compass,
  MinusCircle
} from 'lucide-react';

export default function ProfileSetup() {
  const { user, devMode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [interests, setInterests] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [addingInterest, setAddingInterest] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userSubjects, setUserSubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const testUserId = "d3c25e6a-71a0-4b0d-a125-8e0731c06a8b";
  const currentUserId = devMode ? testUserId : user?.id;

  useEffect(() => {
    if (!currentUserId && !devMode) {
      navigate('/login');
      return;
    }
    loadData();
  }, [currentUserId, devMode, navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [intRes, subRes] = await Promise.all([
        supabase.from('interests').select('*').order('name'),
        supabase.from('academic_subjects').select('*').order('name')
      ]);
      setInterests(intRes.data || []);
      setSubjects(subRes.data || []);

      if (currentUserId) {
        const [uIntRes, uSubRes] = await Promise.all([
          supabase.from('user_interests').select('interest_id').eq('user_id', currentUserId),
          supabase.from('user_subjects').select('subject_id, grade').eq('user_id', currentUserId)
        ]);
        if (uIntRes.data) setSelectedInterests(uIntRes.data.map(ui => ui.interest_id));
        if (uSubRes.data) setUserSubjects(uSubRes.data);
      }
    } catch (e) {
      toast({ title: "Error", description: "Failed to load preferences.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Improved Logic: Toggles the grade off if the same grade is clicked again
  const handleGradeToggle = (subjectId: string, grade: string) => {
    setUserSubjects(prev => {
      const existing = prev.find(us => us.subject_id === subjectId);
      
      if (existing?.grade === grade) {
        // Unselect: Remove the subject entirely if the same grade is clicked
        return prev.filter(us => us.subject_id !== subjectId);
      }
      
      // Select/Update: Replace or add the new grade
      const filtered = prev.filter(us => us.subject_id !== subjectId);
      return [...filtered, { subject_id: subjectId, grade }];
    });
  };

  const handleAddCustomInterest = async () => {
    if (!customInterest.trim()) return;
    setAddingInterest(true);
    try {
      const { data, error } = await supabase.from('interests').insert([{ name: customInterest.trim() }]).select();
      if (error) throw error;
      if (data?.[0]) {
        setInterests(prev => [...prev, data[0]]);
        setSelectedInterests(prev => [...prev, data[0].id]);
        setCustomInterest("");
      }
    } catch (e) {
      toast({ title: "Error", description: "Could not add interest.", variant: "destructive" });
    } finally {
      setAddingInterest(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await Promise.all([
        supabase.from('user_interests').delete().eq('user_id', currentUserId),
        supabase.from('user_subjects').delete().eq('user_id', currentUserId)
      ]);
      if (selectedInterests.length > 0) {
        await supabase.from('user_interests').insert(selectedInterests.map(id => ({ user_id: currentUserId, interest_id: id })));
      }
      if (userSubjects.length > 0) {
        await supabase.from('user_subjects').insert(userSubjects.map(us => ({ user_id: currentUserId, ...us })));
      }
      toast({ title: "Success!", description: "Your journey parameters are set." });
      navigate('/recommendation');
    } catch (e) {
      toast({ title: "Update Failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-sky-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground pb-24 font-sans selection:bg-sky-500/30">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/5 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-20 relative z-10">
        <header className="mb-16">
          <div className="flex items-center gap-2 text-sky-400 font-bold tracking-widest text-[10px] uppercase mb-4">
            <Compass className="w-4 h-4" /> Journey Customization
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 italic">
            Personalize Your <span className="text-sky-700 dark:text-sky-500">Path</span>
          </h1>
          <p className="text-slate-700 dark:text-slate-400 text-lg max-w-xl">
            Highlight your passions and academic strengths. Leave subjects blank if they don't apply to you.
          </p>
        </header>

        {/* Academic Profile Summary Card */}
        <div className="mb-12">
          <div className="rounded-3xl bg-white/5 border border-white/10 p-8 shadow-lg backdrop-blur-xl">
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" /> Your Academic Profile
            </h2>
            <div className="mb-4">
              <span className="font-bold text-slate-300">Interests:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedInterests.length === 0 ? (
                  <span className="text-slate-500 italic">No interests selected.</span>
                ) : (
                  interests.filter(i => selectedInterests.includes(i.id)).map(i => (
                    <span key={i.id} className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 font-bold text-xs">{i.name}</span>
                  ))
                )}
              </div>
            </div>
            <div>
              <span className="font-bold text-slate-300">Academic Subjects:</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {userSubjects.length === 0 ? (
                  <span className="text-slate-500 italic">No subjects selected.</span>
                ) : (
                  userSubjects.map(us => {
                    const subj = subjects.find(s => s.id === us.subject_id);
                    return (
                      <span key={us.subject_id} className="px-3 py-1 rounded-full bg-fuchsia-500/20 text-fuchsia-400 font-bold text-xs">
                        {subj?.name || "Subject"}: {us.grade}
                      </span>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-20">
          {/* PASSIONS SECTION */}
          <section className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/10 rounded-lg"><Heart className="w-5 h-5 text-sky-500" /></div>
              <h2 className="text-2xl font-bold tracking-tight uppercase">What sparks your interest?</h2>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {interests.map(interest => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => toggleInterest(interest.id)}
                    className={`px-6 py-3 rounded-full border-2 transition-all duration-300 font-bold flex items-center gap-2 group ${
                      isSelected 
                      ? "bg-sky-500 border-sky-400 text-white shadow-[0_10px_20px_-5px_rgba(56,189,248,0.4)]" 
                      : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10 hover:border-white/20"
                    }`}
                  >
                    {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 opacity-40 group-hover:opacity-100" />}
                    {interest.name}
                  </button>
                );
              })}
              
              <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-1 border border-white/5">
                <input
                  type="text"
                  placeholder="Custom passion..."
                  className="bg-transparent border-none text-sm focus:outline-none w-32 font-medium"
                  value={customInterest}
                  onChange={(e) => setCustomInterest(e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={handleAddCustomInterest} className="h-8 w-8 hover:text-sky-400">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </section>

          {/* ACADEMICS SECTION */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-fuchsia-500/10 rounded-lg"><BookOpen className="w-5 h-5 text-fuchsia-500" /></div>
                <h2 className="text-2xl font-bold tracking-tight uppercase">Academic Performance</h2>
              </div>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                Tap a grade again to unselect
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {subjects.map(subject => {
                const userSub = userSubjects.find(us => us.subject_id === subject.id);
                return (
                  <div 
                    key={subject.id} 
                    className={`p-6 rounded-3xl border-2 transition-all duration-500 ${
                      userSub?.grade 
                      ? "bg-fuchsia-500/5 border-fuchsia-500/40 shadow-[0_10px_30px_-15px_rgba(217,70,239,0.2)]" 
                      : "bg-white/5 border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <Label className="block text-xs font-black uppercase text-slate-300 tracking-[0.1em]">
                        {subject.name}
                      </Label>
                      {userSub?.grade ? (
                        <Check className="w-4 h-4 text-fuchsia-500 animate-in zoom-in" />
                      ) : (
                        <MinusCircle className="w-4 h-4 text-slate-700" />
                      )}
                    </div>
                    
                    <div className="flex gap-1.5">
                      {['A', 'B', 'C', 'D', 'E'].map(g => (
                        <button
                          key={g}
                          onClick={() => handleGradeToggle(subject.id, g)}
                          className={`flex-1 aspect-square rounded-xl text-sm font-black transition-all ${
                            userSub?.grade === g 
                            ? "bg-fuchsia-500 text-white scale-110 shadow-lg" 
                            : "bg-black/40 text-slate-500 hover:text-white hover:bg-white/10"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* SUBMIT */}
          <footer className="pt-10 flex flex-col items-center">
            <Button
              onClick={handleSave}
              disabled={saving || (selectedInterests.length === 0 && userSubjects.length === 0)}
              className="h-20 px-16 rounded-3xl bg-white text-black font-black text-xl hover:bg-sky-500 hover:text-white transition-all hover:scale-105 active:scale-95 group shadow-2xl"
            >
              GENERATE CAREER PATH <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
            <p className="mt-6 text-[10px] text-slate-600 font-bold uppercase tracking-[0.5em]">
              <Sparkles className="inline w-3 h-3 mr-2 text-sky-500" /> AI Engine Ready
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}