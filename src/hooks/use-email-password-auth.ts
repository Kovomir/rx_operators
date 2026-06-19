import { useCallback, useState } from "react";
import type { AuthError } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

type AuthMode = "login" | "register";

type AuthValues = {
  email: string;
  password: string;
};

type PasswordResetValues = {
  email: string;
};

export function useEmailPasswordAuth() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGitHubSubmitting, setIsGitHubSubmitting] = useState(false);
  const [isPasswordResetSubmitting, setIsPasswordResetSubmitting] =
    useState(false);
  const [isPasswordUpdateSubmitting, setIsPasswordUpdateSubmitting] =
    useState(false);
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

      if (isSubmitting || isGitHubSubmitting || isPasswordResetSubmitting) {
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
    [isSubmitting, mode, isGitHubSubmitting, isPasswordResetSubmitting]
  );

  const requestPasswordReset = useCallback(
    async ({ email }: PasswordResetValues) => {
      if (!supabase) {
        setError("Supabase není nastavena.");
        return false;
      }

      if (isSubmitting || isGitHubSubmitting || isPasswordResetSubmitting) {
        return false;
      }

      setIsPasswordResetSubmitting(true);
      setMessage(null);
      setError(null);

      const trimmedEmail = email.trim();

      if (!trimmedEmail) {
        setError("Email je povinný.");
        setIsPasswordResetSubmitting(false);
        return false;
      }

      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        trimmedEmail,
        {
          redirectTo: getPasswordResetRedirectUrl(),
        }
      );

      if (resetError) {
        setError(getAuthErrorMessage(resetError));
        setIsPasswordResetSubmitting(false);
        return false;
      }

      setMessage(
        "Pokud účet s tímto emailem existuje, poslali jsme odkaz pro obnovu hesla."
      );
      setIsPasswordResetSubmitting(false);
      return true;
    },
    [isSubmitting, isGitHubSubmitting, isPasswordResetSubmitting]
  );

  const updatePassword = useCallback(
    async (password: string) => {
      if (!supabase) {
        setError("Supabase není nastavena.");
        return false;
      }

      if (isPasswordUpdateSubmitting) {
        return false;
      }

      setIsPasswordUpdateSubmitting(true);
      setMessage(null);
      setError(null);

      if (!password) {
        setError("Heslo je povinné.");
        setIsPasswordUpdateSubmitting(false);
        return false;
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(getAuthErrorMessage(updateError));
        setIsPasswordUpdateSubmitting(false);
        return false;
      }

      setMessage("Heslo bylo změněno. Přesměrováváme Vás do aplikace...");
      setIsPasswordUpdateSubmitting(false);
      return true;
    },
    [isPasswordUpdateSubmitting]
  );

  const signInWithGitHub = useCallback(async () => {
    if (!supabase) {
      setError("Supabase není nastavena.");
      return;
    }

    if (isSubmitting || isGitHubSubmitting || isPasswordResetSubmitting) {
      return;
    }

    setIsGitHubSubmitting(true);
    setMessage(null);
    setError(null);

    const redirectTo = import.meta.env.VITE_SUPABASE_OAUTH_REDIRECT_TO;

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
  }, [isSubmitting, isGitHubSubmitting, isPasswordResetSubmitting]);

  return {
    mode,
    setMode: switchMode,
    isSubmitting,
    isGitHubSubmitting,
    isPasswordResetSubmitting,
    isPasswordUpdateSubmitting,
    message,
    error,
    submit,
    requestPasswordReset,
    updatePassword,
    signInWithGitHub,
  };
}

function getPasswordResetRedirectUrl() {
  const baseUrl = import.meta.env.VITE_SUPABASE_OAUTH_REDIRECT_TO;

  return new URL("/reset-password", baseUrl).toString();
}

function getAuthErrorMessage(error: AuthError) {
  switch (error.code) {
    case "user_already_exists":
    case "email_exists":
      return "Uživatel s tímto emailem již existuje.";
    case "invalid_credentials":
      return "Neplatný email nebo heslo.";
    case "same_password":
      return "Nové heslo musí být jiné než současné.";
    case "weak_password":
      return "Zvolte silnější heslo.";
    default:
      return "Nepodařilo se dokončit autentizaci. Zkuste to prosím znovu, nebo kontaktujte administrátora.";
  }
}
