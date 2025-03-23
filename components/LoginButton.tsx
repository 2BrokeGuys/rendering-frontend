"use client";

import { signIn } from "next-auth/react";
import { Button } from "./ui/button";

export default function LoginButton() {
  return (
    <Button
      onClick={() => signIn("google")}
      className="px-4 py-2 border text-white rounded"
    >
      Log in
    </Button>
  );
}
