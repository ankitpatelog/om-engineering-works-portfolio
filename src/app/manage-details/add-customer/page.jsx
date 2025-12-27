"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AddCustomerForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    gstin: "",
    pan: "",
    address: "",
    state: "",
    stateCode: "",
    shippedTo: "",
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
      const res = await axios.post("/api/customer", form);
      toast.success(res.data.message || "Customer added successfully");

      setForm({
        name: "",
        phone: "",
        gstin: "",
        pan: "",
        address: "",
        state: "",
        stateCode: "",
        shippedTo: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add customer"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6">
      <div className="w-full max-w-3xl mt-6 sm:mt-10 rounded-lg border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
        
        <h2 className="mb-4 text-center text-xl font-bold text-gray-900">
          Add Customer
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Customer Name *" />
          <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" />
          <Input name="gstin" value={form.gstin} onChange={handleChange} placeholder="GSTIN" />
          <Input name="pan" value={form.pan} onChange={handleChange} placeholder="PAN Number" />
          <Input name="state" value={form.state} onChange={handleChange} placeholder="State *" />
          <Input name="stateCode" value={form.stateCode} onChange={handleChange} placeholder="State Code *" />

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Billing Address *"
            className="col-span-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
            required
          />

          <textarea
            name="shippedTo"
            value={form.shippedTo}
            onChange={handleChange}
            placeholder="Shipped To Address (optional)"
            className="col-span-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />

          <div className="col-span-full flex justify-center sm:justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-md bg-amber-500 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-400 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Reusable Input ---------- */
function Input({ name, value, onChange, placeholder }) {
  return (
    <input
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
      required={placeholder.includes("*")}
    />
  );
}
