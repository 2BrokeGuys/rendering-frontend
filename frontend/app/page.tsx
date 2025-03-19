"use client"

import HeroSection from '@/components/HeroSection';
import { Button } from '@/components/ui/button';
import { ArrowRight, Cloud, Code, Gauge, LucideIcon, Play, Shield, Users } from 'lucide-react';
import Link from 'next/link';

const Page = () => {

  return (
    <div className="min-h-screen ">
        <HeroSection/>     
        <div className="container my-8">
              <div className="text-center max-w-screen-xl mx-auto mb-16 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold">Everything you need for professional rendering</h2>
                <p className="text-muted-foreground text-lg">
                  Our platform combines powerful technology with an intuitive interface to deliver exceptional rendering
                  results.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: Gauge,
                    title: "Blazing Fast Rendering",
                    description:
                      "Render complex scenes up to 10x faster than traditional methods with our distributed cloud infrastructure.",
                  },
                  {
                    icon: Cloud,
                    title: "Scalable Cloud Infrastructure",
                    description:
                      "Scale from a single frame to thousands with automatic resource allocation that grows with your needs.",
                  },
                  {
                    icon: Code,
                    title: "Multi-Engine Support",
                    description:
                      "Compatible with all major rendering engines including V-Ray, Octane, Redshift, Arnold, and more.",
                  },
                  {
                    icon: Play,
                    title: "Real-Time Preview",
                    description:
                      "Monitor your renders in real-time with our interactive preview system, making adjustments on the fly.",
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
                  <FeatureCard key={i} icon={feature.icon} title={feature.title} description={feature.description} />
                ))}
              </div>
            </div>

            <div className="container flex justify-center items-center max-w-screen-xl min-w-full my-8">
              <div className="rounded-xl border bg-gradient-to-r from-primary/20 via-primary/10 to-background p-8 md:p-12 lg:p-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-16 -mr-16 size-64 rounded-full bg-primary/10 blur-3xl" />
                <div className="relative z-10 max-w-screen-xl">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to transform your rendering workflow?</h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    Join thousands of artists and studios who have already accelerated their creative process with
                    RenderBro.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="/main">
                    <Button size="lg" className="gap-2">
                      Start Free Trial
                      <ArrowRight className="size-4" />
                    </Button>
                    </Link>
                    
                    <Button size="lg" variant="outline" className="gap-2">
                      Schedule a Demo
                    </Button>
                  </div>
                </div>
              </div>
            </div>
    </div>
  );
};


interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
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
  )
}

export default Page;