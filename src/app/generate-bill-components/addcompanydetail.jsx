"use client";

import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

export default function CompanyDetailsForm() {
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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = axios("/api/company/addcompdetail")
        if(!res.ok){
            toast.error("Data saving error occured ")
        }

        toast.success("Data saved successfully")
    } catch (error) {
        console.log(error)
    }
  };

  return (
    <>
      <Toaster position="top-right" />

      <div className="max-w-4xl mx-auto p-6 bg-white border rounded-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Add Company Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name */}
          <input
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            required
            className="w-full border rounded-md px-3 py-2 text-sm"
          />

          {/* GST + PAN */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="gstin"
              placeholder="GSTIN"
              value={form.gstin}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm uppercase"
            />

            <input
              name="panno"
              placeholder="PAN Number"
              value={form.panno}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm uppercase"
            />
          </div>

          {/* Address */}
          <textarea
            name="address"
            placeholder="Company Address"
            value={form.address}
            onChange={handleChange}
            required
            rows={3}
            className="w-full border rounded-md px-3 py-2 text-sm"
          />

          {/* State + Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="state"
              placeholder="State"
              value={form.state}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />

            <input
              name="statecode"
              placeholder="State Code (eg: 27)"
              value={form.statecode}
              onChange={handleChange}
              required
              type="number"
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
          </div>

          {/* Invoice Prefix */}
          <input
            name="invoicePrefix"
            placeholder="Invoice Prefix"
            value={form.invoicePrefix}
            onChange={handleChange}
            className="w-full border rounded-md px-3 py-2 text-sm uppercase"
          />

          {/* Submit */}
          <button
          onClick={handleSubmit}
            type="submit"
            className="bg-amber-500 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-amber-600"
          >
            Save Company Details
          </button>
        </form>
      </div>
    </>
  );
}
