// THIS IS A TEST PAGE FOR AUTH

"use client";

import LoginButton from "@/components/LoginButton";
import LogoutButton from "@/components/LogoutButton";
import { useSession } from "next-auth/react";
import Image from "next/image";

const Page = () => {
  const { data: session } = useSession();

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      {session ? (
        <>
          <h1 className="text-2xl">Welcome, {session.user?.name}!</h1>
          <p>Email: {session.user?.email}</p>
          <Image
            src={session.user?.image as string}
            alt="User Avatar"
            width="64"
            height="64"
            className="rounded-full mt-2"
          />
          <LogoutButton />
        </>
      ) : (
        <LoginButton />
      )}
    </main>
  );
};

export default Page;
