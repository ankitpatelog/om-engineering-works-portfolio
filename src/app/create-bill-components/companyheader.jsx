"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { OrbitProgress } from "react-loading-indicators";

export default function InvoiceHeaderSection({ invoiceNo }) {
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get("/api/company/getcompanydetails");
        setCompany(res.data);
      } catch (err) {
        toast.error("Failed to load company details");
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <OrbitProgress variant="track-disc" color="#ef9b3d" size="small" />
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="mx-4 my-4 w-auto border border-black bg-white text-sm">

      {/* COMPANY NAME */}
      <div className="border-b border-black py-3 text-center text-base font-bold uppercase tracking-wide">
        {company.companyName}
      </div>

      {/* HEADER TABLE */}
      <div className="px-3 py-2">
        <table className="w-full border-collapse">
          <tbody>

            <tr>
              <td className="w-[18%] border border-black px-3 py-2 font-medium">
                GST No.
              </td>
              <td className="w-[32%] border border-black px-3 py-2">
                {company.gstin}
              </td>

              <td className="w-[18%] border border-black px-3 py-2 font-medium">
                Invoice No.
              </td>
              <td className="w-[32%] border border-black px-3 py-2">
                {invoiceNo}
              </td>
            </tr>

            <tr>
              <td className="border border-black px-3 py-2 font-medium">
                PAN No.
              </td>
              <td className="border border-black px-3 py-2">
                {company.panno}
              </td>

              <td className="border border-black px-3 py-2 font-medium">
                Date
              </td>
              <td className="border border-black px-3 py-2">
                {new Date().toLocaleDateString("en-IN")}
              </td>
            </tr>

            <tr>
              <td className="border border-black px-3 py-2 font-medium">
                State
              </td>
              <td className="border border-black px-3 py-2">
                {company.state}
              </td>

              <td className="border border-black px-3 py-2 font-medium">
                State Code
              </td>
              <td className="border border-black px-3 py-2">
                {company.statecode}
              </td>
            </tr>

            <tr>
              <td className="border border-black px-3 py-2 font-medium">
                M. No.
              </td>
              <td className="border border-black px-3 py-2">
                {company.phone}
              </td>

              <td className="border border-black px-3 py-2 font-medium">
                Email
              </td>
              <td className="border border-black px-3 py-2">
                {company.email}
              </td>
            </tr>

          </tbody>
        </table>
      </div>
    </div>
  );
}
