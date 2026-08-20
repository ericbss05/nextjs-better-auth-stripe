import { headers } from "next/headers";
import Stripe from "stripe";

import { env } from "@/env.mjs";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/payment/stripe";

export async function POST(req: Request) {
  const body = await req.text();

  const signature = (await headers()).get(
    "stripe-signature"
  );

  if (!signature) {
    return new Response("Missing signature", {
      status: 400,
    });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return new Response("Invalid signature", {
      status: 400,
    });
  }

  /*
   * 1. Paiement initial terminé
   */
  if (event.type === "checkout.session.completed") {
    const session =
      event.data.object as Stripe.Checkout.Session;

    if (
      !session.subscription ||
      !session.metadata?.userId
    ) {
      return new Response("Missing data", {
        status: 400,
      });
    }

    const subscription =
      (await stripe.subscriptions.retrieve(
        session.subscription as string
      )) as unknown as Stripe.Subscription;

    const item = subscription.items.data[0];

    if (!item) {
      return new Response(
        "Missing subscription item",
        {
          status: 400,
        }
      );
    }

    await prisma.user.update({
      where: {
        id: session.metadata.userId,
      },
      data: {
        stripeCustomerId:
          subscription.customer as string,

        stripeSubscriptionId:
          subscription.id,

        stripePriceId:
          item.price.id,

        stripeCurrentPeriodEnd:
          new Date(
            item.current_period_end * 1000
          ),
      },
    });

    console.log(
      "Subscription created:",
      subscription.id
    );
  }

  /*
   * 2. Renouvellement payé
   */
  if (event.type === "invoice.payment_succeeded") {
    const invoice =
      event.data.object as Stripe.Invoice;

    const subscriptionId =
      invoice.parent?.subscription_details
        ?.subscription;

    if (!subscriptionId) {
      return new Response(null, {
        status: 200,
      });
    }

    const subscription =
      (await stripe.subscriptions.retrieve(
        subscriptionId as string
      )) as unknown as Stripe.Subscription;

    const item = subscription.items.data[0];

    if (!item) {
      return new Response(null, {
        status: 200,
      });
    }

    await prisma.user.update({
      where: {
        stripeSubscriptionId: subscription.id,
      },
      data: {
        stripePriceId: item.price.id,

        stripeCurrentPeriodEnd:
          new Date(
            item.current_period_end * 1000
          ),
      },
    });

    console.log(
      "Subscription renewed:",
      subscription.id
    );
  }

  /*
   * 3. Abonnement modifié
   *
   * Couvre les changements de plan faits directement dans le portail
   * Stripe (upgrade/downgrade — exactement ce que fait le bouton
   * "Switch" sur la page billing), et les changements de statut
   */
  if (event.type === "customer.subscription.updated") {
    const subscription =
      event.data.object as Stripe.Subscription;

    const item = subscription.items.data[0];

    if (item) {
      await prisma.user
        .update({
          where: {
            stripeSubscriptionId: subscription.id,
          },
          data: {
            stripePriceId: item.price.id,
            stripeCurrentPeriodEnd: new Date(
              item.current_period_end * 1000
            ),
          },
        })
        .catch(() => {
          // Aucun utilisateur avec cet abonnement (ex: abonnement de
          // test créé hors de l'app) — rien à synchroniser.
        });

      console.log(
        "Subscription updated:",
        subscription.id
      );
    }
  }

  /*
   * 4. Abonnement supprimé
   *
   * Se déclenche pour une annulation immédiate ET pour la fin de
   * période naturelle après un "cancel_at_period_end". Dans les deux
   * cas on coupe l'accès tout de suite en vidant les champs Stripe,
   */
  if (event.type === "customer.subscription.deleted") {
    const subscription =
      event.data.object as Stripe.Subscription;

    await prisma.user
      .update({
        where: {
          stripeSubscriptionId: subscription.id,
        },
        data: {
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      })
      .catch(() => {
      });

    console.log(
      "Subscription canceled:",
      subscription.id
    );
  }

  return new Response(null, {
    status: 200,
  });
}