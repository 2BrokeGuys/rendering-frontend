import { ArrowRight, ChevronRight, Download, FileUp, Play, Settings } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function page() {
  return (
    <div className="container h-screen items-center flex flex-col justify-center">
              <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                
                <h2 className="text-3xl md:text-4xl font-bold">Four simple steps to stunning renders</h2>
                <p className="text-muted-foreground text-lg">
                  Our streamlined process gets you from upload to final render with minimal friction.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: FileUp,
                    title: "Upload Your Project",
                    description: "Drag and drop your project files or connect directly from your 3D software.",
                  },
                  {
                    icon: Settings,
                    title: "Configure Settings",
                    description: "Set resolution, quality, and other parameters with our intuitive interface.",
                  },
                  {
                    icon: Play,
                    title: "Submit for Rendering",
                    description: "Click render and watch as our cloud infrastructure processes your project.",
                  },
                  {
                    icon: Download,
                    title: "Download Your Render",
                    description: "Get your completed renders in multiple formats, ready for use.",
                  },
                ].map((step, i) => (
                  <div key={i} className="relative">
                    <div className="flex flex-col items-center text-center space-y-4 p-6">
                      <div className="relative">
                        <div className="absolute -inset-3 rounded-full bg-primary/10 animate-pulse" />
                        <div className="relative size-16 rounded-full bg-primary/20 flex items-center justify-center">
                          <step.icon className="size-8 text-primary" />
                        </div>
                        <div className="absolute top-1/2 -right-1/2 transform -translate-y-1/2 hidden lg:block">
                          {i < 3 && <ChevronRight className="size-8 text-muted-foreground" />}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 text-center">
                <Link href="/main" className='flex justify-center items-center gap-2 border border-lime rounded-xl p-4'>
                  Try It Now
                  <ArrowRight className="size-5" />
                </Link>
                
              </div>
            </div>
  )
}

export default page