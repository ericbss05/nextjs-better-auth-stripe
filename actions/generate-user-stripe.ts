"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import { getUserSubscriptionPlan } from "@/lib/payment/subscrition";
import {
  createCheckoutSession,
  createCustomerPortalSession,
} from "@/lib/payment/session";
import { pricingData } from "@/configs/subscritions";

type Plan = "pro" | "business";
type Interval = "monthly" | "yearly";

export async function generateUserStripe(
  plan: Plan,
  interval: Interval,
) {
  /*
   * 1. Vérifier l'utilisateur
   */
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  /*
   * Pas connecté
   */
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = session.user;

  if (!user.email) {
    throw new Error("User email missing");
  }

  /*
   * 2. Vérifier l'abonnement
   */
  const subscription = await getUserSubscriptionPlan(
    user.id,
    { checkCanceled: false },
  );

  /*
   * 3. Déjà abonné
   * → Billing
   */
  if (
    subscription.isPaid &&
    subscription.stripeCustomerId
  ) {
    const portalSession =
      await createCustomerPortalSession({
        customerId:
          subscription.stripeCustomerId,
      });

    redirect(portalSession.url);
  }

  /*
   * 4. Trouver le plan
   */
  const selectedPlan = pricingData.find(
    (item) =>
      item.title.toLowerCase() === plan,
  );

  if (!selectedPlan) {
    throw new Error("Invalid subscription plan");
  }

  /*
   * 5. Trouver le Price ID Stripe
   */
  const priceId =
    selectedPlan.stripeIds[interval];

  if (!priceId) {
    throw new Error(
      "Stripe price ID is not configured",
    );
  }

  /*
   * 6. Créer Checkout Stripe
   */
  const checkoutSession =
    await createCheckoutSession({
      priceId,
      email: user.email,
      userId: user.id,
    });

  if (!checkoutSession.url) {
    throw new Error(
      "Stripe checkout URL was not generated",
    );
  }

  /*
   * 7. Redirection vers Stripe
   */
  redirect(checkoutSession.url);
}