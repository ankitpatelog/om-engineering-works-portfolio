"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function BuyerConsigneeSection() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [loading, setLoading] = useState(true);

  /* 🔹 Fetch customers on component load */
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("/api/company/getcustomers");
        setCustomers(res.data || []);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  /* 🔹 Selected customer */
  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c._id === selectedCustomerId);
  }, [selectedCustomerId, customers]);

  /* ✅ BILLED TO (MAIN CUSTOMER) */
  const billedTo = useMemo(() => {
    if (!selectedCustomer) return {};

    return {
      name: selectedCustomer.name,
      address: selectedCustomer.address,
      gstin: selectedCustomer.gstin,
      pan: selectedCustomer.pan,
      state: selectedCustomer.state,
      stateCode: selectedCustomer.stateCode,
      poNo: selectedCustomer.poNumber,
      poDate: selectedCustomer.poDate
        ? new Date(selectedCustomer.poDate).toLocaleDateString("en-GB")
        : "-",
    };
  }, [selectedCustomer]);

  /* ✅ SHIPPED TO (NESTED OBJECT) */
  const shippedTo = useMemo(() => {
    if (!selectedCustomer) return {};

    return {
      name: selectedCustomer.shippedTo?.name || "-",
      address: selectedCustomer.shippedTo?.address || "-",
      state: selectedCustomer.shippedTo?.state || "-",
      stateCode: selectedCustomer.shippedTo?.stateCode || "-",

      // ✅ SAME AS BILLED TO
      gstin: selectedCustomer.gstin,
      pan: selectedCustomer.pan,
    };
  }, [selectedCustomer]);

  if (loading) {
    return (
      <div className="mx-4 my-4 text-sm text-gray-500">
        Loading customer details...
      </div>
    );
  }

  return (
    <>
      {/* 🔽 CUSTOMER SELECT */}
      <div className="mx-4 mt-4 mb-2">
        <label className="block text-sm font-medium mb-1">
          Select Customer
        </label>
        <select
          value={selectedCustomerId}
          onChange={(e) => setSelectedCustomerId(e.target.value)}
          className="w-full border border-black px-2 py-1 text-sm"
        >
          <option value="">-- Select Customer --</option>
          {customers.map((cust) => (
            <option key={cust._id} value={cust._id}>
              {cust.name}
            </option>
          ))}
        </select>
      </div>

      {/* 🔳 TABLE */}
      <div className="mx-4 my-4 w-auto border border-black bg-white text-sm">
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <th className="w-1/2 border border-black px-2 py-2 text-left font-bold">
                Details of Receiver | Billed to
              </th>
              <th className="w-1/2 border border-black px-2 py-2 text-left font-bold">
                Details of Consignee | Shipped to
              </th>
            </tr>

            <tr>
              <td className="border border-black px-2 py-2">
                <span className="font-medium">Name :</span>{" "}
                {billedTo.name || "-"}
              </td>
              <td className="border border-black px-2 py-2">
                <span className="font-medium">Name :</span>{" "}
                {shippedTo.name || "-"}
              </td>
            </tr>

            <tr>
              <td className="border border-black px-2 py-2 align-top">
                <span className="font-medium">Address :</span>{" "}
                {billedTo.address || "-"}
              </td>
              <td className="border border-black px-2 py-2 align-top">
                <span className="font-medium">Address :</span>{" "}
                {shippedTo.address || "-"}
              </td>
            </tr>

            <tr>
              <td className="border border-black px-2 py-2">
                <span className="font-medium">GST No. :</span>{" "}
                {billedTo.gstin || "-"}
              </td>
              <td className="border border-black px-2 py-2">
                <span className="font-medium">GST No. :</span>{" "}
                {shippedTo.gstin || "-"}
              </td>
            </tr>

            <tr>
              <td className="border border-black px-2 py-2">
                <span className="font-medium">PAN No. :</span>{" "}
                {billedTo.pan || "-"}
              </td>
              <td className="border border-black px-2 py-2">
                <span className="font-medium">PAN No. :</span>{" "}
                {shippedTo.pan || "-"}
              </td>
            </tr>

            <tr>
              <td className="border border-black px-2 py-2">
                <span className="font-medium">State :</span>{" "}
                {billedTo.state || "-"}
                <span className="ml-6 font-medium">State Code :</span>{" "}
                {billedTo.stateCode || "-"}
              </td>
              <td className="border border-black px-2 py-2">
                <span className="font-medium">State :</span>{" "}
                {shippedTo.state || "-"}
                <span className="ml-6 font-medium">State Code :</span>{" "}
                {shippedTo.stateCode || "-"}
              </td>
            </tr>

            <tr>
              <td className="border border-black px-2 py-2">
                <span className="font-medium">P.O. No. :</span>{" "}
                {billedTo.poNo || "-"}
                <span className="ml-6 font-medium">P.O. Date :</span>{" "}
                {billedTo.poDate || "-"}
              </td>
              <td className="border border-black px-2 py-2">&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
