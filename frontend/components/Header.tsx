"use client"

import Link from "next/link"
import { Button } from "./ui/button"
// import Image from "next/image"

const Navbar = () => {
 
  return (
   
    <div className="max-w-screen-xl justify-evenly mx-auto sm:px-6 lg:px-8">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href={"/"} className="text-xl font-bold">RenderBro</Link>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/about" className="text-sm font-medium hover:text-primary">
                How It Works
              </Link>
              <Link href="/pricing" className="text-sm font-medium hover:text-primary">
                Pricing
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                Dashboard
              </Link>
              <Link href="#resources" className="text-sm font-medium hover:text-primary">
                Resources
              </Link>
            </nav>
             
              <div className="hidden md:flex gap-3">
                <Link href={"/login"} className="border rounded-md  min-w-fit px-2 items-center flex font-semibold">Log in
                </Link>
                <Button>Sign Up</Button>
              </div>
          </div>
        </header>
    </div>
    
  )
}

export default Navbar

