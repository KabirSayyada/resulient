
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Mail, LockKeyhole, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type Mode = "login" | "signup";

export function AuthForm() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: "Login successful", description: "Welcome back!" });
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        toast({ title: "Sign up successful", description: "Check your inbox to confirm your email." });
      }
    } catch (error: any) {
      setError(error?.message || "Authentication failed. Please try again.");
      toast({
        title: "Error",
        description: error?.message || "Authentication failed.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit} autoComplete="on">
      {error && (
        <Alert variant="destructive" className="bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
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
        <p className="text-xs text-gray-500 mt-1">
          {mode === "signup" ? "Minimum 6 characters required" : "Enter your password"}
        </p>
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
          className="text-primary font-semibold hover:underline underline-offset-4"
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
