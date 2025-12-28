"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Pencil } from "lucide-react";
import EditProductForm from "../../app/manage-details-components/editproductdetail";

export default function ProductListSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ added ONLY what is required
  const [editProduct, setEditProduct] = useState(null);

  // 🔍 Filters (UNCHANGED)
  const [search, setSearch] = useState("");
  const [gstFilter, setGstFilter] = useState("");
  const [unitFilter, setUnitFilter] = useState("");

  // 📥 Fetch products (UNCHANGED)
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/company/getproducts");
      setProducts(res.data || []);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // 🧠 Filter logic (UNCHANGED)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesName = p.name?.toLowerCase().includes(search.toLowerCase());
      const matchesGST = gstFilter ? String(p.gstPercent) === gstFilter : true;
      const matchesUnit = unitFilter ? p.unit === unitFilter : true;
      return matchesName && matchesGST && matchesUnit;
    });
  }, [products, search, gstFilter, unitFilter]);

  return (
    <>
      <div className="w-full px-4 sm:px-6">
        <Toaster position="top-right" />

        <div className="mx-auto mt-6 max-w-7xl rounded-lg border bg-white p-4 sm:p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Product List
          </h2>

          {/* 🧩 FILTER BAR (UNCHANGED) */}
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select
              value={gstFilter}
              onChange={(e) => setGstFilter(e.target.value)}
              className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            >
              <option value="">All GST %</option>
              <option value="0">0%</option>
              <option value="3">3%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
              <option value="28">28%</option>
            </select>

            <select
              value={unitFilter}
              onChange={(e) => setUnitFilter(e.target.value)}
              className="rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            >
              <option value="">All Units</option>
              <option value="Nos.">Nos.</option>
              <option value="Kg">Kg</option>
              <option value="Meter">Meter</option>
            </select>

            <button
              onClick={() => {
                setSearch("");
                setGstFilter("");
                setUnitFilter("");
              }}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100"
            >
              Reset Filters
            </button>
          </div>

          {/* 🔍 SEARCH (UNCHANGED) */}
          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />

          {/* 📊 TABLE */}
          <div className="relative overflow-x-auto">
            <div className="max-h-[260px] overflow-y-auto rounded-md border">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-gray-100 text-gray-700">
                  <tr>
                    <Th>Name</Th>
                    <Th>HSN</Th>
                    <Th>Rate</Th>
                    <Th>GST %</Th>
                    <Th>Unit</Th>
                    <Th>Description</Th>
                    <Th className="text-center">Edit</Th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="p-4 text-center">
                        Loading products...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="p-4 text-center">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr
                        key={p._id}
                        className="border-t hover:bg-gray-50 h-[40px]"
                      >
                        <Td>{p.name}</Td>
                        <Td>{p.hsnCode}</Td>
                        <Td>₹{p.rate}</Td>
                        <Td>{p.gstPercent}%</Td>
                        <Td>{p.unit}</Td>
                        <Td className="max-w-xs truncate">
                          {p.description}
                        </Td>
                        <Td className="text-center">
                          {/* ✅ ONLY change here */}
                          <button
                            onClick={() => setEditProduct(p)}
                            className="rounded-md p-1 text-amber-600 hover:bg-amber-100"
                          >
                            <Pencil size={16} />
                          </button>
                        </Td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/*  modal rendering */}
      {editProduct && (
        <EditProductForm
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onUpdated={fetchProducts}
        />
      )}
    </>
  );
}

/* ---------- Table Helpers (UNCHANGED) ---------- */
function Th({ children, className = "" }) {
  return (
    <th
      className={`whitespace-nowrap px-3 py-2 text-left font-semibold ${className}`}
    >
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return (
    <td
      className={`px-3 py-1.5 text-sm leading-tight text-gray-700 ${className}`}
    >
      {children}
    </td>
  );
}
