
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
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

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
      <div>
        <label className="block mb-1 font-semibold text-gray-700" htmlFor="email">
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
        <label className="block mb-1 font-semibold text-gray-700" htmlFor="password">
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
          className="text-primary font-semibold underline underline-offset-4"
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
