"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { OrbitProgress } from "react-loading-indicators";
import CompanyDetailsForm from "../../generate-bill-components/addcompanydetail";
import CompanyDetailsSection from "../../generate-bill-components/showcompdetails";

export default function EditCompanyDetails() {
  const { data: session, status } = useSession();

  const [hasDetail, setHasDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // wait until session status is known
    if (status === "loading") return;

    // not logged in
    if (status === "unauthenticated") {
      setLoading(false);
      return;
    }

    const checkCompany = async () => {
      try {
        console.log("Checking company...");
        const res = await axios.get("/api/company/check");

        setHasDetail(res.data.hasCompany);
        console.log("Has company:", res.data.hasCompany);
      } catch (error) {
        console.error(error);
        toast.error("Failed to check company details");
      } finally {
        setLoading(false);
      }
    };

    checkCompany();
  }, [status]);

  // if (loading) return <p>Loading...</p>;

  return (
    <>
      <Toaster position="top-right" />

      {/* If company does NOT exist →  show form */}
      {hasDetail && <CompanyDetailsSection />}
      {!hasDetail && <CompanyDetailsForm />}

      {loading ? (
        <OrbitProgress
          variant="track-disc"
          color="#ef9b3d"
          size="small"
          text=""
          textColor=""
        />
      ) : (
        <p></p>
      )}

      {/* If company does exist →  show form */}
    </>
  );
}
