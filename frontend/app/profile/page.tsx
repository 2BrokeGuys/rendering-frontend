"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UserData {
  name: string;
  email: string;
  credits: number;
}

function Page() {
  const { data: session } = useSession();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/users", {
          method: "POST",
          body: JSON.stringify({ email: session?.user?.email as string }),
        });
        if (!response.ok) throw new Error("Failed to fetch user data");

        const data: UserData = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session]);

  const handleDeleteUser = async () => {
    if (!confirm("Are you sure you want to delete your account?")) return;

    try {
      const response = await fetch("/api/users", { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete user");

      toast.success("User deleted successfully.");
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        Loading...
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex justify-center items-center">
        User not found
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="p-8 border rounded-lg shadow-lg max-w-md w-full space-y-6">
        <h1 className="text-2xl font-bold">Your Profile</h1>

        <div className="flex items-center space-x-4">
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt="Profile Image"
              className="w-16 h-16 rounded-full"
            />
          )}
          <div>
            <p className="text-lg font-semibold">{user.name}</p>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <div>
          <p className="text-lg">
            Credits: <span className="font-semibold">{user.credits} CC</span>
          </p>
        </div>

        <Button
          onClick={handleDeleteUser}
          className="bg-red-500 hover:bg-red-600"
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
}

export default Page;
