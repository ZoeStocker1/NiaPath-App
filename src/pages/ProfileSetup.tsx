import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { Loader2, User, BookOpen, Heart, CheckCircle } from 'lucide-react';

interface Interest {
  id: string;
  name: string;
}

interface Subject {
  id: string;
  name: string;
}

interface UserSubject {
  subject_id: string;
  grade: string;
}

export default function ProfileSetup() {
  const { user, devMode } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [interests, setInterests] = useState<Interest[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [userSubjects, setUserSubjects] = useState<UserSubject[]>([]);
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
      
      // Load interests and subjects
      const [interestsResponse, subjectsResponse] = await Promise.all([
        supabase.from('interests').select('*').order('name'),
        supabase.from('academic_subjects').select('*').order('name')
      ]);

      if (interestsResponse.error) throw interestsResponse.error;
      if (subjectsResponse.error) throw subjectsResponse.error;

      setInterests(interestsResponse.data || []);
      setSubjects(subjectsResponse.data || []);

      // Load user's existing data if any
      if (currentUserId) {
        const [userInterestsResponse, userSubjectsResponse] = await Promise.all([
          supabase
            .from('user_interests')
            .select('interest_id')
            .eq('user_id', currentUserId),
          supabase
            .from('user_subjects')
            .select('subject_id, grade')
            .eq('user_id', currentUserId)
        ]);

        if (userInterestsResponse.data) {
          setSelectedInterests(userInterestsResponse.data.map(ui => ui.interest_id));
        }

        if (userSubjectsResponse.data) {
          setUserSubjects(userSubjectsResponse.data);
        }
      }
    } catch (error: any) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInterestChange = (interestId: string, checked: boolean) => {
    if (checked) {
      setSelectedInterests([...selectedInterests, interestId]);
    } else {
      setSelectedInterests(selectedInterests.filter(id => id !== interestId));
    }
  };

  const handleSubjectGradeChange = (subjectId: string, grade: string) => {
    const existingSubject = userSubjects.find(us => us.subject_id === subjectId);
    
    if (existingSubject) {
      setUserSubjects(userSubjects.map(us => 
        us.subject_id === subjectId ? { ...us, grade } : us
      ));
    } else {
      setUserSubjects([...userSubjects, { subject_id: subjectId, grade }]);
    }
  };

  const handleSave = async () => {
    if (!currentUserId) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    
    try {
      // Clear existing data
      await Promise.all([
        supabase.from('user_interests').delete().eq('user_id', currentUserId),
        supabase.from('user_subjects').delete().eq('user_id', currentUserId)
      ]);

      // Insert new interests
      if (selectedInterests.length > 0) {
        const interestInserts = selectedInterests.map(interestId => ({
          user_id: currentUserId,
          interest_id: interestId
        }));

        const { error: interestsError } = await supabase
          .from('user_interests')
          .insert(interestInserts);

        if (interestsError) throw interestsError;
      }

      // Insert new subjects with grades
      if (userSubjects.length > 0) {
        const subjectInserts = userSubjects.map(us => ({
          user_id: currentUserId,
          subject_id: us.subject_id,
          grade: us.grade
        }));

        const { error: subjectsError } = await supabase
          .from('user_subjects')
          .insert(subjectInserts);

        if (subjectsError) throw subjectsError;
      }

      toast({
        title: "Profile Saved!",
        description: "Your interests and subjects have been updated successfully.",
      });

      navigate('/recommendation');
    } catch (error: any) {
      console.error('Error saving profile:', error);
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading profile data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Profile Setup
            </h1>
            <p className="text-lg text-muted-foreground">
              Tell us about your interests and academic performance to get personalized recommendations
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Interests Section */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-primary" />
                  Your Interests
                </CardTitle>
                <CardDescription>
                  Select the areas that interest you most
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {interests.map(interest => (
                    <div key={interest.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`interest-${interest.id}`}
                        checked={selectedInterests.includes(interest.id)}
                        onCheckedChange={(checked) => handleInterestChange(interest.id, checked as boolean)}
                      />
                      <Label 
                        htmlFor={`interest-${interest.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {interest.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Subjects Section */}
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-secondary" />
                  Academic Subjects
                </CardTitle>
                <CardDescription>
                  Add your academic subjects and grades
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {subjects.map(subject => {
                    const userSubject = userSubjects.find(us => us.subject_id === subject.id);
                    return (
                      <div key={subject.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <Label className="text-sm font-medium flex-1">
                          {subject.name}
                        </Label>
                        <Select
                          value={userSubject?.grade || ""}
                          onValueChange={(grade) => handleSubjectGradeChange(subject.id, grade)}
                        >
                          <SelectTrigger className="w-20">
                            <SelectValue placeholder="Grade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">A</SelectItem>
                            <SelectItem value="B">B</SelectItem>
                            <SelectItem value="C">C</SelectItem>
                            <SelectItem value="D">D</SelectItem>
                            <SelectItem value="E">E</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button
              onClick={handleSave}
              disabled={saving || (selectedInterests.length === 0 && userSubjects.length === 0)}
              variant="hero"
              size="lg"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving Profile...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Save Profile
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}