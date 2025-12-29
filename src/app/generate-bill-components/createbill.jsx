"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { OrbitProgress } from "react-loading-indicators";
import toast, { Toaster } from "react-hot-toast";

export default function LandingPageBill() {
  const { status } = useSession(); // keep if needed later

  const [companydetails, setcompanydetails] = useState(null);
  const [customerdetails, setcustomerdetails] = useState(null);
  const [productdetails, setproductdetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const req = await axios.get("/api/company/getcompanydetails");
        setcompanydetails(req.data);

        const req2 = await axios.get("/api/company/getcustomers");
        setcustomerdetails(req2.data);

        const req3 = await axios.get("/api/company/getproducts");
        setproductdetails(req3.data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load billing data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /* ✅ LOADER */
  if (loading) {
    return (
      <div className="flex justify-center py-6">
        <div style={{ transform: "scale(0.6)" }}>
          <OrbitProgress variant="track-disc" color="#ef9b3d" size="small" />
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />

      {/* ITEMS TABLE */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="border px-2 py-2">S.No</th>
              <th className="border px-2 py-2 text-left">
                Description of Goods
              </th>
              <th className="border px-2 py-2">HSN / SAC</th>
              <th className="border px-2 py-2 text-right">Rate</th>
              <th className="border px-2 py-2 text-right">Qty</th>
              <th className="border px-2 py-2">Unit</th>
              <th className="border px-2 py-2 text-right">Taxable Amount</th>
              <th className="border px-2 py-2">IGST %</th>
              <th className="border px-2 py-2 text-right">IGST Amt</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border px-2 py-2 text-center">1</td>

              <td className="border px-2 py-2">
                <select className="w-full rounded border px-2 py-1">
                  <option>Select Product</option>
                  {productdetails?.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </td>

              <td className="border px-2 py-2 text-center">
                <input className="w-full rounded border px-2 py-1 text-center" />
              </td>

              <td className="border px-2 py-2 text-right">
                <input
                  type="number"
                  className="w-full rounded border px-2 py-1 text-right"
                />
              </td>

              <td className="border px-2 py-2 text-right">
                <input
                  type="number"
                  className="w-full rounded border px-2 py-1 text-right"
                />
              </td>

              <td className="border px-2 py-2 text-center">Nos</td>

              <td className="border px-2 py-2 text-right">0.00</td>

              <td className="border px-2 py-2 text-center">18%</td>

              <td className="border px-2 py-2 text-right">0.00</td>
            </tr>
          </tbody>
        </table>

        {/* ACTIONS OUTSIDE ROW */}
        <div className="mt-2 flex justify-between items-center">
          <button className="text-sm text-red-600 hover:underline">
            🗑 Remove Selected Row
          </button>

          <button className="rounded-md border border-dashed border-gray-400 px-4 py-2 text-sm hover:bg-gray-50">
            + Add Item
          </button>
        </div>
      </div>

      {/* GST SUMMARY */}
      <div className="flex justify-end">
        <div className="w-full sm:w-96 border border-gray-300 bg-gray-50 p-4 text-sm">
          <div className="flex justify-between mb-2">
            <span>Taxable Amount</span>
            <span>₹ 0.00</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>CGST</span>
            <span>₹ 0.00</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>SGST</span>
            <span>₹ 0.00</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>IGST</span>
            <span>₹ 0.00</span>
          </div>

          <div className="flex justify-between mb-2">
            <span>Round Off (+ / -)</span>
            <span>₹ 0.00</span>
          </div>

          <div className="flex justify-between font-bold text-lg border-t pt-2">
            <span>Grand Total</span>
            <span>₹ 0.00</span>
          </div>
        </div>
      </div>
    </>
  );
}
