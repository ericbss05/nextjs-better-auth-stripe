import { stripe } from "@/lib/payment/stripe";
import { absoluteUrl } from "@/lib/utils";

export async function createCheckoutSession({
  priceId,
  email,
  userId,
}: {
  priceId: string;
  email: string;
  userId: string;
}) {
  return stripe.checkout.sessions.create({
    mode: "subscription",
    billing_address_collection: "auto",
    customer_email: email,

    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],

    success_url: absoluteUrl(
      "/dashboard?success=true"
    ),

    cancel_url: absoluteUrl("/getting-started"),

    metadata: {
      userId,
    },
  });
}

export async function createCustomerPortalSession({
  customerId,
}: {
  customerId: string;
}) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: absoluteUrl("/dashboard/billing"),
  });
}