import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth } from "@/lib/auth/auth";
import { Button } from "@/components/ui/button";

export default async function GettingStartedPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Getting started
          </p>

          <h1 className="text-3xl font-bold">
            Welcome, {user.name}
          </h1>

          <p className="text-muted-foreground">
            Let&apos;s get your account ready.
          </p>
        </div>

        {/* User information */}
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold">
            Your account
          </h2>

          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground">
                Name
              </p>

              <p className="mt-1 font-medium">
                {user.name || "Not provided"}
              </p>
            </div>

            <div>
              <p className="text-muted-foreground">
                Email
              </p>

              <p className="mt-1 font-medium">
                {user.email}
              </p>
            </div>
          </div>
        </div>

        {/* Continue */}
        <Link
          href="/getting-started/upgrade"
          className="block"
        >
          <Button className="w-full">
            Continue
          </Button>
        </Link>
      </div>
    </main>
  );
}