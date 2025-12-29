"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { OrbitProgress } from "react-loading-indicators";
import CompanyDetailsRequired from "../generate-bill-components/addcomapnymsg";
import LandingPageBillmain from "../../app/generate-bill-components/createbill"

export default function LandingPageBill() {
  const { status } = useSession();
  const [hasDetail, setHasDetail] = useState(null); // 👈 IMPORTANT
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      setLoading(false);
      setHasDetail(false);
      return;
    }

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
  }, [status]);

  /* ✅ SHOW ONLY LOADER WHILE CHECKING */
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div style={{ transform: "scale(0.6)" }}>
          <OrbitProgress variant="track-disc" color="#ef9b3d" size="small" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      {/* ✅ render ONLY after loading is finished */}
      {!hasDetail ? (
        <CompanyDetailsRequired />
      ) : (
        <LandingPageBillmain/>
      )}
    </>
  );
}
