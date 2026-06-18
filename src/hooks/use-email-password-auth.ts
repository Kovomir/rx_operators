import { useCallback, useState } from "react";
import type { AuthError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "register";

type AuthValues = {
  email: string;
  password: string;
};

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
        const { data: signUpData, error: signUpError } =
          await supabase.auth.signUp({
            email: trimmedEmail,
            password,
          });

        if (signUpError) {
          setError(getAuthErrorMessage(signUpError));
          setIsSubmitting(false);
          return;
        }

        if (!signUpData.session) {
          const { error: signInError } =
            await supabase.auth.signInWithPassword({
              email: trimmedEmail,
              password,
            });

          if (signInError) {
            setError(getAuthErrorMessage(signInError));
            setIsSubmitting(false);
            return;
          }
        }

        setMessage("Registrace úspěšná. Přihlašujeme Vás...");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInError) {
          setError(getAuthErrorMessage(signInError));
        } else {
          setMessage("Přihlášení úspěšné.");
        }
      }

      setIsSubmitting(false);
    },
    [isSubmitting, mode, isGitHubSubmitting]
  );

  const signInWithGitHub = useCallback(async () => {
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
      setError(getAuthErrorMessage(oauthError));
      setIsGitHubSubmitting(false);
      return;
    }

    setMessage("Přesměrování na GitHub...");
    setIsGitHubSubmitting(false);
  }, [isSubmitting, isGitHubSubmitting]);

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

function getAuthErrorMessage(error: AuthError) {
  switch (error.code) {
    case "user_already_exists":
    case "email_exists":
      return "Uživatel s tímto emailem již existuje.";
    case "invalid_credentials":
      return "Neplatný email nebo heslo.";
    default:
      return "Nepodařilo se dokončit autentizaci. Zkuste to prosím znovu, nebo kontaktujte administrátora.";
  }
}
