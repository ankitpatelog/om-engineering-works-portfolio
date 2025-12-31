"use client";

import { useRouter } from "next/navigation";

export default function ManageDetailsPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6">
      {/* Page Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manage Details</h1>
        <p className="text-sm text-gray-600">
          Overview of your billing, customers, and products
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard title="Total Bills" value="₹---" />
        <SummaryCard title="Customers" value="₹---" />
        <SummaryCard title="Products" value="₹---" />
        <SummaryCard title="Total Revenue" value="₹---" />
      </div>

      {/* QUICK ACTIONS */}
      <div className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-800">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-4">
          <ActionButton
            label="Add Customer"
            onClick={() => router.push("/dashboard/add-customer")}
          />
          <ActionButton
            label="Add Product"
            onClick={() => router.push("/dashboard/add-product")}
          />
          <ActionButton
            label="Create Bill"
            onClick={() => router.push("/dashboard")}
          />
        </div>
      </div>

      {/* INFO SECTION */}
      <div className="mt-10 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="font-semibold text-gray-800">
          What you can manage here
        </h3>
        <ul className="mt-2 list-disc pl-5 text-sm text-gray-600">
          <li>Maintain customer and product records</li>
          <li>Track billing and invoice history</li>
          <li>Ensure accurate GST and invoice data</li>
          <li>Quickly add or update business details</li>
        </ul>
      </div>
    </div>
  );
}

/* ---------- Small Components ---------- */

function SummaryCard({ title, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function ActionButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-400 transition"
    >
      {label}
    </button>
  );
}
