"use client";

import Link from "next/link";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={"/"} className="text-xl font-bold">
            RenderBro
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/about"
            className="text-sm font-medium  hover:translate-y-1/4"
          >
            How It Works
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium  hover:translate-y-1/4"
          >
            Pricing
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-medium  hover:translate-y-1/4"
          >
            Dashboard
          </Link>
          <Link
            href="#resources"
            className="text-sm font-medium  hover:translate-y-1/4"
          >
            Resources
          </Link>
        </nav>

        <div className="hidden md:flex">
          <Link
            href={"/login"}
            className="border rounded-md  min-w-fit px-2 py-2 items-center flex font-semibold"
          >
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
