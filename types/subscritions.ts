import { User } from "@/src/generated/prisma/client";

// subcriptions
export type SubscriptionPlan = {
  title: string;
  description: string;
  benefits: string[];
  limitations: string[];
  prices: {
    monthly: number;
    yearly: number;
  };
  stripeIds: {
    monthly: string | null;
    yearly: string | null;
  };
};

export type UserSubscriptionPlan = SubscriptionPlan &
  Pick<User, "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"> & {
    stripeCurrentPeriodEnd: number | null;
    isPaid: boolean;
    interval: "month" | "year" | null;
    isCanceled?: boolean;
  };
  
  export type PlanValue = string | boolean | null;

export type PlansRow = {
  feature: string;
  starter: PlanValue;
  pro: PlanValue;
  business: PlanValue;
  enterprise: PlanValue;
  tooltip?: string;
};