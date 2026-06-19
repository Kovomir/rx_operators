import { AuthForm } from "@/components/auth/auth-form";
import { GuestPageLayout } from "@/components/auth/guest-page-layout";

export function SignInPage() {
  return (
    <GuestPageLayout>
      <AuthForm />
    </GuestPageLayout>
  );
}
