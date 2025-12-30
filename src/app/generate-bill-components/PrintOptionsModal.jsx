"use client";

import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";

export default function PrintOptionsModal({ open, invoice, onClose }) {
  if (!open) return null;

  const handlePrint = async (path) => {
    try {
      const res = await axios.get(
        `/api/company/invoice/print/${path}/${invoice._id}`,
        { responseType: "blob" }
      );

      if (res.status !== 200) {
        toast.error("Failed to generate invoice");
        return;
      }

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const printWindow = window.open(url);

      if (!printWindow) {
        toast.error("Popup blocked. Please allow popups and try again.");
        return;
      }

      printWindow.onload = () => {
        printWindow.print();
      };

      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Print failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-50 w-96 rounded-lg bg-white p-5 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
        >
          <X size={18} />
        </button>

        <h2 className="mb-2 text-center text-lg font-semibold">
          Print Invoice
        </h2>

        <p className="mb-4 text-center text-sm text-gray-600">
          Invoice No: <b>{invoice?.invoiceNumber}</b>
        </p>

        <div className="space-y-2">
          <button
            onClick={() => handlePrint("original")}
            className="w-full rounded border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Original
          </button>

          <button
            onClick={() => handlePrint("duplicate")}
            className="w-full rounded border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Duplicate
          </button>

          <button
            onClick={() => handlePrint("triplicate")}
            className="w-full rounded border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Triplicate
          </button>

          <button
            onClick={() => handlePrint("extra")}
            className="w-full rounded border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Extra
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full rounded bg-gray-200 py-2 text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
