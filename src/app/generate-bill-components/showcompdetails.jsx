"use client";

import { Pencil } from "lucide-react";

export default function CompanyDetailsSection() {
  return (
    <section className="w-full rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 px-6 py-5 shadow-sm">
      
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold tracking-wide text-gray-900">
            Company Details
          </h2>
          <p className="text-xs text-gray-500">
            Used on invoices and billing documents
          </p>
        </div>

        <button
          type="button"
          className="flex items-center gap-1 rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
        >
          <Pencil size={14} />
          Edit Details
        </button>
      </div>

      {/* ROW 1 */}
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Info label="Company Name" value="OM Engineering Works" />
        <Info label="GSTIN" value="27ABCDE1234F1Z5" />
        <Info label="PAN Number" value="ABCDE1234F" />
      </div>

      {/* ROW 2 */}
      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Info label="Phone" value="+91 98765 43210" />
        <Info label="Email" value="omengineering@gmail.com" />
        <Info label="State" value="Maharashtra (27)" />
      </div>

      {/* Address */}
      <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
        <p className="text-xs font-semibold uppercase text-gray-500">
          Address
        </p>
        <p className="mt-1 text-sm font-medium text-gray-800">
          Plot No. 21, MIDC Industrial Area, Pune – 411026
        </p>
      </div>
    </section>
  );
}

/* Info Block */
function Info({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase text-gray-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-bold text-gray-900">
        {value}
      </p>
    </div>
  );
}
