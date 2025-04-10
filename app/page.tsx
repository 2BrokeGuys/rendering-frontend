"use client";

import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowRight,
  Code,
  Gauge,
  LucideIcon,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Page = () => {
  return (
    <div className="min-h-screen ">
      <HeroSection />
      <div className="container my-8">
        <div className="text-center max-w-screen-xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything you need for professional rendering
          </h2>
          <p className="text-muted-foreground text-lg">
            Our platform combines powerful technology with an intuitive
            interface to deliver exceptional rendering results.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          {[
            {
              icon: Gauge,
              title: "Blazing Fast Rendering",
              description:
                "Render complex scenes up to 10x faster than traditional methods with our distributed cloud infrastructure.",
            },
            {
              icon: Code,
              title: "Scalable Distributed Infrastructure",
              description:
                "Scale from a single frame to thousands with automatic resource allocation that grows with your needs.",
            },
            
            {
              icon: Users,
              title: "Team Collaboration",
              description:
                "Seamlessly collaborate with team members through shared projects, comments, and version control.",
            },
            {
              icon: Shield,
              title: "Secure and Reliable",
              description:
                "Enterprise-grade security with encrypted file transfers and 99.9% uptime guarantee for mission-critical projects.",
            },
          ].map((feature, i) => (
            <FeatureCard
              key={i}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>

      <div className="container flex justify-center items-center max-w-screen-xl min-w-full my-8">
        <div className="rounded-xl border border-slate-300 bg-gradient-to-r from-primary/20 via-primary/10 to-background p-8 md:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 size-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative z-10 max-w-screen-lg">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to transform your rendering workflow?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join RenderBro and accelarate your creative process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/render">
                <Button size="lg" className="gap-2 border-2 border- zinc-300" >
                  Start Free Trial
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section id="showcase" className="py-20 md:py-32 border-b">
            <div className="container">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Stunning projects rendered on our platform*</h2>
                <p className="text-muted-foreground text-lg">
                  Browse through a collection of incredible work created by our users.
                </p>
              </div>

              <Tabs defaultValue="all" className="mb-8">
                <TabsList className="mx-auto flex justify-center">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="architecture">Architecture</TabsTrigger>
                  <TabsTrigger value="product">Product</TabsTrigger>
                  <TabsTrigger value="animation">Animation</TabsTrigger>
                  <TabsTrigger value="vfx">VFX</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="group relative overflow-hidden rounded-lg border">
                        <div className="aspect-video overflow-hidden">
                          <Image
                            src={`/showcase${i + 1}.jpg`}
                            alt={`Showcase render ${i + 1}`}
                            width={640}
                            height={360}
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                          <h3 className="font-bold text-lg">Project Title {i + 1}</h3>
                          <p className="text-sm text-muted-foreground">By Studio Name</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                {["architecture", "product", "animation", "vfx"].map((tab) => (
                  <TabsContent key={tab} value={tab}>
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Loading {tab} projects...</p>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>

              <div className="text-center">
                <Button variant="outline" size="lg">
                  View All Projects
                </Button>
              </div>
            </div>
          </section>


    </div>
  );
};

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-lg border bg-background p-6 hover:shadow-md transition-all">
      <div className="absolute top-0 right-0 size-24 -mt-8 -mr-8 bg-primary/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
          <Icon className="size-6 text-primary" />
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export default Page;
