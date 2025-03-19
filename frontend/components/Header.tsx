"use client"

import Link from "next/link"
import { Button } from "./ui/button"
// import Image from "next/image"

const Navbar = () => {
 
  return (
      <header className=" top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href={"/"} className="text-2xl font-bold hover:text-lime">RenderBro</Link>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/about" className="text-lg font-medium hover:text-lime ">
                How It Works
              </Link>
              <Link href="/pricing" className="text-lg font-medium hover:text-lime ">
                Pricing
              </Link>
              <Link href="/dashboard" className="text-lg font-medium hover:text-lime ">
                Dashboard
              </Link>
              <Link href="/resources" className="text-lg font-medium hover:text-lime ">
                Resources
              </Link>
            </nav>
             
              <div className="hidden md:flex gap-3">
                <Link href={"/login"} className="border rounded-xl  min-w-fit px-4 items-center flex font-semibold border-lime hover:text-black hover:font-semibold hover:bg-lime">Log in
                </Link>
                <Button className="border border-lime rounded-xl  hover:text-black hover:font-semibold hover:bg-lime">Sign Up</Button>
              </div>
          </div>
        </header>
    
  )
}

export default Navbar

