"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);
  return (
    <div className="flex max-w-screen-xl justify-center mx-auto h-screen items-center">
      <div className="container">
        <div className="text-center max-w-screen-xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Choose the perfect plan for your needs
          </h2>
          <p className="text-muted-foreground text-lg">
            From individual artists to large studios, we have pricing options
            that scale with your requirements.
          </p>
          <div className="flex items-center justify-center gap-2 pt-4">
            <span
              className={!isAnnual ? "font-medium" : "text-muted-foreground"}
            >
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              id="pricing-toggle"
            />
            <span
              className={isAnnual ? "font-medium" : "text-muted-foreground"}
            >
              Annual (20% off)
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Starter",
              description: "Perfect for individual artists and small projects",
              price: isAnnual ? 19 : 24,
              features: [
                "50 render hours/month",
                "720p & 1080p resolution",
                "2 concurrent renders",
                "Basic support",
                "7-day render history",
                "Standard render engines",
              ],
              cta: "Start Free Trial",
              popular: false,
            },
            {
              title: "Professional",
              description: "Ideal for freelancers and growing studios",
              price: isAnnual ? 49 : 59,
              features: [
                "200 render hours/month",
                "Up to 4K resolution",
                "5 concurrent renders",
                "Priority support",
                "30-day render history",
                "All render engines",
                "Team collaboration tools",
                "API access",
              ],
              cta: "Start Free Trial",
              popular: true,
            },
            {
              title: "Enterprise",
              description: "For studios and production companies",
              price: isAnnual ? 199 : 249,
              features: [
                "1000 render hours/month",
                "Up to 8K resolution",
                "Unlimited concurrent renders",
                "24/7 dedicated support",
                "90-day render history",
                "All render engines",
                "Advanced team tools",
                "Custom integrations",
                "Dedicated resources",
              ],
              cta: "Contact Sales",
              popular: false,
            },
          ].map((plan, i) => (
            <div
              key={i}
              className={`relative rounded-lg border ${plan.popular ? "border-primary shadow-lg" : ""} bg-background`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <Badge className="px-3 py-1 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                </div>
              )}
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold">{plan.title}</h3>
                  <p className="text-muted-foreground mt-1">
                    {plan.description}
                  </p>
                </div>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">${plan.price}</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>
                <ul className="space-y-3">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <CheckCircle className="text-primary size-5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
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
