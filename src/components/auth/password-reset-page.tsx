import { GuestPageLayout } from "@/components/auth/guest-page-layout";
import { PasswordResetForm } from "@/components/auth/password-reset-form";

export function PasswordResetPage() {
  return (
    <GuestPageLayout>
      <PasswordResetForm />
    </GuestPageLayout>
  );
}
