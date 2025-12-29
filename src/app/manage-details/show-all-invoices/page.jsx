"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { Pencil, Download, Printer } from "lucide-react";
import { OrbitProgress } from "react-loading-indicators";

export default function CustomerListSection() {
  const { status } = useSession();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCustomer, setEditCustomer] = useState(null);
  const [search, setSearch] = useState("");

  // 🔹 FETCH CUSTOMERS
  useEffect(() => {
    if (status !== "authenticated") return;

    const fetchCustomers = async () => {
      try {
        const res = await axios.get("/api/company/getallinvoices");
        setCustomers(res.data || []);
      } catch (error) {
        toast.error("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [status]);

  // 🔍 SEARCH FILTER
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) =>
      c.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  // ⬇️ DOWNLOAD HANDLER
  const handleDownload = (customer) => {
    toast.success(`Download invoice for ${customer.name}`);
    // later → call PDF download API
  };

  // 🖨 PRINT HANDLER
  const handlePrint = (customer) => {
    toast.success(`Print invoice for ${customer.name}`);
    // later → window.print() or print PDF
  };

  /* ⏳ LOADING SESSION */
  if (status === "loading") {
    return (
      <div className="flex justify-center py-10">
        <OrbitProgress variant="track-disc" color="#ef9b3d" size="small" />
      </div>
    );
  }

  /* 🔐 NOT LOGGED IN */
  if (status === "unauthenticated") {
    return (
      <div className="py-10 text-center text-gray-500">
        Please login to view customers.
      </div>
    );
  }

  /* ✅ MAIN UI */
  return (
    <>
      <Toaster position="top-right" />

      <div className="w-full px-4 sm:px-6">
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

          <div className="relative overflow-x-auto">
            <div className="max-h-[260px] overflow-y-auto rounded-md border">
              <table className="w-full border-collapse text-sm">
                <thead className="sticky top-0 bg-gray-100">
                  <tr>
                    <Th>Name</Th>
                    <Th>Phone</Th>
                    <Th>GSTIN</Th>
                    <Th>PAN</Th>
                    <Th className="text-center">Actions</Th>
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
                      <tr key={c._id} className="border-t hover:bg-gray-50">
                        <Td>{c.name}</Td>
                        <Td>{c.phone}</Td>
                        <Td>{c.gstin || "-"}</Td>
                        <Td>{c.pan || "-"}</Td>
                        <Td className="text-center">
                          <div className="flex justify-center gap-2">
                            {/* ⬇️ DOWNLOAD */}
                            <button
                              onClick={() => handleDownload(c)}
                              className="rounded-md p-1 text-blue-600 hover:bg-blue-100"
                              title="Download Invoice"
                            >
                              <Download size={16} />
                            </button>

                            {/* 🖨 PRINT */}
                            <button
                              onClick={() => handlePrint(c)}
                              className="rounded-md p-1 text-green-600 hover:bg-green-100"
                              title="Print Invoice"
                            >
                              <Printer size={16} />
                            </button>

                            {/* ✏️ EDIT */}
                            <button
                              onClick={() => setEditCustomer(c)}
                              className="rounded-md p-1 text-amber-600 hover:bg-amber-100"
                              title="Edit Customer"
                            >
                              <Pencil size={16} />
                            </button>
                          </div>
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
    </>
  );
}

/* ---------- TABLE HELPERS ---------- */
function Th({ children, className = "" }) {
  return (
    <th className={`px-3 py-2 text-left font-semibold ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return (
    <td className={`px-3 py-1.5 text-gray-700 ${className}`}>
      {children}
    </td>
  );
}
