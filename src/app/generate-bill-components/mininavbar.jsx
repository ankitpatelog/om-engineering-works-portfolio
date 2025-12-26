"use client";

import { useRouter, usePathname } from "next/navigation";

export default function SubNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const lastInvoice = "INV-1023";

  return (
    <div className="w-full border-b border-gray-200 bg-gray-50  ">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1">

        {/* LEFT – CLICKABLE TABS */}
        <div className="flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => router.push("/dashboard")}
            className={`cursor-pointer transition-colors ${
              pathname === "/generate-bill"
                ? "text-amber-600 border-b-2 border-amber-500"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            Create Bill
          </button>

          <button
            onClick={() => router.push("/dashboard/history")}
            className={`cursor-pointer transition-colors ${
              pathname === "/generate-bill/history"
                ? "text-amber-600 border-b-2 border-amber-500"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            Bill History
          </button>
        </div>

        {/* RIGHT – LAST INVOICE */}
        <div className="text-sm text-gray-600">
          Last:&nbsp;
          <span className="font-semibold text-gray-900">
            {lastInvoice}
          </span>
        </div>
      </div>
    </div>
  );
}
