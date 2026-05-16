"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Layers, Loader2, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signup(email, password, fullName);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-white">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[120px]" />
      </div>

      <div className="w-full lg:w-[450px] m-auto p-6 relative z-10">
        <div className="flex flex-col items-center gap-6 mb-8">
          <div className="bg-primary p-3 rounded-2xl shadow-xl shadow-primary/20">
            <UserPlus className="text-white h-8 w-8" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Create workspace</h1>
            <p className="text-muted-foreground">Join TaskManager and start collaborating.</p>
          </div>
        </div>

        <Card className="border-none shadow-2xl shadow-indigo-500/10 bg-white/80 backdrop-blur-sm rounded-3xl p-4">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 text-sm font-medium text-red-600 bg-red-50 rounded-2xl border border-red-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                <Input 
                  id="fullName" 
                  placeholder="John Doe" 
                  required 
                  className="rounded-xl h-12 bg-white/50 border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  required 
                  className="rounded-xl h-12 bg-white/50 border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  placeholder="Create a strong password"
                  className="rounded-xl h-12 bg-white/50 border-gray-100 focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={submitting} className="w-full h-12 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:scale-[1.01] active:scale-[0.99] transition-all">
                {submitting ? <Loader2 className="animate-spin" /> : 'Get Started'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col pt-2 pb-6">
            <div className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary hover:underline font-bold">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-10 tracking-wide uppercase font-medium">
          By signing up, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
