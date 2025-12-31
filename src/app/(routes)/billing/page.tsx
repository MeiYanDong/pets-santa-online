"use client";

import { Suspense, useEffect, useState } from "react";
import { useSession } from "@/lib/auth/client";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Credits {
  balance: number;
  totalPurchased: number;
  totalUsed: number;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  creditsAdded: number;
  createdAt: string;
}

interface CreditUsage {
  id: string;
  amount: number;
  type: string;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

interface BillingData {
  credits: Credits;
  payments: Payment[];
  usage: CreditUsage[];
}

function BillingContent() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [billingData, setBillingData] = useState<BillingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccess(true);
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchBillingData();
    }
  }, [session]);

  const fetchBillingData = async () => {
    try {
      const response = await fetch("/api/billing");
      if (response.ok) {
        const data = await response.json();
        setBillingData(data);
      }
    } catch (error) {
      console.error("Failed to fetch billing data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-bounce text-4xl">Loading...</div>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white text-xl shadow-lg group-hover:scale-110 transition-transform">
                🐾
              </div>
              <span className="festive-font text-2xl font-bold text-red-600 tracking-tight">
                Pets Santa
              </span>
            </Link>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {showSuccess && (
          <div className="mb-8 p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-2xl">
            <div className="flex items-center gap-3">
              <span className="text-2xl">✓</span>
              <div>
                <h3 className="font-bold text-green-800 dark:text-green-200">
                  Payment Successful!
                </h3>
                <p className="text-green-700 dark:text-green-300 text-sm">
                  200 credits have been added to your account.
                </p>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8 festive-font">
          Billing
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Current Balance
            </div>
            <div className="text-4xl font-bold text-slate-900 dark:text-white">
              {billingData?.credits.balance || 0}
            </div>
            <div className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              credits
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Total Purchased
            </div>
            <div className="text-4xl font-bold text-green-600 dark:text-green-400">
              {billingData?.credits.totalPurchased || 0}
            </div>
            <div className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              credits
            </div>
          </div>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <div className="text-sm text-slate-500 dark:text-slate-400 mb-2">
              Total Used
            </div>
            <div className="text-4xl font-bold text-red-600 dark:text-red-400">
              {billingData?.credits.totalUsed || 0}
            </div>
            <div className="text-sm text-slate-400 dark:text-slate-500 mt-1">
              credits
            </div>
          </div>
        </div>

        <div className="mb-12">
          <Link
            href="/?page=pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg"
          >
            Buy More Credits
          </Link>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Payment History
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            {billingData?.payments && billingData.payments.length > 0 ? (
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Credits
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {billingData.payments.map((p) => (
                    <tr key={p.id}>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">
                        ${(p.amount / 100).toFixed(2)} {p.currency.toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        +{p.creditsAdded}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            p.status === "completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : p.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                No payment history yet
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Credit Usage
          </h2>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            {billingData?.usage && billingData.usage.length > 0 ? (
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Balance
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {billingData.usage.map((u) => (
                    <tr key={u.id}>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            u.type === "purchase"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          }`}
                        >
                          {u.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {u.description}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-medium ${u.amount > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
                      >
                        {u.amount > 0 ? "+" : ""}
                        {u.amount}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900 dark:text-white font-medium">
                        {u.balanceAfter}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                No credit usage history yet
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
          <div className="animate-bounce text-4xl">Loading...</div>
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}
