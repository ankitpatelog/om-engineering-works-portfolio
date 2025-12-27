"use client";

import { Building2, PlusCircle } from "lucide-react";

export default function CompanyDetailsRequired({ onAddDetails }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md rounded-xl border border-amber-200 bg-amber-50 p-8 text-center shadow-sm">
        
        {/* ICON */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
          <Building2 className="h-7 w-7 text-amber-600" />
        </div>

        {/* TITLE */}
        <h2 className="mb-2 text-lg font-semibold text-gray-900">
          Company details required
        </h2>

        {/* MESSAGE */}
        <p className="mb-6 text-sm text-gray-600 leading-relaxed">
          Please enter your company details first to generate any bill.
          These details will be used automatically in all invoices.
        </p>

        {/* ACTION BUTTON */}
        <button
          onClick={onAddDetails}
          className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white
          shadow-md shadow-amber-500/20 hover:bg-amber-400 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          Add Company Details
        </button>
      </div>
    </div>
  );
}
