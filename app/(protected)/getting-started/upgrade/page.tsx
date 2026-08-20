import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { auth } from "@/lib/auth/auth";
import { pricingData } from "@/configs/subscritions";
import { generateUserStripe } from "@/actions/generate-user-stripe";
import { Button } from "@/components/ui/button";

type Plan = "pro" | "business";

export default async function UpgradePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-5xl space-y-10">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Step 2 of 2
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Choose your plan
          </h1>

          <p className="mt-2 text-muted-foreground">
            Select the plan that best fits your needs.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {pricingData.map((plan) => {
            const planName =
              plan.title.toLowerCase() as Plan;

            return (
              <div
                key={plan.title}
                className="rounded-xl border p-6"
              >
                <div>
                  <h2 className="text-2xl font-semibold">
                    {plan.title}
                  </h2>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>

                <ul className="mt-6 space-y-2">
                  {plan.benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="text-sm"
                    >
                      ✓ {benefit}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <form
                    action={async () => {
                      "use server";

                      await generateUserStripe(
                        planName,
                        "monthly"
                      );
                    }}
                  >
                    <Button
                      type="submit"
                      className="w-full"
                    >
                      €{plan.prices.monthly}/month
                    </Button>
                  </form>

                  <form
                    action={async () => {
                      "use server";

                      await generateUserStripe(
                        planName,
                        "yearly"
                      );
                    }}
                  >
                    <Button
                      type="submit"
                      variant="outline"
                      className="w-full"
                    >
                      €{plan.prices.yearly}/year
                    </Button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}