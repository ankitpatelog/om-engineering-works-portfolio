"use client";

import { useSession } from "next-auth/react";
import { OrbitProgress } from "react-loading-indicators";
import { Toaster } from "react-hot-toast";

import CompleteInvoicePage from "../create-bill-components/allthreesection";

export default function LandingPageBill() {
  //have to work on invoice no
  //i think i have to make it like this when this page load a route.js bring hte latest incvocie and add the vlaue and set into the prop
  const { status } = useSession();

  /* ⏳ Session loader */
  if (status === "loading") {
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
      <CompleteInvoicePage  />
    </>
  );
}
