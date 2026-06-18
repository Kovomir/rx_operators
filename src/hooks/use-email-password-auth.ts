import { useCallback, useState } from "react";

import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "register"
type AuthValues = {
  email: string
  password: string
}

export function useEmailPasswordAuth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGitHubSubmitting, setIsGitHubSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const switchMode = useCallback((nextMode: AuthMode) => {
    setMode(nextMode);
    setMessage(null);
    setError(null);
  }, []);

  const submit = useCallback(
    async ({ email, password }: AuthValues) => {
      if (!supabase) {
        setError("Supabase není nastavena.");
        return;
      }

      if (isSubmitting || isGitHubSubmitting) {
        return;
      }

      setIsSubmitting(true);
      setMessage(null);
      setError(null);

      const trimmedEmail = email.trim();

      if (!trimmedEmail || !password) {
        setError("Email a heslo jsou povinné.");
        setIsSubmitting(false);
        return;
      }

      if (mode === "register") {
        const { error: signUpError } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
        });

        if (signUpError) {
          setError(signUpError.message);
        } else {
          setMessage(
            "Registrace úspěšná."
          );
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInError) {
          setError(signInError.message);
        } else {
          setMessage("Přihlášení úspěšné.");
        }
      }

      setIsSubmitting(false);
    },
    [isSubmitting, mode, isGitHubSubmitting]
  );

  const signInWithGitHub = useCallback(
    async () => {
      if (!supabase) {
        setError("Supabase není nastavena.");
        return;
      }

      if (isSubmitting || isGitHubSubmitting) {
        return;
      }

      setIsGitHubSubmitting(true);
      setMessage(null);
      setError(null);

      const redirectTo =
        import.meta.env.VITE_SUPABASE_OAUTH_REDIRECT_TO ??
        (typeof window !== "undefined" ? window.location.origin : undefined);

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: redirectTo ? { redirectTo } : undefined,
      });

      if (oauthError) {
        setError(oauthError.message);
        setIsGitHubSubmitting(false);
        return;
      }

      setMessage("Přesměrování na GitHub...");
      setIsGitHubSubmitting(false);
    },
    [isSubmitting, isGitHubSubmitting]
  );

  return {
    mode,
    setMode: switchMode,
    isSubmitting,
    isGitHubSubmitting,
    message,
    error,
    submit,
    signInWithGitHub,
  };
}
