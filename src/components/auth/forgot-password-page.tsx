import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { GuestPageLayout } from "@/components/auth/guest-page-layout";
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

type ForgotPasswordFormValues = {
  email: string;
};

export function ForgotPasswordPage() {
  const { isPasswordResetSubmitting, message, error, requestPasswordReset } =
    useEmailPasswordAuth();

  const form = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  return (
    <GuestPageLayout>
      <div className="mx-auto flex min-w-0 w-full max-w-md flex-col gap-5 text-card-foreground">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-normal">
            Obnova hesla
          </h2>
          <p className="text-sm leading-6 text-muted-foreground md:text-base">
            Zadejte email a pošleme Vám odkaz pro nastavení nového hesla.
          </p>
        </div>

        <Form {...form}>
          <form
            className="space-y-4"
            noValidate
            onSubmit={form.handleSubmit(async (values) => {
              await requestPasswordReset(values);
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
                      disabled={isPasswordResetSubmitting}
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
              disabled={isPasswordResetSubmitting}
            >
              {isPasswordResetSubmitting ? "Čekejte..." : "Poslat odkaz"}
            </Button>

            <Button asChild variant="ghost" className="h-10 w-full">
              <Link to="/login">Zpět na přihlášení</Link>
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
      </div>
    </GuestPageLayout>
  );
}
