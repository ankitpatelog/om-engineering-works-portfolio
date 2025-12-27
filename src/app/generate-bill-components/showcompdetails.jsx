"use client";

import { Pencil } from "lucide-react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { OrbitProgress } from "react-loading-indicators";
import { useEffect, useState } from "react";

export default function CompanyDetailsSection() {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get("/api/company/getcompanydetails");
        setCompany(res.data); // ✅ API returns company directly
      } catch (error) {
        toast.error("Failed to fetch company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  // ✅ Loading state
  if (loading) {
    return (
      <div className="flex justify-center py-4">
        <div style={{ transform: "scale(0.6)" }}>
          <OrbitProgress
            variant="track-disc"
            color="#ef9b3d"
            size="small"
            text=""
            textColor=""
          />
        </div>
      </div>
    );
  }

  // ✅ Safety guard
  if (!company) return null;

  return (
    <>
      <Toaster position="top-right" />

      <section className="w-full rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 px-6 py-5 shadow-sm">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold tracking-wide text-gray-900">
              {company.companyName}
            </h2>
            <p className="text-xs text-gray-500">
              Used on invoices and billing documents
            </p>
          </div>

          <button
            type="button"
            className="flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100"
          >
            <Pencil size={14} />
            Edit Details
          </button>
        </div>

        {/* ROW 1 */}
        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Info label="Company Name" value={company.companyName} />
          <Info label="GSTIN" value={company.gstin} />
          <Info label="PAN Number" value={company.panno} />
        </div>

        {/* ROW 2 */}
        <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Info label="Phone" value={company.phone} />
          <Info label="Email" value={company.email} />
          <Info
            label="State"
            value={`${company.state} (${company.statecode})`}
          />
        </div>

        {/* Address */}
        <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
          <p className="text-xs font-semibold uppercase text-gray-500">
            Address
          </p>
          <p className="mt-1 text-sm font-medium text-gray-800">
            {company.address}
          </p>
        </div>
      </section>
    </>
  );
}

/* Info Block */
function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase text-gray-500">{label}</p>
      <p className="mt-1 text-sm font-bold text-gray-900">{value || "-"}</p>
    </div>
  );
}
