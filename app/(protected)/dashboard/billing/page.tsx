import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Calendar, Lock, Package } from "lucide-react";

import { auth } from "@/lib/auth/auth";
import { getUserSubscriptionPlan } from "@/lib/payment/subscrition";
import { openCustomerPortal } from "@/actions/open-customer-portal";
import { pricingData } from "@/configs/subscritions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function getInitials(name?: string | null, email?: string | null) {
  const source = name ?? email ?? "";
  return source.trim().charAt(0).toUpperCase() || "?";
}

export default async function BillingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const subscription = await getUserSubscriptionPlan(session.user.id);

  /*
   * Trouver le plan correspondant au Stripe Price ID
   */
  const currentPlan = pricingData.find(
    (plan) =>
      plan.stripeIds.monthly === subscription.stripePriceId ||
      plan.stripeIds.yearly === subscription.stripePriceId
  );

  /*
   * Déterminer si l'abonnement est mensuel ou annuel
   */
  const interval =
    currentPlan?.stripeIds.monthly === subscription.stripePriceId
      ? "month"
      : "year";

  /*
   * Prix actuel
   */
  const price =
    interval === "month"
      ? currentPlan?.prices.monthly
      : currentPlan?.prices.yearly;

  /*
   * Date du prochain renouvellement
   */
  const renewalDate = subscription.stripeCurrentPeriodEnd
    ? new Date(subscription.stripeCurrentPeriodEnd).toLocaleDateString(
        "fr-FR",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      )
    : null;

  const user = session.user;
  const otherPlans = pricingData.filter(
    (plan) => plan.title !== currentPlan?.title
  );

  return (
    <main className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-3xl px-6 py-16">
        {/* Header */}
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Billing
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight">
            Subscription & billing
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your plan, payment method, and invoices.
          </p>
        </div>

        {/* Current plan */}
        <Card className="mt-8 gap-0 overflow-hidden rounded-2xl border p-0 shadow-none">
          <div className="h-1.5 w-full bg-gradient-to-r from-primary to-primary/30" />

          <div className="flex flex-col gap-6 p-8">
            <div className="flex items-start justify-between gap-6">
              <div className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Package className="size-5 text-primary" />
                </span>

                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold">
                      {currentPlan?.title ?? "Paid plan"}
                    </h2>
                    <Badge variant="secondary" className="text-xs">
                      Active
                    </Badge>
                  </div>

                  {currentPlan?.description && (
                    <p className="mt-1 text-sm text-muted-foreground">
                      {currentPlan.description}
                    </p>
                  )}
                </div>
              </div>

              {price !== undefined && (
                <div className="shrink-0 text-right">
                  <p className="text-3xl font-bold tracking-tight">
                    €{price}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    /{interval}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              {renewalDate && (
                <div className="flex items-center gap-3">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Calendar className="size-4 text-muted-foreground" />
                  </span>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Next billing date
                    </p>
                    <p className="text-sm font-medium">{renewalDate}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted">
                  <Lock className="size-4 text-muted-foreground" />
                </span>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment & invoices
                  </p>
                  <p className="text-sm font-medium">Secured by Stripe</p>
                </div>
              </div>
            </div>

            <div>
              <form action={openCustomerPortal}>
                <Button type="submit" className="w-full sm:w-auto">
                  Manage billing
                </Button>
              </form>
              <p className="mt-2 text-xs text-muted-foreground">
                Update your payment method, download invoices, or cancel
                anytime — no need to contact support.
              </p>
            </div>
          </div>
        </Card>

        {/* Change plan */}
        {otherPlans.length > 0 && (
          <div className="mt-10">
            <h3 className="text-sm font-semibold">Change plan</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Switch anytime — billing is prorated automatically.
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {otherPlans.map((plan) => (
                <div
                  key={plan.title}
                  className="flex items-center justify-between rounded-xl border bg-card p-4"
                >
                  <div>
                    <p className="font-medium">{plan.title}</p>
                    <p className="text-sm text-muted-foreground">
                      €{plan.prices.monthly} / month
                    </p>
                  </div>

                  <form action={openCustomerPortal}>
                    <Button type="submit" variant="outline" size="sm">
                      Switch
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Account information */}
        <Card className="mt-10 gap-0 rounded-2xl p-8 shadow-none">
          <p className="text-sm font-semibold">Account</p>

          <div className="mt-5 flex items-center gap-4">
            <Avatar className="size-12">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name ?? "User"}
              />
              <AvatarFallback className="text-base">
                {getInitials(user.name, user.email)}
              </AvatarFallback>
            </Avatar>

            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}