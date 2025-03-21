"use client";

import { useSession } from "next-auth/react";
import LogoutButton from "@/components/LogoutButton";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) return <p>Redirecting...</p>;

  return (
    <main>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl">Dashboard</h1>
        <p>Welcome, {session.user?.name}!</p>
        <LogoutButton />
      </div>

      <div></div>
    </main>
  );
}
