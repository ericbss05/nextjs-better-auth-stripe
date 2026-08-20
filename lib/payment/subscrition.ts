import { pricingData } from '@/configs/subscritions';
import prisma from '@/lib/prisma';
import { stripe } from '@/lib/payment/stripe';
import { UserSubscriptionPlan } from '@/types/subscritions';

/**
 * Récupère l'état de l'abonnement Stripe d'un utilisateur.
 */
export async function getUserSubscriptionPlan(
  userId: string,
  options: { checkCanceled?: boolean } = {}
): Promise<UserSubscriptionPlan> {
  const { checkCanceled = true } = options;

  // Vérification de l'identifiant utilisateur.
  if (!userId) {
    throw new Error('Missing parameters');
  }

  // Récupération des informations Stripe enregistrées en base.
  const user = await prisma.user.findFirst({
    where: { id: userId },
    select: {
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripePriceId: true
    }
  });

  if (!user) {
    throw new Error('User not found');
  }

  // L'abonnement reste actif tant que la période payée n'est pas expirée.
  const isPaid =
    !!user.stripePriceId &&
    !!user.stripeCurrentPeriodEnd &&
    user.stripeCurrentPeriodEnd.getTime() + 86_400_000 >
      Date.now();

  // Identification du plan à partir du Price ID Stripe.
  const userPlan =
    pricingData.find(
      (plan) => plan.stripeIds.monthly === user.stripePriceId
    ) ??
    pricingData.find(
      (plan) => plan.stripeIds.yearly === user.stripePriceId
    );

  const plan =
    isPaid && userPlan ? userPlan : pricingData[0];

  // Détermination de la fréquence de facturation.
  const interval = isPaid
    ? userPlan?.stripeIds.monthly === user.stripePriceId
      ? 'month'
      : userPlan?.stripeIds.yearly === user.stripePriceId
        ? 'year'
        : null
    : null;

  let isCanceled = false;

  // Vérification auprès de Stripe si l'abonnement est programmé pour être annulé.
  if (
    checkCanceled &&
    isPaid &&
    user.stripeSubscriptionId
  ) {
    try {
      const stripePlan = await stripe.subscriptions.retrieve(
        user.stripeSubscriptionId
      );

      isCanceled = stripePlan.cancel_at_period_end;
    } catch (error) {
      // En cas d'indisponibilité de Stripe, on conserve temporairement l'accès.
      console.error(
        '[getUserSubscriptionPlan] Stripe error:',
        error
      );
    }
  }

  return {
    ...plan,
    ...user,
    stripeCurrentPeriodEnd:
      user.stripeCurrentPeriodEnd?.getTime() ?? 0,
    isPaid,
    interval,
    isCanceled
  };
}