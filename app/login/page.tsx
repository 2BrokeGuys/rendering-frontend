"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";

export default function login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/");
    }
  }, [status, router]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await signIn("google", { callbackUrl: "/", redirect: false });
      if (res?.error) {
        setError("Login failed. Please try again.");
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground px-4">
      <div className="flex flex-col items-center text-center max-w-md space-y-6">
        {/* Branding / Logo */}
        <Image
          src="/RB_W.png" // Replace with your actual logo path
          alt="CloudRender Logo"
          width={60}
          height={60}
          className="mb-4"
        />

        <h2 className="text-3xl font-bold">Welcome to RenderBro</h2>
        <p className="text-muted-foreground text-lg">
          Experience high-performance cloud rendering with scalable plans tailored to your needs. Sign in to start rendering instantly.
        </p>

        <Button
          className="flex items-center gap-3 px-6 py-3 bg-primary border-white border text-primary-foreground rounded-lg shadow-lg hover:bg-primary/90"
          size="lg"
          onClick={handleLogin}
          disabled={loading || status === "loading"}
          aria-label="Sign in with Google"
        >
          {loading ? (
            <span className="animate-pulse text-sm">Loading...</span>
          ) : (
            <>
              <FcGoogle className="size-5" />
              Continue with Google
            </>
          )}
        </Button>

        {/* Error Display */}
        {error && <p className="text-sm text-red-500">{error}</p>}

        {/* Legal Notice */}
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
