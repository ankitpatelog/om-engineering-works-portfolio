"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function EditProductForm({ product, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: product.name || "",
    description: product.description || "",
    hsnCode: product.hsnCode || "",
    rate: product.rate || "",
    gstPercent: product.gstPercent || "",
    unit: product.unit || "Nos.",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await axios.put(`/api/company/editproductform/${product._id}`, {
        ...form,
        rate: Number(form.rate),
        gstPercent: Number(form.gstPercent),
      });

      toast.success("Product updated");
      onUpdated();
      onClose();
    } catch (err) {
      toast.error("Failed to update product");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Product</h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <Input label="Product Name" name="name" value={form.name} onChange={handleChange} required />
          <Input label="HSN Code" name="hsnCode" value={form.hsnCode} onChange={handleChange} />

          <div className="grid grid-cols-2 gap-3">
            <Input label="Rate (₹)" name="rate" type="number" value={form.rate} onChange={handleChange} required />
            <Input label="GST %" name="gstPercent" type="number" value={form.gstPercent} onChange={handleChange} required />
          </div>

          <Select label="Unit" name="unit" value={form.unit} onChange={handleChange} options={["Nos.", "Kg", "Meter"]} />
          <Textarea label="Description" name="description" value={form.description} onChange={handleChange} />

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="rounded-md border px-4 py-2">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="rounded-md bg-amber-600 px-4 py-2 text-white">
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* UI helpers */
function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block font-medium">{label}</label>
      <input {...props} className="w-full rounded-md border px-3 py-2" />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="mb-1 block font-medium">{label}</label>
      <select {...props} className="w-full rounded-md border px-3 py-2">
        {options.map((op) => (
          <option key={op} value={op}>{op}</option>
        ))}
      </select>
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block font-medium">{label}</label>
      <textarea {...props} rows={3} className="w-full rounded-md border px-3 py-2" />
    </div>
  );
}
