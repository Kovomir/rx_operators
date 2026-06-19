import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { KeyRoundIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useEmailPasswordAuth } from "@/hooks/use-email-password-auth";
import { supabase } from "@/lib/supabase";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DEFAULT_APP_PATH } from "@/components/layout/navigation";

type PasswordResetFormValues = {
  password: string;
  passwordConfirm: string;
};

type RecoverySessionState = "checking" | "ready" | "missing";

export function PasswordResetForm() {
  const navigate = useNavigate();
  const { isPasswordUpdateSubmitting, message, error, updatePassword } =
    useEmailPasswordAuth();
  const [recoverySessionState, setRecoverySessionState] =
    useState<RecoverySessionState>("checking");
  const [recoverySessionError, setRecoverySessionError] = useState<
    string | null
  >(null);

  const form = useForm<PasswordResetFormValues>({
    defaultValues: {
      password: "",
      passwordConfirm: "",
    },
  });

  useEffect(() => {
    let mounted = true;

    const prepareRecoverySession = async () => {
      if (!supabase) {
        setRecoverySessionState("missing");
        setRecoverySessionError("Supabase není nastavena.");
        return;
      }

      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hashParams = new URLSearchParams(url.hash.replace(/^#/, ""));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      let result;

      if (code !== null) {
        result = await supabase.auth.exchangeCodeForSession(code);
      } else if (accessToken && refreshToken) {
        result = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
      } else {
        result = await supabase.auth.getSession();
      }

      if (!mounted) {
        return;
      }

      if (result.error || !result.data.session) {
        setRecoverySessionState("missing");
        setRecoverySessionError(
          "Odkaz pro obnovu hesla je neplatný nebo vypršel. Požádejte o nový odkaz."
        );
        return;
      }

      if (code !== null || accessToken || refreshToken) {
        window.history.replaceState(null, "", window.location.pathname);
      }

      setRecoverySessionState("ready");
      setRecoverySessionError(null);
    };

    void prepareRecoverySession();

    return () => {
      mounted = false;
    };
  }, []);

  const isPreparingSession = recoverySessionState === "checking";
  const isMissingSession = recoverySessionState === "missing";
  const isFormDisabled =
    isPreparingSession || isMissingSession || isPasswordUpdateSubmitting;
  let submitButtonText = "Změnit heslo";

  if (isPreparingSession) {
    submitButtonText = "Ověřování...";
  } else if (isPasswordUpdateSubmitting) {
    submitButtonText = "Ukládání...";
  }

  return (
    <div className="mx-auto flex min-w-0 w-full max-w-md flex-col gap-5 text-card-foreground">
      <div className="space-y-2">
        <div className="flex size-11 items-center justify-center rounded-xl border bg-muted text-foreground">
          <KeyRoundIcon className="size-5" />
        </div>
        <h2 className="text-2xl font-semibold tracking-normal">
          Nastavení nového hesla
        </h2>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          Zadejte nové heslo pro svůj účet. Odkaz z emailu musí být stále
          platný.
        </p>
      </div>

      {isPreparingSession && (
        <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
          Ověřujeme odkaz pro obnovu hesla...
        </div>
      )}

      <Form {...form}>
        <form
          className="space-y-4"
          noValidate
          onSubmit={form.handleSubmit(async (values) => {
            const wasUpdated = await updatePassword(values.password);

            if (wasUpdated) {
              window.setTimeout(() => {
                navigate(DEFAULT_APP_PATH, { replace: true });
              }, 1200);
            }
          })}
        >
          <FormField
            control={form.control}
            name="password"
            rules={{
              required: "Nové heslo je povinné.",
              minLength: {
                value: 6,
                message: "Heslo musí mít alespoň 6 znaků.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Nové heslo
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Zadejte nové heslo"
                    autoComplete="new-password"
                    disabled={isFormDisabled}
                    className="h-11 px-3 text-base placeholder:text-muted-foreground/85 md:text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="passwordConfirm"
            rules={{
              required: "Potvrzení hesla je povinné.",
              validate: (value) =>
                value === form.getValues("password") || "Hesla se neshodují.",
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Potvrzení hesla
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Zadejte heslo znovu"
                    autoComplete="new-password"
                    disabled={isFormDisabled}
                    className="h-11 px-3 text-base placeholder:text-muted-foreground/85 md:text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="h-11 w-full text-base"
            disabled={isFormDisabled}
          >
            {submitButtonText}
          </Button>
        </form>
      </Form>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-md border border-border bg-muted px-3 py-2 text-sm">
          {message}
        </div>
      )}
      {recoverySessionError && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {recoverySessionError}
        </div>
      )}
    </div>
  );
}
