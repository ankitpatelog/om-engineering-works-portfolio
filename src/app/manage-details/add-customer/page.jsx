"use client";

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

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
    poNumber: "",
    poDate: "",
    shippedTo: {
      name: "",
      address: "",
      state: "",
      stateCode: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // handle nested shippedTo fields
    if (name.startsWith("shippedTo.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        shippedTo: {
          ...prev.shippedTo,
          [key]: value,
        },
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // frontend validation
    if (
      !form.stateCode ||
      isNaN(Number(form.stateCode)) ||
      Number(form.stateCode) < 1
    ) {
      toast.error("Please enter valid state code");
      return;
    }

    setLoading(true);

    const payload = {
      ...form,
      stateCode: Number(form.stateCode),
      shippedTo: {
        ...form.shippedTo,
        stateCode: form.shippedTo.stateCode
          ? Number(form.shippedTo.stateCode)
          : undefined,
      },
    };

    try {
      await toast.promise(
        axios.post("/api/company/addcustomers", payload),
        {
          loading: "Saving...",
          success: "Customer added successfully",
          error: (err) =>
            err.response?.data?.message || "Could not save",
        }
      );

      // reset form after success
      setForm({
        name: "",
        phone: "",
        gstin: "",
        pan: "",
        address: "",
        state: "",
        stateCode: "",
        poNumber: "",
        poDate: "",
        shippedTo: {
          name: "",
          address: "",
          state: "",
          stateCode: "",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 sm:px-6">
      <Toaster position="top-right" />

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
          <Input name="poNumber" value={form.poNumber} onChange={handleChange} placeholder="PO Number" />
          <Input name="poDate" value={form.poDate} onChange={handleChange} type="date" />

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Billing Address *"
            className="col-span-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            required
          />

          <h3 className="col-span-full font-semibold text-gray-700">
            Shipped To (optional)
          </h3>

          <Input name="shippedTo.name" value={form.shippedTo.name} onChange={handleChange} placeholder="Shipping Name" />
          <Input name="shippedTo.state" value={form.shippedTo.state} onChange={handleChange} placeholder="Shipping State" />
          <Input name="shippedTo.stateCode" value={form.shippedTo.stateCode} onChange={handleChange} placeholder="Shipping State Code" />

          <textarea
            name="shippedTo.address"
            value={form.shippedTo.address}
            onChange={handleChange}
            placeholder="Shipping Address"
            className="col-span-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />

          <div className="col-span-full flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-amber-500 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-400 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Customer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ name, value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
      required={placeholder?.includes("*")}
    />
  );
}
