"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function CompanyDetailsForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    companyName: "",
    gstin: "",
    panno: "",
    address: "",
    state: "",
    statecode: "",
    phone: "",
    email: "",
    invoicePrefix: "INVOICE NO:",
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post("/api/company/addcompdetail", form);
      toast.success(res.data?.message || "Company details saved");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to save company details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      {/* CENTER WRAPPER */}
      <div className="w-full flex justify-center px-4 sm:px-6">
        <div className="w-full max-w-4xl mt-6 sm:mt-10 rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">

          <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
            Add Company Details
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Company Name */}
            <input
              name="companyName"
              placeholder="Company Name *"
              value={form.companyName}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />

            {/* GST + PAN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="gstin"
                placeholder="GSTIN *"
                value={form.gstin}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm uppercase focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />

              <input
                name="panno"
                placeholder="PAN Number *"
                value={form.panno}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm uppercase focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* Address */}
            <textarea
              name="address"
              placeholder="Company Address *"
              value={form.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />

            {/* State + Code */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="state"
                placeholder="State *"
                value={form.state}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />

              <input
                name="statecode"
                placeholder="State Code (eg: 27) *"
                value={form.statecode}
                onChange={handleChange}
                required
                type="number"
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* Phone + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                name="phone"
                placeholder="Phone Number *"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />

              <input
                name="email"
                type="email"
                placeholder="Email Address *"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
            </div>

            {/* Invoice Prefix */}
            <input
              name="invoicePrefix"
              placeholder="Invoice Prefix"
              value={form.invoicePrefix}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm uppercase focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            />

            {/* Submit */}
            <div className="flex justify-center sm:justify-end pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto rounded-md bg-amber-500 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-400 transition disabled:opacity-60"
              >
                {loading ? "Saving..." : "Save Company Details"}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
}
