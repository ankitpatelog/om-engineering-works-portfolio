"use client";

import { useRouter } from "next/navigation";

export default function SubNavbar() {
  const router = useRouter();

  // example last invoice number (replace with real data later)
  const lastInvoice = "INV-1023";

  return (
    <div className="w-full border-b border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">

        {/* LEFT – ACTIONS */}
        <div className="flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => router.push("/generate-bill")}
            className="text-amber-600 hover:text-amber-700 transition"
          >
            Create Bill
          </button>

          <button
            onClick={() => router.push("/bill-history")}
            className="text-gray-700 hover:text-gray-900 transition"
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
