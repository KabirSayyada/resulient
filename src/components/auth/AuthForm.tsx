
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, LockKeyhole } from "lucide-react";

type Mode = "login" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showConfirmationMessage, setShowConfirmationMessage] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Email not confirmed')) {
            toast({ 
              title: "Email not confirmed", 
              description: "Please check your inbox and click the confirmation link before signing in.",
              variant: "destructive"
            });
          } else {
            throw error;
          }
        } else {
          toast({ title: "Login successful", description: "Welcome back!" });
        }
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
        
        setShowConfirmationMessage(true);
        toast({ 
          title: "Sign up successful", 
          description: "Please check your inbox and click the confirmation link to activate your account." 
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Authentication failed.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (showConfirmationMessage && mode === "signup") {
    return (
      <div className="space-y-4 text-center">
        <div className="p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <Mail className="mx-auto h-12 w-12 text-blue-600 dark:text-blue-400 mb-4" />
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
            Check Your Email
          </h3>
          <p className="text-blue-700 dark:text-blue-300 text-sm">
            We've sent a confirmation link to <strong>{email}</strong>. 
            Click the link in your email to activate your account and sign in.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setShowConfirmationMessage(false);
            setMode("login");
            setEmail("");
            setPassword("");
          }}
          className="w-full"
        >
          Back to Login
        </Button>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit} autoComplete="on">
      <div>
        <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm" htmlFor="email">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
            required
            disabled={submitting}
          />
        </div>
      </div>
      <div>
        <label className="block mb-1 font-semibold text-gray-700 dark:text-gray-300 text-sm" htmlFor="password">
          Password
        </label>
        <div className="relative">
          <LockKeyhole className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10"
            required
            minLength={6}
            disabled={submitting}
          />
        </div>
      </div>
      <Button
        type="submit"
        className="w-full mt-4 flex items-center justify-center"
        disabled={submitting}
      >
        {submitting ? <Loader2 className="mr-2 animate-spin" /> : null}
        {mode === "login" ? "Login" : "Sign Up"}
      </Button>
      <div className="text-center mt-4">
        <button
          type="button"
          className="text-primary font-semibold text-sm underline underline-offset-4"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          disabled={submitting}
        >
          {mode === "login"
            ? "Need an account? Sign up"
            : "Already have an account? Login"}
        </button>
      </div>
    </form>
  );
}
