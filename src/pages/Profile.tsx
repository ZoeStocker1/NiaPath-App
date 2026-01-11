import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Loader2, Save, Camera, Globe, Heart, BookOpen, Plus, 
  Check, MinusCircle, Compass, Sparkles, ArrowRight, Zap 
} from 'lucide-react';

export default function Profile() {
  const { user, devMode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Combined State ---
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    location: '',
    avatar_url: '',
  });

  const [interests, setInterests] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userSubjects, setUserSubjects] = useState<any[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const testUserId = "d3c25e6a-71a0-4b0d-a125-8e0731c06a8b";
  const currentUserId = devMode ? testUserId : user?.id;

  useEffect(() => {
    if (currentUserId) fetchAllData();
  }, [currentUserId]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [profileRes, allIntRes, allSubRes, userIntRes, userSubRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', currentUserId).single(),
        supabase.from('interests').select('*').order('name'),
        supabase.from('academic_subjects').select('*').order('name'),
        supabase.from('user_interests').select('interest_id').eq('user_id', currentUserId),
        supabase.from('user_subjects').select('subject_id, grade').eq('user_id', currentUserId)
      ]);

      if (profileRes.data) setForm(profileRes.data);
      setInterests(allIntRes.data || []);
      setSubjects(allSubRes.data || []);
      if (userIntRes.data) setSelectedInterests(userIntRes.data.map(ui => ui.interest_id));
      if (userSubRes.data) setUserSubjects(userSubRes.data);
    } catch (e) {
      toast({ title: "Sync Error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---
  const handleIdentityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleGradeToggle = (subjectId: string, grade: string) => {
    setUserSubjects(prev => {
      const existing = prev.find(us => us.subject_id === subjectId);
      if (existing?.grade === grade) return prev.filter(us => us.subject_id !== subjectId);
      const filtered = prev.filter(us => us.subject_id !== subjectId);
      return [...filtered, { subject_id: subjectId, grade }];
    });
  };

  const handleAddCustomInterest = async () => {
    if (!customInterest.trim()) return;
    try {
      const { data, error } = await supabase.from('interests').insert([{ name: customInterest.trim() }]).select();
      if (error) throw error;
      if (data?.[0]) {
        setInterests(prev => [...prev, data[0]]);
        setSelectedInterests(prev => [...prev, data[0].id]);
        setCustomInterest("");
      }
    } catch (e) {
      toast({ title: "Interest Error", variant: "destructive" });
    }
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await Promise.all([
        supabase.from('profiles').update(form).eq('id', currentUserId),
        supabase.from('user_interests').delete().eq('user_id', currentUserId),
        supabase.from('user_subjects').delete().eq('user_id', currentUserId)
      ]);

      if (selectedInterests.length > 0) {
        await supabase.from('user_interests').insert(selectedInterests.map(id => ({ user_id: currentUserId, interest_id: id })));
      }
      if (userSubjects.length > 0) {
        await supabase.from('user_subjects').insert(userSubjects.map(us => ({ user_id: currentUserId, ...us })));
      }
      toast({ title: "Profile Synchronized", description: "Identity and academic data updated." });
    } catch (e) {
      toast({ title: "Save Failed", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 className="w-12 h-12 text-sky-500 animate-spin opacity-20" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-sky-500/30 pb-20">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-500/5 blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto px-6 pt-20 relative z-10 space-y-16">
        
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sky-700 dark:text-sky-400 font-bold tracking-[0.3em] text-[10px] uppercase">
              <Compass className="w-4 h-4" /> Personnel Profile
            </div>
            <h1 className="text-6xl font-black italic uppercase tracking-tighter">
              The <span className="text-sky-700 dark:text-sky-500">Identity</span>
            </h1>
            <p className="text-slate-700 dark:text-slate-400 text-lg max-w-xl">
              Manage your professional data and academic intelligence from a single interface.
            </p>
          </div>

          <div className="relative group" onClick={() => fileInputRef.current?.click()}>
            <Avatar className="h-32 w-32 border-4 border-white/5 shadow-2xl transition-all duration-500 group-hover:scale-105 cursor-pointer">
              <AvatarImage src={form.avatar_url} className="object-cover" />
              <AvatarFallback className="bg-slate-800 text-3xl font-black">{form.full_name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-1 right-1 bg-sky-500 p-2 rounded-full border-2 border-[#030712]">
              {avatarUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4 text-white" />}
            </div>
            <input type="file" ref={fileInputRef} onChange={(e) => {/* avatar logic here */}} className="hidden" accept="image/*" />
          </div>
        </header>

        {/* 1. CORE IDENTITY SECTION */}
        <section className="space-y-8">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2 bg-sky-500/10 rounded-lg"><Globe className="w-5 h-5 text-sky-500" /></div>
            <h2 className="text-2xl font-black uppercase tracking-tight italic">Core Identification</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Full Name</Label>
              <Input name="full_name" value={form.full_name} onChange={handleIdentityChange} className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-1 focus:ring-sky-500" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Location Node</Label>
              <Input name="location" value={form.location} onChange={handleIdentityChange} placeholder="e.g. London, UK" className="bg-white/5 border-white/10 h-14 rounded-2xl focus:ring-1 focus:ring-sky-500" />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">Professional Bio / Mission</Label>
              <textarea 
                name="bio" 
                value={form.bio} 
                onChange={handleIdentityChange} 
                className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:ring-1 focus:ring-sky-500 outline-none" 
              />
            </div>
          </div>
        </section>

        {/* 2. ACADEMIC PROFILE SUMMARY CARD (The fancy preview from ProfileSetup) */}
        <section>
          <div className="rounded-[2.5rem] bg-gradient-to-br from-white/5 to-transparent border border-white/10 p-10 shadow-2xl backdrop-blur-2xl">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-8 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-sky-700 dark:text-sky-400" /> Real-time Profile Intelligence
            </h2>
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-black text-slate-700 dark:text-slate-500 uppercase tracking-widest block mb-3">Active Interests</span>
                <div className="flex flex-wrap gap-2">
                  {selectedInterests.length === 0 ? (
                    <span className="text-slate-500 text-xs italic">Awaiting input...</span>
                  ) : (
                    interests.filter(i => selectedInterests.includes(i.id)).map(i => (
                      <span key={i.id} className="px-4 py-1.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-400 font-bold text-[10px] uppercase tracking-wide border border-sky-200 dark:border-sky-500/30">{i.name}</span>
                    ))
                  )}
                </div>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-700 dark:text-slate-500 uppercase tracking-widest block mb-3">Academic Strengths</span>
                <div className="flex flex-wrap gap-2">
                  {userSubjects.length === 0 ? (
                    <span className="text-slate-500 text-xs italic">Awaiting assessment...</span>
                  ) : (
                    userSubjects.map(us => {
                      const subj = subjects.find(s => s.id === us.subject_id);
                      return (
                        <span key={us.subject_id} className="px-4 py-1.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-500/20 text-fuchsia-700 dark:text-fuchsia-400 font-bold text-[10px] uppercase tracking-wide border border-fuchsia-200 dark:border-fuchsia-500/30">
                          {subj?.name}: {us.grade}
                        </span>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. PASSIONS (The Button Cloud) */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sky-500/10 rounded-lg"><Heart className="w-5 h-5 text-sky-500" /></div>
              <h2 className="text-2xl font-black uppercase tracking-tight italic">Passion Selection</h2>
            </div>
            <div className="flex items-center gap-3 bg-white/5 rounded-full px-4 py-2 border border-white/10">
              <input
                type="text"
                placeholder="Custom passion..."
                className="bg-transparent border-none text-[10px] font-bold uppercase focus:outline-none w-32 text-slate-700 dark:text-white"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
              />
              <Plus className="w-4 h-4 text-sky-700 dark:text-sky-500 cursor-pointer" onClick={handleAddCustomInterest} />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {interests.map(interest => {
              const isSelected = selectedInterests.includes(interest.id);
              return (
                <button
                  key={interest.id}
                  onClick={() => toggleInterest(interest.id)}
                  className={`px-6 py-3 rounded-2xl border-2 transition-all duration-300 font-black text-xs uppercase flex items-center gap-2 group ${
                    isSelected 
                    ? "bg-sky-500 border-sky-400 text-white dark:text-white shadow-xl shadow-sky-500/20" 
                    : "bg-muted/60 dark:bg-white/5 border-transparent text-slate-700 dark:text-slate-500 hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  {isSelected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4 opacity-40 group-hover:opacity-100" />}
                  {interest.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. ACADEMICS (The Grade Grid) */}
        <section className="space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-fuchsia-100 dark:bg-fuchsia-500/10 rounded-lg"><BookOpen className="w-5 h-5 text-fuchsia-700 dark:text-fuchsia-500" /></div>
              <h2 className="text-2xl font-black uppercase tracking-tight italic">Academic Grades</h2>
            </div>
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.2em]">Toggle grade to update</span>
                      <span className="text-[10px] text-slate-700 dark:text-slate-400 font-bold uppercase tracking-[0.2em]">Toggle grade to update</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {subjects.map(subject => {
              const userSub = userSubjects.find(us => us.subject_id === subject.id);
              return (
                <div key={subject.id} className={`p-6 rounded-[2rem] border-2 transition-all duration-500 ${
                  userSub ? "bg-fuchsia-100 dark:bg-fuchsia-500/5 border-fuchsia-200 dark:border-fuchsia-500/40 shadow-xl shadow-fuchsia-500/10" : "bg-muted/60 dark:bg-white/5 border-transparent opacity-60 hover:opacity-100"
                }`}>
                  <div className="flex justify-between items-start mb-6">
                    <Label className="block text-[10px] font-black uppercase text-fuchsia-700 dark:text-slate-300 tracking-widest">{subject.name}</Label>
                    {userSub ? <Check className="w-4 h-4 text-fuchsia-700 dark:text-fuchsia-500" /> : <MinusCircle className="w-4 h-4 text-slate-700 dark:text-slate-800" />}
                  </div>
                  <div className="flex gap-1">
                    {['A', 'B', 'C', 'D', 'E'].map(g => (
                      <button
                        key={g}
                        onClick={() => handleGradeToggle(subject.id, g)}
                        className={`flex-1 aspect-square rounded-xl text-xs font-black transition-all ${
                          userSub?.grade === g ? "bg-fuchsia-700 dark:bg-fuchsia-500 text-white scale-110 shadow-lg" : "bg-muted/60 dark:bg-black/40 text-fuchsia-700 dark:text-slate-600 hover:text-white"
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

        {/* SUBMIT FOOTER */}
        <footer className="pt-20 flex flex-col items-center">
          <Button
            onClick={handleSaveAll}
            disabled={saving}
            className="h-20 px-16 rounded-[2.5rem] bg-white text-black font-black text-xl hover:bg-sky-500 hover:text-white transition-all hover:scale-105 active:scale-95 group shadow-2xl"
          >
            {saving ? <Loader2 className="animate-spin mr-3" /> : "SYNC ALL PARAMETERS"} 
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </Button>
          <div className="mt-8 flex items-center gap-4 text-slate-600 font-bold uppercase tracking-[0.5em] text-[10px]">
            <Sparkles className="w-4 h-4 text-sky-500 animate-pulse" /> AI Engine Synced
          </div>
        </footer>

      </div>
    </div>
  );
}