import { useForm } from "react-hook-form";
import { GithubIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { useEmailPasswordAuth } from "@/hooks/use-email-password-auth";

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
import { Separator } from "@/components/ui/separator";

type AuthFormValues = {
  email: string;
  password: string;
};

export function AuthForm() {
  const {
    mode,
    setMode,
    isSubmitting,
    isGitHubSubmitting,
    message,
    error,
    submit,
    signInWithGitHub,
  } = useEmailPasswordAuth();
  const isBusy = isSubmitting || isGitHubSubmitting;

  const form = useForm<AuthFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const isLoginMode = mode === "login";
  const title = isLoginMode ? "Vítejte zpět" : "Vytvořte si účet";
  const description = isLoginMode
    ? "Přihlaste se a pokračujte ve studiu operátorů."
    : "Zaregistrujte se a začněte studovat operátory.";
  let submitButtonText = isLoginMode ? "Přihlásit se" : "Vytvořit účet";

  if (isSubmitting) {
    submitButtonText = "Čekejte...";
  }

  return (
    <div className="mx-auto flex min-w-0 w-full max-w-md flex-col gap-5 text-card-foreground">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-normal">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground md:text-base">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={mode === "login" ? "default" : "outline"}
          className="h-10"
          disabled={isBusy}
          onClick={() => setMode("login")}
        >
          Přihlášení
        </Button>
        <Button
          type="button"
          variant={mode === "register" ? "default" : "outline"}
          className="h-10"
          disabled={isBusy}
          onClick={() => setMode("register")}
        >
          Registrace
        </Button>
      </div>

      <Form {...form}>
        <form
          className="space-y-4"
          noValidate
          onSubmit={form.handleSubmit(async (values) => {
            await submit(values);
          })}
        >
          <FormField
            control={form.control}
            name="email"
            rules={{
              required: "Email je povinný.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Zadejte validní email.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    autoComplete="email"
                    disabled={isBusy}
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
            name="password"
            rules={{
              required: "Heslo je povinné.",
              minLength: {
                value: 6,
                message: "Heslo musí mít alespoň 6 znaků.",
              },
            }}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-foreground">
                  Heslo
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Zadejte heslo"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    disabled={isBusy}
                    className="h-11 px-3 text-base placeholder:text-muted-foreground/85 md:text-base"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {mode === "login" && (
            <div className="flex justify-end">
              <Button asChild variant="link" className="h-auto px-0 text-sm">
                <Link to="/forgot-password">Zapomněli jste heslo?</Link>
              </Button>
            </div>
          )}

          <Button type="submit" className="h-11 w-full text-base" disabled={isBusy}>
            {submitButtonText}
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Separator className="flex-1" />
            <span className="shrink-0">nebo se přihlaste pomocí</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-11 w-full text-base"
              disabled={isBusy}
              onClick={() => {
                void signInWithGitHub();
              }}
            >
              <GithubIcon className="size-4" />
              {isGitHubSubmitting ? "Přesměrování..." : "GitHub"}
            </Button>
          </div>
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
    </div>
  );
}
