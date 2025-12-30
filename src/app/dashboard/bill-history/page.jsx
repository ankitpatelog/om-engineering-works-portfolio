"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Printer, Download, Trash2 } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import PrintOptionsModal from "../../generate-bill-components/PrintOptionsModal"; // ✅ ADD

export default function BillHistorySection() {
  /* 📦 DATA */
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔍 FILTERS */
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [customer, setCustomer] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("");

  /* 🖨️ PRINT MODAL STATE (✅ ADD) */
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  /* 📥 FETCH FROM DB */
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch("/api/company/getallinvoicee");
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

  /* 🗑️ DELETE HANDLER */
  const handleremove = async (invoiceId) => {
    const msg = confirm(
      "Are you sure you want to delete this invoice?\nOnce deleted, it cannot be recovered."
    );
    if (!msg) return;

    const msg2 = confirm("Press ok to agree one more time to delete");
    if (!msg2) return;

    try {
      const res = await axios.delete(`/api/company/deleteinvoice/${invoiceId}`);
      setInvoices((prev) => prev.filter((inv) => inv._id !== invoiceId));

      if (res.status === 200) toast.success("Invoice deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete invoice");
    }
  };

  /* 🧠 FILTER LOGIC */
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
    <>
      <Toaster />

      <div className="mx-4 my-6 rounded-lg border border-gray-300 bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Bill History</h2>

        {/* 🔍 FILTER SECTION */}
        <div className="mb-4 grid grid-cols-1 gap-3 md:grid-cols-4">
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

          <input
            type="text"
            placeholder="Customer Name"
            className="rounded border px-3 py-2 text-sm"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
          />

          <input
            type="text"
            placeholder="Invoice No"
            className="rounded border px-3 py-2 text-sm"
            value={invoiceNo}
            onChange={(e) => setInvoiceNo(e.target.value)}
          />
        </div>

        {/* 📜 TABLE */}
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
              {filteredInvoices.map((inv) => (
                <tr key={inv._id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2 font-medium">
                    {inv.invoiceNumber}
                  </td>

                  <td className="border px-3 py-2">
                    <div className="font-semibold">{inv.billedTo?.name}</div>
                    <div className="text-xs text-gray-600">
                      GSTIN: {inv.billedTo?.gstin || "—"}
                    </div>
                  </td>

                  <td className="border px-3 py-2 text-center">
                    {new Date(inv.invoiceDate).toLocaleDateString()}
                  </td>

                  <td className="border px-3 py-2 text-center">{inv.status}</td>

                  <td className="border px-3 py-2">
                    <div className="flex justify-center gap-2">
                      <button className="rounded border p-1">
                        <Pencil size={16} />
                      </button>

                      <button
                        className="rounded border p-1"
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setPrintModalOpen(true);
                        }}
                      >
                        <Printer size={16} />
                      </button>

                      <button className="rounded border p-1">
                        <Download size={16} />
                      </button>

                      <button
                        onClick={() => handleremove(inv._id)}
                        className="rounded border p-1 hover:bg-red-100 text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🖨️ PRINT MODAL */}
      <PrintOptionsModal
        open={printModalOpen}
        invoice={selectedInvoice}
        onClose={() => setPrintModalOpen(false)}
      />
    </>
  );
}
