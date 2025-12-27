"use client";

import { useState, useEffect } from "react";

export default function EditCompanyDrawer({ open, onClose, company }) {
  const [form, setForm] = useState(company || {});

  useEffect(() => {
    setForm(company || {});
  }, [company]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      {/* Drawer Panel */}
      <div className="h-full w-[420px] bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Edit Company Details</h2>
          <button
            onClick={onClose}
            className="text-xl text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Company Name"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
          />

          <Input
            label="GSTIN"
            name="gstin"
            value={form.gstin || ""}
            onChange={handleChange}
          />

          <Input
            label="PAN Number"
            name="pan"
            value={form.pan || ""}
            onChange={handleChange}
          />

          <Input
            label="Phone"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            value={form.email || ""}
            onChange={handleChange}
          />

          <div>
            <label className="mb-1 block text-sm text-gray-600">
              Address
            </label>
            <textarea
              name="address"
              rows={3}
              value={form.address || ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              console.log(form); // later → API call
              onClose();
            }}
            className="rounded-lg bg-amber-500 px-5 py-2 font-semibold text-white hover:bg-amber-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ✅ Input component — THIS FIXES THE ERROR */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block text-sm text-gray-600">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
      />
    </div>
  );
}
