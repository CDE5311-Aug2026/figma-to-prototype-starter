import { signOutAction } from "@/actions/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/server/auth";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-foreground md:text-3xl">Account</h1>
        <p className="text-base text-muted">Your sign-in details.</p>
      </header>

      <Card className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <CardDescription>Email</CardDescription>
          <p className="text-base font-medium break-all text-foreground">{user.email}</p>
        </div>
        <div className="flex flex-col items-start gap-1">
          <CardDescription>Mode</CardDescription>
          {user.isDemo ? (
            <Badge tone="warning">Demo mode</Badge>
          ) : (
            <Badge tone="success">Supabase</Badge>
          )}
        </div>
        {user.isDemo ? (
          <p className="text-sm text-muted">
            You are using a fake demo user because Supabase keys are not set. Follow &quot;Connect
            Supabase&quot; in the README to switch on real accounts and a real database.
          </p>
        ) : null}
      </Card>

      <Card className="flex flex-col items-start gap-3">
        <CardTitle>Session</CardTitle>
        <form action={signOutAction}>
          <Button type="submit" variant="secondary">
            Sign out
          </Button>
        </form>
      </Card>
    </div>
  );
}
