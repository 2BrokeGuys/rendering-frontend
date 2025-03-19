"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center text-center max-w-md space-y-6">
        <h2 className="text-3xl font-bold">Welcome to CloudRender</h2>
        <p className="text-muted-foreground text-lg">
          Experience high-performance cloud rendering with scalable plans
          tailored to your needs. Sign in to start rendering instantly.
        </p>
        <Button
          className="flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-lg shadow-lg hover:bg-primary/90"
          size="lg"
          onClick={() => signIn("google")}
        >
          <FcGoogle className="size-5" />
          Continue with Google
        </Button>
        <p className="text-sm text-muted-foreground">
          By continuing, you agree to our{" "}
          <a href="/terms" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="/privacy" className="underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
