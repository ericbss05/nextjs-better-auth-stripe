"use client";

import { useState } from "react";

import { pricingData } from "@/configs/subscritions";
import { PricingCard } from "@/app/(marketing)/_components/pricing/pricing-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PricingPage() {
  const [interval, setInterval] = useState<"monthly" | "yearly">("monthly");

  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-5xl tracking-tight sm:text-6xl">
            Simple &amp; <em className="italic">transparent</em> pricing
            <br />
            for all business sizes
          </h1>
        </div>

        <div className="mt-10 flex justify-center">
          <Tabs
            value={interval}
            onValueChange={(value) =>
              setInterval(value as "monthly" | "yearly")
            }
          >
            <TabsList>
              <TabsTrigger value="monthly">Monthly billing</TabsTrigger>
              <TabsTrigger value="yearly">Annual billing</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-8 lg:grid-cols-3">
          {pricingData.map((plan, index) => (
            <PricingCard
              key={plan.title}
              plan={plan}
              interval={interval}
              previousPlanTitle={
                index > 0 ? pricingData[index - 1].title : undefined
              }
            />
          ))}
        </div>
      </section>
    </main>
  );
}