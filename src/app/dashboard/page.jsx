"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { OrbitProgress } from "react-loading-indicators";
import CompanyDetailsRequired from "../generate-bill-components/addcomapnymsg";
import LandingPageBillmain from "../../app/generate-bill-components/createbill";

export default function LandingPageBill() {
  const { status } = useSession();
  const router = useRouter();

  const [hasDetail, setHasDetail] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⏳ wait until session is resolved
    if (status === "loading") return;

    // 🔐 not logged in → redirect
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    // ✅ logged in → check company
    const checkCompany = async () => {
      try {
        const res = await axios.get("/api/company/check");
        setHasDetail(res.data.hasCompany);
      } catch (error) {
        toast.error("Failed to check company details");
        setHasDetail(false);
      } finally {
        setLoading(false);
      }
    };

    checkCompany();
  }, [status, router]);

  /* ✅ Loader */
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div style={{ transform: "scale(0.6)" }}>
          <OrbitProgress
            variant="track-disc"
            color="#ef9b3d"
            size="small"
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      {!hasDetail ? (
        <CompanyDetailsRequired />
      ) : (
        <LandingPageBillmain />
      )}
    </>
  );
}
