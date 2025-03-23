"use client";

import { Button } from "@/components/ui/button";
import { creditPlans } from "@/lib/plans";
import { toast } from "sonner";

export default function Page() {
  const checkOut = async (
    credits: number,
    price: number,
    productId: string,
  ) => {
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_name: credits,
          product_price: price,
          product_id: productId,
        }),
      });

      const { paymentLink } = await response.json();
      if (paymentLink) {
        window.location.href = paymentLink;
      } else {
        console.error("Failed to get payment link");
        toast.error("Failed to generate a payment link");
      }
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="flex max-w-screen-xl justify-center mx-auto py-16 items-center">
      <div className="container">
        <div className="text-center max-w-screen-xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Choose the perfect plan for your needs
          </h2>
          <p className="text-muted-foreground text-lg">
            From individual artists to large studios, we have pricing options
            that scale with your requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-8">
          {creditPlans.map((plan, i) => (
            <div
              key={i}
              className="rounded-lg border bg-background p-6 space-y-6 text-center"
            >
              <h3 className="text-2xl font-bold">{plan.credits} CC</h3>
              <div className="text-4xl font-bold">₹{plan.price}</div>
              <Button
                className="w-full"
                onClick={() =>
                  checkOut(plan.credits, plan.price, plan.productId)
                }
              >
                Buy Credits
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 p-8 border rounded-lg bg-background">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold">Need a custom solution?</h3>
              <p className="text-muted-foreground mt-1">
                Contact our sales team for volume discounts and custom
                requirements.
              </p>
            </div>
            <Button size="lg" variant="outline" className="min-w-[200px]">
              Contact Sales
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
