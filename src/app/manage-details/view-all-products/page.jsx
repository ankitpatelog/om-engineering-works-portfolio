"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { OrbitProgress } from "react-loading-indicators";
import ProductListSection from "../../manage-details-components/showallproduct";

export default function EditCompanyDetails() {
  const { status } = useSession();
  const [currdata, setcurrdata] = useState({
    userId: "", // will usually come from session, not input
    name: "",
    description: "",
    hsnCode: "",
    rate: "", // keep as string in UI, convert to Number on submit
    unit: "Nos.", // default matches schema
    gstPercent: "", // string in UI, Number in backend
  });
  const [gethasdetails, sethasgetdetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return; //status given by the axios loading, unaauthorized,authorized

    if (status === "unauthenticated") {
      setLoading(false);
      sethasgetdetails(false);
      return;
    }

    const checkCompany = async () => {
      try {
        const res = await axios.get("/api/company/getallproducts");
        if (!res.ok) {
          toast.error("No data available");
        }
        setcurrdata({
          userId: session.user.id,
          name: res.data?.name || "",
          description: res.data?.description || "",
          hsnCode: res.data?.hsnCode || "",
          rate: res.data?.rate !== undefined ? String(res.data.rate) : "",
          unit: res.data?.unit || "Nos.",
          gstPercent:
            res.data?.gstPercent !== undefined
              ? String(res.data.gstPercent)
              : "",
        });
      } catch (error) {
        toast.error(error);
        sethasgetdetails(false);
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
      <ProductListSection currdata={currdata} setcurrdata={setcurrdata} />
    </>
  );
}
