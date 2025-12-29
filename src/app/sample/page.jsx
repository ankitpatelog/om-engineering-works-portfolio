"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Printer, Download } from "lucide-react";

export default function BillHistorySection() {
  /* 📦 DATA */
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔍 FILTERS */
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [customer, setCustomer] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");

  /* 📥 FETCH FROM DB */
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("/api/company/getallinvoicee"); // 👈 your API
        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        setInvoices(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  /* 🧠 FILTER LOGIC (USING YOUR FIELDS) */
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const date = new Date(inv.invoiceDate);
      const invYear = date.getFullYear().toString();
      const invMonth = date.toLocaleString("default", { month: "long" });

      return (
        (!year || invYear === year) &&
        (!month || invMonth === month) &&
        (!customer ||
          inv.billedTo?.name?.toLowerCase().includes(customer.toLowerCase())) &&
        (!invoiceNo ||
          inv.invoiceNumber?.toLowerCase().includes(invoiceNo.toLowerCase()))
      );
    });
  }, [invoices, year, month, customer, invoiceNo]);

  if (loading) {
    return (
      <div className="py-10 text-center text-gray-500">Loading invoices...</div>
    );
  }

  return (
    <div className="mx-4 my-6 rounded-lg border border-gray-300 bg-white p-5">
      <h2 className="mb-4 text-lg font-semibold">Bill History</h2>

      {/* 🔍 FILTER SECTION */}
      <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
        {/* YEAR */}
        <select
          className="rounded border px-3 py-2 text-sm"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <option value="">All Years</option>
          {[
            ...new Set(
              invoices.map((i) =>
                new Date(i.invoiceDate).getFullYear().toString()
              )
            ),
          ].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>

        {/* MONTH */}
        <select
          className="rounded border px-3 py-2 text-sm"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">All Months</option>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* CUSTOMER */}
        <input
          type="text"
          placeholder="Customer Name"
          className="rounded border px-3 py-2 text-sm"
          value={customer}
          onChange={(e) => setCustomer(e.target.value)}
        />

        {/* INVOICE NO */}
        <input
          type="text"
          placeholder="Invoice No"
          className="rounded border px-3 py-2 text-sm"
          value={invoiceNo}
          onChange={(e) => setInvoiceNo(e.target.value)}
        />
      </div>

      {/* 📜 SCROLLABLE LIST */}
      <div className="max-h-[420px] overflow-y-auto border">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">Invoice No</th>
              <th className="border px-3 py-2 text-left">Customer</th>
              <th className="border px-3 py-2 text-center">Date</th>
              <th className="border px-3 py-2 text-center">Status</th>
              <th className="border px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan="6" className="py-6 text-center text-gray-500">
                  No invoices found
                </td>
              </tr>
            )}

            {filteredInvoices.map((inv) => (
              <tr key={inv._id} className="hover:bg-gray-50 align-top">
                {/* Invoice No */}
                <td className="border px-3 py-2 font-medium">
                  {inv.invoiceNumber}
                </td>

                {/* IMPORTANT CUSTOMER INFO */}
                <td className="border px-3 py-2">
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-800">
                      {inv.billedTo?.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      GSTIN: {inv.billedTo?.gstin || "—"}
                    </div>
                    <div className="text-xs text-gray-600">
                      PO: {inv.poNo || "—"}
                    </div>
                  </div>
                </td>

                {/* DATE */}
                <td className="border px-3 py-2 text-center">
                  {new Date(inv.invoiceDate).toLocaleDateString()}
                  <div className="text-xs text-gray-500">
                    Items: {inv.items?.length || 0}
                  </div>
                </td>

                {/* STATUS */}
                <td className="border px-3 py-2 text-center">
                  <span
                    className={`rounded px-2 py-1 text-xs font-medium ${
                      inv.status === "FINAL"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {inv.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="border px-3 py-2">
                  <div className="flex justify-center gap-2">
                    <button
                      title="Edit Bill"
                      className="rounded border p-1 hover:bg-gray-100"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      title="Print Bill"
                      className="rounded border p-1 hover:bg-gray-100"
                    >
                      <Printer size={16} />
                    </button>
                    <button
                      title="Download Bill"
                      className="rounded border p-1 hover:bg-gray-100"
                    >
                      <Download size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
