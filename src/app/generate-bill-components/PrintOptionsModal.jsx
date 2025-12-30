"use client";

import axios from "axios";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";

export default function PrintOptionsModal({ open, invoice, onClose }) {
  const [loading, setLoading] = useState(false);
  if (!open) return null;

  const generateAndPrint = async (url, label) => {
    if (loading) return;
    setLoading(true);

    // ✅ OPEN WINDOW IMMEDIATELY (prevents popup block)
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      toast.error("Popup blocked. Please allow popups.");
      setLoading(false);
      return;
    }

    // Basic loading UI in new window
    printWindow.document.write(`
      <html>
        <head><title>Generating PDF...</title></head>
        <body style="display:flex;align-items:center;justify-content:center;font-family:sans-serif;">
          <div>
            <h3>Generating ${label} PDF…</h3>
            <p>Please wait</p>
          </div>
        </body>
      </html>
    `);

    const toastId = toast.loading(
      `Generating ${label} PDF, please wait...`
    );

    try {
      const res = await axios.get(url, {
        responseType: "blob",
      });

      if (res.status !== 200) {
        toast.error("Failed to generate invoice", { id: toastId });
        printWindow.close();
        return;
      }

      const blob = new Blob([res.data], { type: "application/pdf" });
      const pdfUrl = URL.createObjectURL(blob);

      // Replace temp page with PDF
      printWindow.location.href = pdfUrl;

      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };

      toast.success(`${label} PDF ready`, { id: toastId });
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Print failed", { id: toastId });
      printWindow.close();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

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
            disabled={loading}
            onClick={() =>
              generateAndPrint(
                `/api/company/invoice/print/original/${invoice._id}`,
                "Original"
              )
            }
            className="w-full rounded border px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            Original
          </button>

          <button
            disabled={loading}
            onClick={() =>
              generateAndPrint(
                `/api/company/invoice/print/duplicate/${invoice._id}`,
                "Duplicate"
              )
            }
            className="w-full rounded border px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            Duplicate
          </button>

          <button
            disabled={loading}
            onClick={() =>
              generateAndPrint(
                `/api/company/invoice/print/triplicate/${invoice._id}`,
                "Triplicate"
              )
            }
            className="w-full rounded border px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
          >
            Triplicate
          </button>

          <button
            disabled={loading}
            onClick={() =>
              generateAndPrint(
                `/api/company/invoice/print/extra/${invoice._id}`,
                "Extra"
              )
            }
            className="w-full rounded border px-4 py-2 text-sm hover:bg-gray-100 disabled:opacity-50"
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
