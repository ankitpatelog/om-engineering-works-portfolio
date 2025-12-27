"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ViewCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/company/getallcustomers");
      setCustomers(res.data.customers || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load customers"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-600">
        Loading customers...
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 mt-6">
      <div className="max-w-7xl mx-auto bg-white border rounded-lg shadow-sm p-4 sm:p-6">

        <h2 className="text-xl font-bold text-gray-900 mb-4">
          All Customers
        </h2>

        {customers.length === 0 ? (
          <p className="text-sm text-gray-600">
            No customers found.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <Th>Name</Th>
                  <Th>Phone</Th>
                  <Th>GSTIN</Th>
                  <Th>State</Th>
                  <Th>Created</Th>
                  <Th align="right">Action</Th>
                </tr>
              </thead>

              <tbody>
                {customers.map((cust) => (
                  <tr
                    key={cust._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <Td>{cust.name}</Td>
                    <Td>{cust.phone}</Td>
                    <Td>{cust.gstin || "-"}</Td>
                    <Td>{cust.state}</Td>
                    <Td>
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </Td>
                    <Td align="right">
                      <button
                        onClick={() =>
                          router.push(`/dashboard/customers/${cust._id}`)
                        }
                        className="text-amber-600 font-semibold hover:underline"
                      >
                        Edit
                      </button>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

/* ---------- Small Helpers ---------- */

function Th({ children, align = "left" }) {
  return (
    <th
      className={`px-3 py-2 text-${align} font-semibold text-gray-700`}
    >
      {children}
    </th>
  );
}

function Td({ children, align = "left" }) {
  return (
    <td
      className={`px-3 py-2 text-${align} text-gray-700 whitespace-nowrap`}
    >
      {children}
    </td>
  );
}
