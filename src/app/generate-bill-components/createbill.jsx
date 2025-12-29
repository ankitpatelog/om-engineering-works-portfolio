"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { OrbitProgress } from "react-loading-indicators";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import axios from "axios";

import CompleteInvoicePage from "../create-bill-components/allthreesection";

export default function LandingPageBill() {
  const { status } = useSession();
  const [invoiceNo, setInvoiceNo] = useState("");
  const [loadingInvoice, setLoadingInvoice] = useState(true);

  /* ================= FETCH INVOICE NUMBER ================= */
  useEffect(() => {
    const fetchInvoiceNo = async () => {
      try {
        const res = await axios.get("/api/company/generate-invoice-number");

        setInvoiceNo(res.data.invoiceNumber);
      } catch (error) {
        console.error(error);
        toast.error("Failed to generate invoice number");
      } finally {
        setLoadingInvoice(false);
      }
    };

    if (status === "authenticated") {
      fetchInvoiceNo();
    }
  }, [status]);

  /* ⏳ Session loader */
  if (status === "loading" || loadingInvoice) {
    return (
      <div className="flex justify-center py-10">
        <div style={{ transform: "scale(0.6)" }}>
          <OrbitProgress variant="track-disc" color="#ef9b3d" size="small" />
        </div>
      </div>
    );
  }

  /* 🔐 Not logged in */
  if (status === "unauthenticated") {
    return (
      <div className="py-10 text-center text-gray-500">
        Please login to create a bill.
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <CompleteInvoicePage invoiceNo={invoiceNo} />
    </>
  );
}
