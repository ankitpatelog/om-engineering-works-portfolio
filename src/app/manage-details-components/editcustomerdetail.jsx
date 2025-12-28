"use client";

import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { X } from "lucide-react";

export default function EditCustomerForm({ customer, onClose, onUpdated }) {
  const [form, setForm] = useState({
    name: customer.name || "",
    phone: customer.phone || "",
    gstin: customer.gstin || "",
    pan: customer.pan || "",
    address: customer.address || "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await axios.put(
        `/api/company/editcustomerform/${customer._id}`,
        form
      );

      toast.success("Customer updated successfully");
      onUpdated(); // refresh customer list
      onClose();   // close modal
    } catch (err) {
      toast.error("Failed to update customer");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-5 shadow-lg">
        {/* HEADER */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Customer</h3>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-3 text-sm">
          <Input
            label="Customer Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />

          <Input
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="GSTIN"
              name="gstin"
              value={form.gstin}
              onChange={handleChange}
            />
            <Input
              label="PAN"
              name="pan"
              value={form.pan}
              onChange={handleChange}
            />
          </div>

          <Textarea
            label="Address"
            name="address"
            value={form.address}
            onChange={handleChange}
          />

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-md bg-amber-600 px-4 py-2 text-white"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- UI Helpers ---------- */

function Input({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block font-medium">{label}</label>
      <input
        {...props}
        className="w-full rounded-md border px-3 py-2"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="mb-1 block font-medium">{label}</label>
      <textarea
        {...props}
        rows={3}
        className="w-full rounded-md border px-3 py-2"
      />
    </div>
  );
}
