import Link from "next/link"
import { Globe } from "lucide-react"

const Footer = () => {
  return (
    <footer className="border-t py-12 md:py-10">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-4">
                  
                  <span className="text-xl font-bold">RenderBro</span>
                </div>
                <p className="text-muted-foreground mb-4 max-w-xs">
                  Accelerating creativity with powerful cloud rendering for artists and studios worldwide.
                </p>
                <div className="flex gap-4">
                  {["twitter", "facebook", "instagram", "youtube"].map((social) => (
                    <Link
                      key={social}
                      href="#"
                      className="size-10 rounded-full border flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <Globe className="size-5" />
                    </Link>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-4">Product</h4>
                <ul className="space-y-3">
                  {["Features", "Pricing", "Integrations", "Changelog", "Roadmap"].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-4">Resources</h4>
                <ul className="space-y-3">
                  {["Documentation", "Tutorials", "Blog", "Community", "Support"].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-4">Company</h4>
                <ul className="space-y-3">
                  {["About"].map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                        {item}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} RenderBro. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </footer>
  )
}

export default Footer

