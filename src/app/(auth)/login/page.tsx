import Link from "next/link";
import { redirect } from "next/navigation";
import { signInAction, signUpAction } from "@/actions/auth";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { appConfig } from "@/lib/config";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCurrentUser } from "@/server/auth";

type LoginPageProps = {
  searchParams: Promise<{ error?: string; message?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error, message } = await searchParams;

  // Already signed in? Go straight to the app.
  if (isSupabaseConfigured() && (await getCurrentUser())) redirect("/");

  return (
    <main className="flex min-h-dvh items-center justify-center bg-surface px-4 py-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <header className="flex flex-col gap-1 text-center">
          <h1 className="text-3xl font-semibold text-foreground">{appConfig.name}</h1>
          <p className="text-base text-muted">{appConfig.tagline}</p>
        </header>

        {!isSupabaseConfigured() ? (
          <Card className="flex flex-col items-start gap-4">
            <div className="flex flex-col gap-1">
              <CardTitle>Demo mode</CardTitle>
              <CardDescription>
                Supabase is not connected yet, so there is no login. You are using a demo user and
                the data lives in memory. Add your Supabase keys (see the README) to switch on real
                accounts.
              </CardDescription>
            </div>
            <Link
              href="/"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-base font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Continue to the app
            </Link>
          </Card>
        ) : (
          <Card>
            <form className="flex flex-col gap-4">
              <CardTitle>Sign in or create an account</CardTitle>
              {error ? <Alert tone="danger">{error}</Alert> : null}
              {message ? <Alert tone="success">{message}</Alert> : null}
              <Input label="Email" name="email" type="email" required autoComplete="email" />
              <Input
                label="Password"
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="current-password"
              />
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button type="submit" formAction={signInAction} className="sm:flex-1">
                  Sign in
                </Button>
                <Button
                  type="submit"
                  formAction={signUpAction}
                  variant="secondary"
                  className="sm:flex-1"
                >
                  Create account
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </main>
  );
}
