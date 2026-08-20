"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import { pricingData } from "@/configs/subscritions";
import { getUserSubscriptionPlan } from "@/lib/payment/subscrition";

type Plan = "pro" | "business";
type Interval = "monthly" | "yearly";

export async function selectSubscription(
  plan: Plan,
  interval: Interval
) {
  /*
   * 1. Vérifier que le plan existe
   */
  const selectedPlan = pricingData.find(
    (item) =>
      item.title.toLowerCase() === plan
  );

  if (!selectedPlan) {
    throw new Error("Invalid subscription plan");
  }

  /*
   * 2. Vérifier que le prix Stripe existe
   */
  const priceId =
    selectedPlan.stripeIds[interval];

  if (!priceId) {
    throw new Error(
      "Stripe price is not configured for this plan"
    );
  }

  /*
   * 3. Vérifier la session
   */
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  /*
   * 4. Utilisateur non connecté
   */
  if (!session?.user?.id) {
    redirect("/login");
  }

  /*
   * 5. Vérifier l'abonnement
   */
  const subscription =
    await getUserSubscriptionPlan(
      session.user.id,
      { checkCanceled: false }
    );

  /*
   * 6. Déjà abonné
   */
  if (
    subscription.isPaid &&
    subscription.stripeCustomerId
  ) {
    redirect("/dashboard/billing");
  }

  /*
   * 7. Connecté mais pas encore abonné
   */
  redirect("/getting-started/upgrade");
}