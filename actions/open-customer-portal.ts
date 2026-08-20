"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import { getUserSubscriptionPlan } from "@/lib/payment/subscrition";
import { stripe } from "@/lib/payment/stripe";
import { absoluteUrl } from "@/lib/utils";

const billingUrl = absoluteUrl("/dashboard/billing");

export async function openCustomerPortal() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/login");
  }

  const subscription = await getUserSubscriptionPlan(
    session.user.id,
    { checkCanceled: false }
  );

  if (!subscription.stripeCustomerId) {
    redirect("/pricing");
  }

  const stripeSession =
    await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: billingUrl,
    });

  redirect(stripeSession.url);
}