"use client";

import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

export default function AddProductForm() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    hsnCode: "",
    rate: "",
    unit: "Nos.",
    gstPercent: "",
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
      const payload = {
        ...form,
        rate: Number(form.rate),
        gstPercent: Number(form.gstPercent),
      };

      await toast.promise(
        axios.post("/api/company/addproduct", payload),
        {
          loading: "Saving product...",
          success: "Product added successfully",
          error: (err) =>
            err.response?.data?.message || "Could not save product",
        }
      );

      setForm({
        name: "",
        description: "",
        hsnCode: "",
        rate: "",
        unit: "Nos.",
        gstPercent: "",
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
          Add Product
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <Input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name *"
          />

          <Input
            name="hsnCode"
            value={form.hsnCode}
            onChange={handleChange}
            placeholder="HSN Code *"
          />

          <Input
            name="rate"
            value={form.rate}
            onChange={handleChange}
            placeholder="Rate *"
            type="number"
          />

          <select
            name="gstPercent"
            value={form.gstPercent}
            onChange={handleChange}
            required
            className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          >
            <option value="">GST % *</option>
            <option value="0">0%</option>
            <option value="3">3%</option>
            <option value="5">5%</option>
            <option value="12">12%</option>
            <option value="18">18%</option>
            <option value="28">28%</option>
          </select>

          <Input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="Unit"
          />

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Product Description *"
            required
            className="col-span-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
          />

          <div className="col-span-full flex justify-center sm:justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto rounded-md bg-amber-500 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-400 transition disabled:opacity-60"
            >
              {loading ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Reusable Input ---------- */
function Input({ name, value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={placeholder.includes("*")}
      className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
    />
  );
}
