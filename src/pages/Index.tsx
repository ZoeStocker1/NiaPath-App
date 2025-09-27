import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Target, BookOpen, Users, Sparkles } from 'lucide-react';

const Index = () => {
  const { user, devMode } = useAuth();
  const navigate = useNavigate();

  const features = [
    {
      icon: Target,
      title: "Personalized Recommendations",
      description: "Get career suggestions tailored to your interests and academic strengths"
    },
    {
      icon: BookOpen,
      title: "Educational Pathways",
      description: "Discover degree programs and universities that match your career goals"
    },
    {
      icon: Users,
      title: "Expert Guidance",
      description: "Benefit from career counseling insights and industry expertise"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
              AI-Powered Career Guidance
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Discover Your Perfect Career Path
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Get personalized career recommendations based on your interests, academic performance, and market demand. 
              Start your journey toward a fulfilling career today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user || devMode ? (
                <>
                  <Button 
                    onClick={() => navigate('/recommendation')}
                    variant="hero"
                    size="lg"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Recommendations
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/profile-setup')}
                    variant="outline"
                    size="lg"
                  >
                    Update Profile
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    onClick={() => navigate('/signup')}
                    variant="hero"
                    size="lg"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/login')}
                    variant="outline"
                    size="lg"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-elegant hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA Section */}
          {!user && !devMode && (
            <div className="text-center bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-8 rounded-2xl border border-primary/20">
              <h2 className="text-3xl font-bold mb-4">Ready to Shape Your Future?</h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join thousands of students who have discovered their ideal career path with our AI-powered recommendations.
              </p>
              <Button 
                onClick={() => navigate('/signup')}
                variant="gradient"
                size="lg"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
