import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Sparkles, TrendingUp, Award, BookOpen } from 'lucide-react';

interface RecommendedDegree {
  title: string;
  university: string;
}

interface Alternative {
  title: string;
  score: number;
  explanation: string;
}

interface RecommendationData {
  title: string;
  explanation: string;
  recommended_degrees: RecommendedDegree[];
  alternatives?: Alternative[];
}

export default function Recommendation() {
  const { user, session, devMode } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<RecommendationData | null>(null);

  const handleGetRecommendation = async () => {
    setLoading(true);
    
    try {
      let response;
      
      if (devMode) {
        // Dev mode: call function with test user_id
        response = await supabase.functions.invoke('get-recommendation', {
          body: { 
            user_id: "d3c25e6a-71a0-4b0d-a125-8e0731c06a8b" 
          },
        });
      } else {
        // Normal mode: use session token
        if (!session) {
          toast({
            title: "Authentication Required",
            description: "Please log in to get recommendations.",
            variant: "destructive",
          });
          return;
        }

        response = await supabase.functions.invoke('get-recommendation', {
          body: {},
          headers: {
            Authorization: `Bearer ${session.access_token}`,
            apikey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsbnBhZXJ0cW93dmtjdmJwYXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5NjQyNzMsImV4cCI6MjA3NDU0MDI3M30.13yRodl7va76ODofo5BQ-dhmt5k-YARxkD1vRzlfIRg'
          }
        });
      }

      if (response.error) {
        throw response.error;
      }

      setRecommendation(response.data);
      
      toast({
        title: "Recommendation Generated!",
        description: "Your personalized career recommendation is ready.",
      });

    } catch (error: any) {
      console.error('Error getting recommendation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to get recommendation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Career Recommendations
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover personalized career paths based on your interests and academic strengths
            </p>
            
            <Button
              onClick={handleGetRecommendation}
              disabled={loading}
              variant="hero"
              size="lg"
              className="mb-8"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Recommendation...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Get Recommendation
                </>
              )}
            </Button>
          </div>

          {recommendation && (
            <div className="space-y-6">
              {/* Main Recommendation */}
              <Card className="shadow-elegant border-primary/20">
                <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b">
                  <CardTitle className="flex items-center text-2xl">
                    <Award className="w-6 h-6 mr-3 text-primary" />
                    {recommendation.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    {recommendation.explanation}
                  </p>

                  {recommendation.recommended_degrees && recommendation.recommended_degrees.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-lg mb-4 flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-secondary" />
                        Recommended Degrees
                      </h3>
                      <div className="grid gap-3">
                        {recommendation.recommended_degrees.map((degree, index) => (
                          <div key={index} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                            <div>
                              <h4 className="font-medium text-foreground">{degree.title}</h4>
                              <p className="text-sm text-muted-foreground">{degree.university}</p>
                            </div>
                            <Badge variant="secondary" className="ml-4">
                              Recommended
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Alternative Careers */}
              {recommendation.alternatives && recommendation.alternatives.length > 0 && (
                <Card className="shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <TrendingUp className="w-5 h-5 mr-3 text-accent" />
                      Alternative Careers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {recommendation.alternatives.map((alternative, index) => (
                        <div key={index} className="p-4 bg-card border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">{alternative.title}</h4>
                            <Badge variant="outline" className="ml-2">
                              Score: {alternative.score}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {alternative.explanation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {!recommendation && !loading && (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to Discover Your Path?</h3>
              <p className="text-muted-foreground">
                Click the button above to get your personalized career recommendation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}