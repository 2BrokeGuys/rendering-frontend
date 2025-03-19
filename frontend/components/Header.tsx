"use client";

import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";

const Navbar = () => {
  const { data: session } = useSession();

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
        </nav>

        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4">
              {session.user?.image && (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}

              <Link href="/profile">
                <span className="text-sm font-medium">
                  {session.user?.name || "User"}
                </span>
              </Link>

              <button
                onClick={() => signOut()}
                className="border rounded-md px-2 py-2 font-semibold"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="border rounded-md px-2 py-2 font-semibold">
                Log in
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
