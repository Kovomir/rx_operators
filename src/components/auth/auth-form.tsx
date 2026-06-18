import { useForm } from "react-hook-form";
import { GithubIcon } from "lucide-react";

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
  email: string
  password: string
}

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

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 rounded-xl border bg-card p-6 text-card-foreground shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Autentizace</h2>
        <p className="text-sm text-muted-foreground">
          Zadejte email a heslo pro{" "}
          {mode === "login" ? "přihlášení" : "vytvoření nového účtu"}.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button
          type="button"
          variant={mode === "login" ? "default" : "outline"}
          disabled={isBusy}
          onClick={() => setMode("login")}
        >
          Přihlášení
        </Button>
        <Button
          type="button"
          variant={mode === "register" ? "default" : "outline"}
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    autoComplete="email"
                    disabled={isBusy}
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
                <FormLabel>Heslo</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Zadejte heslo"
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    disabled={isBusy}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isBusy}>
            {isSubmitting
              ? "Please wait..."
              : mode === "login"
                ? "Přihlásit se"
                : "Vytvořit účet"}
          </Button>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Separator className="flex-1" />
            <span>nebo se přihlašte pomocí</span>
            <Separator className="flex-1" />
          </div>

          <div className="grid grid-cols-1 gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => {
                void signInWithGitHub();
              }}
            >
              <GithubIcon />
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
