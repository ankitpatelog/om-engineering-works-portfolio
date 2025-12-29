"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Plus, Trash2 } from "lucide-react";

export default function InvoiceItemsAndFooterSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [rows, setRows] = useState([
    {
      productId: "",
      search: "",
      productName: "",
      description: "",
      hsn: "",
      rate: 0,
      qty: "",
      unit: "",
      gstPercent: 0,
      taxableAmount: 0,
      gstAmount: 0,
      totalAmount: 0,
      showDropdown: false,
    },
  ]);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/company/getproducts");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ================= SELECT PRODUCT ================= */
  const selectProduct = (rowIndex, product) => {
    const updated = [...rows];
    const qty = Number(updated[rowIndex].qty) || 0;

    const taxable = qty * product.rate;
    const gstAmount = (taxable * product.gstPercent) / 100;

    updated[rowIndex] = {
      ...updated[rowIndex],
      productId: product._id,
      search: product.name,
      productName: product.name,
      description: product.description || "-",
      hsn: product.hsnCode,
      rate: product.rate,
      unit: product.unit,
      gstPercent: product.gstPercent,
      taxableAmount: taxable,
      gstAmount,
      totalAmount: taxable + gstAmount,
      showDropdown: false,
    };

    setRows(updated);
  };

  /* ================= QTY CHANGE ================= */
  const handleQtyChange = (index, value) => {
    const qty = value === "" ? "" : Math.max(0, Number(value));
    const updated = [...rows];
    const row = updated[index];

    const taxable = qty * row.rate;
    const gstAmount = (taxable * row.gstPercent) / 100;

    updated[index] = {
      ...row,
      qty,
      taxableAmount: taxable,
      gstAmount,
      totalAmount: taxable + gstAmount,
    };

    setRows(updated);
  };

  /* ================= ADD / DELETE ROW ================= */
  const addRow = () => {
    setRows([
      ...rows,
      {
        productId: "",
        search: "",
        productName: "",
        description: "",
        hsn: "",
        rate: 0,
        qty: "",
        unit: "",
        gstPercent: 0,
        taxableAmount: 0,
        gstAmount: 0,
        totalAmount: 0,
        showDropdown: false,
      },
    ]);
  };

  const deleteRow = (index) => {
    if (rows.length === 1) return;
    setRows(rows.filter((_, i) => i !== index));
  };

  /* ================= TOTALS ================= */
  const totals = useMemo(() => {
    return rows.reduce(
      (acc, r) => {
        acc.taxable += r.taxableAmount;
        acc.gst += r.gstAmount;
        acc.grand += r.totalAmount;
        return acc;
      },
      { taxable: 0, gst: 0, grand: 0 }
    );
  }, [rows]);

  if (loading) {
    return (
      <div className="mx-4 text-sm text-gray-500">Loading products...</div>
    );
  }

  return (
    <>
      {/* ================= ITEMS TABLE ================= */}
      <div className="mx-4 my-4 border border-black bg-white text-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr className="font-bold">
              <th className="border px-1 py-1 w-6">S.No</th>
              <th className="border px-2 py-1 w-48">Product Name</th>
              <th className="border px-2 py-1">Description</th>
              <th className="border px-2 py-1 w-28">HSN</th>
              <th className="border px-2 py-1 w-20">Rate</th>
              <th className="border px-1 py-1 w-14 text-center">Qty</th>
              <th className="border px-2 py-1 w-10">Unit</th>
              <th className="border px-2 py-1 w-10">GST %</th>
              <th className="border px-2 py-1 w-28">Taxable</th>
              <th className="border px-2 py-1 w-28">GST</th>
              <th className="border px-2 py-1 w-28">Total</th>
              <th className="border px-2 py-1 w-10"></th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => {
              const filteredProducts = products.filter(
                (p) =>
                  p.name.toLowerCase().includes(row.search.toLowerCase()) ||
                  p.description
                    ?.toLowerCase()
                    .includes(row.search.toLowerCase())
              );

              return (
                <tr key={index}>
                  <td className="border text-center">{index + 1}</td>

                  {/* Product Search */}
                  <td className="border px-2 py-1 relative">
                    <input
                      className="w-full border px-1"
                      placeholder="Search product..."
                      value={row.search}
                      onChange={(e) => {
                        const updated = [...rows];
                        updated[index].search = e.target.value;
                        updated[index].showDropdown = true;
                        setRows(updated);
                      }}
                    />

                    {row.showDropdown && row.search && (
                      <div className="absolute z-10 bg-white border w-full max-h-40 overflow-auto">
                        {filteredProducts.map((p) => (
                          <div
                            key={p._id}
                            className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                            onClick={() => selectProduct(index, p)}
                          >
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-gray-500">
                              {p.description}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>

                  <td className="border px-2 py-1">{row.description}</td>
                  <td className="border px-2 py-1">{row.hsn}</td>
                  <td className="border px-2 py-1">{row.rate}</td>

                  <td className="border text-center">
                    <input
                      type="number"
                      className="w-12 border text-center"
                      value={row.qty}
                      onChange={(e) => handleQtyChange(index, e.target.value)}
                    />
                  </td>

                  <td className="border px-2 py-1">{row.unit}</td>
                  <td className="border px-2 py-1">{row.gstPercent}%</td>
                  <td className="border px-2 py-1">
                    {row.taxableAmount.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1">
                    {row.gstAmount.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1">
                    {row.totalAmount.toFixed(2)}
                  </td>

                  <td className="border text-center">
                    <button onClick={() => deleteRow(index)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Add Row */}
        <div className="flex justify-end p-2">
          <button
            onClick={addRow}
            className="flex items-center gap-1 border border-black px-2 py-1"
          >
            <Plus size={14} /> Add Row
          </button>
        </div>
      </div>

      {/* ================= FOOTER SECTION ================= */}
      <div className="mx-4 mt-2 border border-black text-sm bg-white">
        <div className="grid grid-cols-2 border-b border-black">
          {/* Left */}
          <div className="border-r border-black p-2 space-y-1">
            <div>
              <b>Mode of Transport :</b> By Road
            </div>
            <div>
              <b>Vehicle No. :</b> __________
            </div>
            <div>
              <b>No. of Packages :</b> __________
            </div>
            <div>
              <b>Approx. Wt. (Kgs) :</b> __________
            </div>
          </div>

          {/* Right */}
          <div className="p-2 space-y-1">
            <div className="flex justify-between">
              <span>Taxable Amount</span>
              <span>{totals.taxable.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST</span>
              <span>0.00</span>
            </div>
            <div className="flex justify-between">
              <span>SGST</span>
              <span>0.00</span>
            </div>
            <div className="flex justify-between">
              <span>IGST</span>
              <span>{totals.gst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Round Off</span>
              <span>0.00</span>
            </div>
            <div className="flex justify-between font-bold border-t pt-1">
              <span>Grand Total (Rs.)</span>
              <span>{totals.grand.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="border-b border-black p-2">
          <b>GST Payable on Reverse Charge :</b> N.A.
        </div>

        <div className="border-b border-black p-2">
          <b>Total Invoice Value (in words) :</b> Rupees __________________ Only
        </div>
      </div>
    </>
  );
}
