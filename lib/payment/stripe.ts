import Stripe from "stripe"
import { env } from "@/env.mjs";

export const stripe = new Stripe(env.STRIPE_API_KEY as string, {
  apiVersion: "2026-07-29.dahlia",
  typescript: true,
})