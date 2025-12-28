"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Pencil } from "lucide-react";
import EditCustomerForm from "../../app/manage-details-components/editcustomerdetail";

export default function CustomerListSection() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ edit modal state
  const [editCustomer, setEditCustomer] = useState(null);

  // 🔍 Filters
  const [search, setSearch] = useState("");

  // 📥 Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/company/getcustomers");
      setCustomers(res.data || []);
    } catch (err) {
      toast.error("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // 🧠 Filter logic
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  return (
    <>
      <div className="w-full px-4 sm:px-6">
        <Toaster position="top-right" />

        <div className="mx-auto mt-6 max-w-7xl rounded-lg border bg-white p-4 sm:p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Customer List
          </h2>

          {/* 🔍 SEARCH */}
          <input
            type="text"
            placeholder="Search by customer name..."
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
                    <Th>Phone</Th>
                    <Th>GSTIN</Th>
                    <Th>PAN</Th>
                    <Th className="text-center">Edit</Th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center">
                        Loading customers...
                      </td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="p-4 text-center">
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((c) => (
                      <tr
                        key={c._id}
                        className="border-t hover:bg-gray-50 h-[40px]"
                      >
                        <Td>{c.name}</Td>
                        <Td>{c.phone}</Td>
                        <Td>{c.gstin || "-"}</Td>
                        <Td>{c.pan || "-"}</Td>
                        <Td className="text-center">
                          <button
                            onClick={() => setEditCustomer(c)}
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

      {/* 🪟 Edit Modal */}
      {editCustomer && (
        <EditCustomerForm
          customer={editCustomer}
          onClose={() => setEditCustomer(null)}
          onUpdated={fetchCustomers}
        />
      )}
    </>
  );
}

/* ---------- Table Helpers ---------- */
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
