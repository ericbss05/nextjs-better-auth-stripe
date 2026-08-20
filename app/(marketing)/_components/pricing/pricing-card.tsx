"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, Minus } from "lucide-react";

import { generateUserStripe } from "@/actions/generate-user-stripe";
import { SubscriptionPlan } from "@/types/subscritions";
import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type PricingCardProps = {
  plan: SubscriptionPlan;
  interval?: "monthly" | "yearly";
  isPaid?: boolean;
  /** Title of the tier just below this one, used for the "Everything in X plus…" line. */
  previousPlanTitle?: string;
};

export function PricingCard({
  plan,
  interval = "monthly",
  isPaid = false,
  previousPlanTitle,
}: PricingCardProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isFree = plan.prices.monthly === 0;
  const isPopular = plan.title === "Pro";

  const currentPrice =
    interval === "yearly" ? plan.prices.yearly : plan.prices.monthly;

  function handleSubscribe() {
    if (isFree) {
      return;
    }

    const planSlug = plan.title.toLowerCase();

    if (planSlug !== "pro" && planSlug !== "business") {
      console.error("Invalid subscription plan");
      return;
    }

    /*
     * Utilisateur déjà abonné
     * → billing
     */
    if (isPaid) {
      router.push("/dashboard/billing");
      return;
    }

    /*
     * Utilisateur non abonné
     * → Server Action
     * → Stripe Checkout
     */
    startTransition(async () => {
      await generateUserStripe(planSlug as "pro" | "business", interval);
    });
  }

  return (
    <Card className="relative flex flex-col gap-6 rounded-2xl p-8 shadow-none">

      <CardTitle className="text-lg font-semibold">{plan.title}</CardTitle>

      <div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-4xl font-bold tracking-tight">
            €{currentPrice}
          </span>
          {!isFree && (
            <span className="text-sm text-muted-foreground">
              per {interval === "yearly" ? "year" : "month"}
            </span>
          )}
        </div>

        {!isFree && interval === "yearly" && (
          <p className="mt-1 text-sm text-muted-foreground">
            Billed annually
          </p>
        )}
      </div>

      <Button
        type="button"
        size="lg"
        variant={isPopular ? "default" : "secondary"}
        onClick={handleSubscribe}
        disabled={isFree || isPending}
        className="h-11 w-full rounded-xl text-sm font-semibold"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Redirecting...
          </>
        ) : isFree ? (
          "Current plan"
        ) : isPaid ? (
          "Manage subscription"
        ) : (
          "Get started"
        )}
      </Button>

      <Separator />

      <div>
        <p className="text-sm font-semibold">FEATURES</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {previousPlanTitle
            ? `Everything in ${previousPlanTitle} plus....`
            : "Everything you need to get started"}
        </p>

        <ul className="mt-5 space-y-3">
          {plan.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-sm">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                <Check
                  className="size-3 text-primary-foreground"
                  strokeWidth={3}
                />
              </span>
              <span>{benefit}</span>
            </li>
          ))}

          {plan.limitations.map((limitation) => (
            <li
              key={limitation}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-muted">
                <Minus className="size-3" strokeWidth={3} />
              </span>
              <span>{limitation}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}