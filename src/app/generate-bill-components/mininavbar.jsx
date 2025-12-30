"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SubNavbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [lastInvoice, setLastInvoice] = useState("—");
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch last invoice number
  const fetchLastInvoice = async () => {
    try {
      const res = await axios.get("/api/company/getlastinvoiceno");

      if (res.status === 200) {
        setLastInvoice(res.data.lastInvoiceNumber || "—");
      }
    } catch (error) {
      console.error("Failed to fetch last invoice:", error);
      setLastInvoice("—");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLastInvoice();
  }, []);

  return (
    <div className="w-full border-b border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-1">
        {/* LEFT – TABS */}
        <div className="flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => router.push("/dashboard")}
            className={`transition-colors ${
              pathname === "/dashboard"
                ? "border-b-2 border-amber-500 text-amber-600"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            Create Bill
          </button>

          <button
            onClick={() => router.push("/dashboard/edit-company-details")}
            className={`transition-colors ${
              pathname === "/dashboard/edit-company-details"
                ? "border-b-2 border-amber-500 text-amber-600"
                : "text-gray-600 hover:text-amber-600"
            }`}
          >
            Edit Your Company Details
          </button>

          <button
            onClick={() => router.push("/dashboard/bill-history")}
            className={`transition-colors ${
              pathname === "/dashboard/bill-history"
                ? "border-b-2 border-amber-500 text-amber-600"
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
            {loading ? "Loading..." : lastInvoice}
          </span>
        </div>
      </div>
    </div>
  );
}
