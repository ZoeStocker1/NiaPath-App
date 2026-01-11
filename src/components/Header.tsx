import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Home, Sparkles, Terminal } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export const Header = () => {
    // Light/Dark mode state
    const [isDark, setIsDark] = useState(() => {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
      }
      return false;
    });

    useEffect(() => {
      const root = window.document.documentElement;
      if (isDark) {
        root.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        root.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }, [isDark]);
  const { user, devMode, toggleDevMode, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Left Side: Logo & Navigation */}
        <div className="flex items-center space-x-8">
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-fuchsia-600 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.4)] group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5 text-white dark:text-white text-sky-500" />
            </div>
            <h1 className="text-xl font-black tracking-tighter bg-gradient-to-r from-slate-900 to-slate-500 dark:from-white dark:to-white/60 bg-clip-text text-transparent">
              NIAPATH
            </h1>
          </div>
          
          {(user || devMode) && (
            <nav className="hidden md:flex items-center space-x-1">
              {[
                // { name: 'Home', path: '/', icon: Home },
                { name: 'Recommendations', path: '/recommendation', icon: Sparkles },
                // { name: 'Profile', path: '/profile-setup', icon: User },
              ].map((item) => (
                <Button 
                  key={item.path}
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors hover:bg-muted/60 ${
                    isActive(item.path)
                      ? 'text-sky-500 dark:text-sky-400'
                      : 'text-slate-700 dark:text-slate-400 hover:text-sky-600 dark:hover:text-white'
                  }`}
                >
                  <item.icon className={`w-4 h-4 mr-2 ${isActive(item.path) ? 'text-sky-500 dark:text-sky-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-sky-600 dark:group-hover:text-white'}`} />
                  {item.name}
                  {isActive(item.path) && (
                    <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-sky-500 dark:bg-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.6)]" />
                  )}
                </Button>
              ))}
            </nav>
          )}
        </div>

        {/* Right Side: Auth */}
        <div className="flex items-center space-x-6">
          {/* Light/Dark Mode Toggle */}
          <div className="flex items-center gap-2">
            <Switch id="theme-toggle" checked={isDark} onCheckedChange={setIsDark} />
            <Label htmlFor="theme-toggle" className="text-xs text-slate-700 dark:text-slate-400 select-none cursor-pointer flex items-center gap-1">
              {isDark ? (
                <span className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.95 7.05l-.71-.71M4.05 4.05l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>Dark</span>
              ) : (
                <span className="inline-flex items-center gap-1"><svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>Light</span>
              )}
            </Label>
          </div>
          <div className="h-6 w-[1px] bg-white/10 hidden sm:block" />
          {/* User Auth Section */}
          <div className="flex items-center space-x-3">
            {!devMode && !user ? (
              <div className="flex items-center space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-slate-400 hover:text-white font-bold text-xs tracking-widest uppercase"
                >
                  Login
                </Button>
                <Button 
                  size="sm"
                  onClick={() => navigate('/signup')}
                  className="bg-white text-black hover:bg-sky-400 hover:text-white font-bold text-xs tracking-widest uppercase rounded-full px-5 transition-all"
                >
                  Sign Up
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {user && (
                  <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/profile')}>
                    <Avatar className="h-8 w-8">
                      {user.user_metadata?.avatar_url ? (
                        <AvatarImage src={user.user_metadata.avatar_url} alt={user.user_metadata.full_name || user.email} />
                      ) : (
                        <AvatarFallback>{user.user_metadata?.full_name ? user.user_metadata.full_name[0] : user.email?.[0]}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="hidden lg:flex flex-col items-end">
                      <span className="text-xs font-bold text-slate-900 dark:text-white leading-none group-hover:underline">
                        {user.user_metadata?.full_name || user.email?.split('@')[0]}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        Pro Member
                      </span>
                    </div>
                  </div>
                )}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="h-9 w-9 rounded-full p-0 border-white/10 bg-white/5 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-500 transition-all"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};