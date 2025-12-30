"use client";

import { X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

export default function EditCompanyDetailsForm({
  company,
  onClose,
  onUpdated,
}) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    companyName: company?.companyName || "",
    gstin: company?.gstin || "",
    panno: company?.panno || "",
    phone: company?.phone || "",
    email: company?.email || "",
    state: company?.state || "",
    stateCode: company?.stateCode || "",
    address: company?.address || "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put("/api/company/updatecompanydetails", form);
      toast.success("Company details updated");

      onUpdated?.(); // 🔄 refresh company data
      onClose();     // ❌ close modal
    } catch (error) {
      toast.error("Failed to update company details");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-3xl rounded-xl bg-white shadow-xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">
            Edit Company Details
          </h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* ROW 1 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              label="Company Name"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              required
            />
            <Input
              label="GSTIN"
              name="gstin"
              value={form.gstin}
              onChange={handleChange}
              required
            />
            <Input
              label="PAN Number"
              name="panno"
              value={form.panno}
              onChange={handleChange}
              required
            />
          </div>

          {/* ROW 2 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              label="Phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <Input
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              required
            />
            <Input
              label="State"
              name="state"
              value={form.state}
              onChange={handleChange}
              required
            />
          </div>

          {/* ROW 3 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Input
              label="State Code"
              name="stateCode"
              value={form.stateCode}
              onChange={handleChange}
              required
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-500">
              Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              required
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-amber-600 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- INPUT ---------- */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase text-gray-500">
        {label}
      </label>
      <input
        {...props}
        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
      />
    </div>
  );
}
