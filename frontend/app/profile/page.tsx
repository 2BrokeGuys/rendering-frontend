"use client";

import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Session } from "next-auth";
import Image from "next/image";

interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface ExtendedSession extends Session {
  user?: ExtendedUser;
}

interface UserData {
  name: string;
  email: string;
  credits: number;
}

interface Transaction {
  stripe_payment_id: string;
  amount: string;
  status: string;
  created_at: string;
  payment_method: string;
}

export default function Page() {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: "loading" | "authenticated" | "unauthenticated";
  };
  const [user, setUser] = useState<UserData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeView, setActiveView] = useState<"profile" | "transactions">(
    "profile",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isTransactionsLoading, setIsTransactionsLoading] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (!session?.user?.id) return;

      setIsLoading(true);
      try {
        const response = await fetch(`/api/users/${session.user.id}`);

        if (!response.ok) {
          toast.error(`Error: ${response.status}`);
        }

        const { data } = await response.json();
        setUser(data[0] as UserData);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        toast.error("Could not load your profile. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [session]);

  async function fetchTransactions() {
    if (!session?.user?.email) return;

    setIsTransactionsLoading(true);
    try {
      const response = await fetch(`/api/transactions/${session.user.id}`);

      if (!response.ok) {
        toast.error(`Error: ${response.status}`);
      }

      const { data } = await response.json();
      setTransactions(data as Transaction[]);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      toast.error("Could not load your transactions. Please try again later.");
    } finally {
      setIsTransactionsLoading(false);
    }
  }

  function handleViewChange(view: "profile" | "transactions") {
    setActiveView(view);
    if (view === "transactions") {
      fetchTransactions();
    }
  }

  function formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.error("Error formatting date:", error);
      return dateString;
    }
  }

  async function handleDeleteAccount() {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/users", {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Error deleting your account");
      }

      signOut();

      toast.success("Your account has been deleted successfully.");
      window.location.href = "/";
    } catch (error) {
      console.error("Failed to delete account:", error);
      toast.error("Could not delete your account. Please try again later.");
    }
  }

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Not Signed In</h2>
          <p className="text-gray-600 mb-4">
            Please sign in to view your profile.
          </p>
          <Button onClick={() => (window.location.href = "/api/auth/signin")}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md p-6 border rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Could Not Load Profile</h2>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t load your profile information.
          </p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="w-64 border-r">
        <div className="p-5">
          <h1 className="text-xl font-bold mb-6">Account</h1>
          <nav className="space-y-2">
            <Button
              variant={activeView === "profile" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleViewChange("profile")}
            >
              Your Profile
            </Button>
            <Button
              variant={activeView === "transactions" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => handleViewChange("transactions")}
            >
              View Transactions
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50"
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </nav>
        </div>
      </div>

      <div className="flex-1 p-8">
        {activeView === "profile" && (
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold mb-6">Your Profile</h2>
            <div className="p-6 rounded-lg border shadow-sm">
              <div className="flex items-center space-x-4 mb-6">
                {session?.user?.image && (
                  <Image
                    src={session.user.image}
                    alt="Profile"
                    className="h-16 w-16 rounded-full"
                    width={64}
                    height={64}
                  />
                )}
                <div>
                  <h3 className="text-lg font-semibold">{user.name}</h3>
                  <p className="text-gray-600">{user.email}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-lg">
                  Available Credits:{" "}
                  <span className="font-semibold">{user.credits} CC</span>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Transactions view */}
        {activeView === "transactions" && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold mb-6">Your Transactions</h2>

            {isTransactionsLoading ? (
              <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
                <p className="text-gray-500">Loading your transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="bg-white p-6 rounded-lg border shadow-sm text-center">
                <p className="text-gray-500">
                  You don&apos;t have any transactions yet.
                </p>
              </div>
            ) : (
              <div className="rounded-lg border shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {transactions.map((transaction) => {
                      return (
                        <tr
                          key={transaction.stripe_payment_id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                            {transaction.stripe_payment_id.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(transaction.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            ${parseFloat(transaction.amount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {transaction.payment_method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium`}
                            >
                              {transaction.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
