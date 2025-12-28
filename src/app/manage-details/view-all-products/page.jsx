"use client";

import { useSession } from "next-auth/react";
import { OrbitProgress } from "react-loading-indicators";
import { Toaster } from "react-hot-toast";
import ProductListSection from "../../manage-details-components/showallproduct";

export default function EditCompanyDetails() {
  const { status } = useSession();

  /* ⏳ Show loader while auth status is checking */
  if (status === "loading") {
    return (
      <div className="flex justify-center py-10">
        <OrbitProgress variant="track-disc" color="#ef9b3d" size="small" />
      </div>
    );
  }

  /* 🔐 If not logged in (optional UI later) */
  if (status === "unauthenticated") {
    return (
      <div className="py-10 text-center text-gray-500">
        Please login to view products.
      </div>
    );
  }

  /* Logged in → show product list */
  return (
    <>
      <Toaster position="top-right" />
      <ProductListSection />
    </>
  );
}
