"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { OrbitProgress } from "react-loading-indicators";
import { Plus, Trash2 } from "lucide-react";

export default function CompleteInvoicePage({ invoiceNo }) {
  const [savingInvoice, setSavingInvoice] = useState(false);
  const [transportMode, setTransportMode] = useState("By Road");
  const [vehicleNo, setVehicleNo] = useState("");
  const [noOfPackages, setNoOfPackages] = useState("");
  const [approxWeight, setApproxWeight] = useState("");
  /* ================= COMPANY ================= */
  const [company, setCompany] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(true);

  /* ================= CUSTOMERS ================= */
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [loadingCustomers, setLoadingCustomers] = useState(true);

  /* ================= PRODUCTS ================= */
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

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

  /* ================= FETCH COMPANY ================= */
  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const res = await axios.get("/api/company/getcompanydetails");
        setCompany(res.data);
      } catch {
        toast.error("Failed to load company details");
      } finally {
        setLoadingCompany(false);
      }
    };
    fetchCompany();
  }, []);

  /* ================= FETCH CUSTOMERS ================= */
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axios.get("/api/company/getcustomers");
        setCustomers(res.data || []);
      } catch (err) {
        console.error("Failed to load customers", err);
      } finally {
        setLoadingCustomers(false);
      }
    };
    fetchCustomers();
  }, []);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/api/company/getproducts");
        setProducts(res.data || []);
      } catch (err) {
        console.error("Failed to fetch products", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  /* ================= CUSTOMER DATA ================= */
  const selectedCustomer = useMemo(() => {
    return customers.find((c) => c._id === selectedCustomerId);
  }, [selectedCustomerId, customers]);

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

  const shippedTo = useMemo(() => {
    if (!selectedCustomer) return {};
    return {
      name: selectedCustomer.shippedTo?.name || "-",
      address: selectedCustomer.shippedTo?.address || "-",
      state: selectedCustomer.shippedTo?.state || "-",
      stateCode: selectedCustomer.shippedTo?.stateCode || "-",
      gstin: selectedCustomer.gstin,
      pan: selectedCustomer.pan,
    };
  }, [selectedCustomer]);

  /* ================= PRODUCT LOGIC ================= */
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

  /* ================= LOADER ================= */
  if (loadingCompany || loadingCustomers || loadingProducts) {
    return (
      <div className="flex justify-center py-8">
        <OrbitProgress variant="track-disc" color="#ef9b3d" size="small" />
      </div>
    );
  }

  if (!company) return null;

  const numberToWords = (num) => {
    if (!num || num === 0) return "Zero";

    const ones = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
    ];
    const tens = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const teens = [
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];

    const convertLessThanThousand = (n) => {
      if (n === 0) return "";
      if (n < 10) return ones[n];
      if (n < 20) return teens[n - 10];
      if (n < 100) {
        const ten = tens[Math.floor(n / 10)];
        const one = ones[n % 10];
        return ten + (one ? " " + one : "");
      }
      const hundred = ones[Math.floor(n / 100)] + " Hundred";
      const rest = n % 100;
      return hundred + (rest ? " " + convertLessThanThousand(rest) : "");
    };

    // Separate rupees and paise
    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);

    let result = "";

    // Convert rupees
    if (rupees === 0) {
      result = "Zero";
    } else if (rupees < 1000) {
      result = convertLessThanThousand(rupees);
    } else if (rupees < 100000) {
      const thousands = Math.floor(rupees / 1000);
      const remainder = rupees % 1000;
      result = convertLessThanThousand(thousands) + " Thousand";
      if (remainder > 0) {
        result += " " + convertLessThanThousand(remainder);
      }
    } else if (rupees < 10000000) {
      const lakhs = Math.floor(rupees / 100000);
      const remainder = rupees % 100000;
      result = convertLessThanThousand(lakhs) + " Lakh";
      if (remainder >= 1000) {
        const thousands = Math.floor(remainder / 1000);
        const finalRemainder = remainder % 1000;
        result += " " + convertLessThanThousand(thousands) + " Thousand";
        if (finalRemainder > 0) {
          result += " " + convertLessThanThousand(finalRemainder);
        }
      } else if (remainder > 0) {
        result += " " + convertLessThanThousand(remainder);
      }
    } else {
      const crores = Math.floor(rupees / 10000000);
      const remainder = rupees % 10000000;
      result = convertLessThanThousand(crores) + " Crore";

      if (remainder >= 100000) {
        const lakhs = Math.floor(remainder / 100000);
        const lakhRemainder = remainder % 100000;
        result += " " + convertLessThanThousand(lakhs) + " Lakh";

        if (lakhRemainder >= 1000) {
          const thousands = Math.floor(lakhRemainder / 1000);
          const finalRemainder = lakhRemainder % 1000;
          result += " " + convertLessThanThousand(thousands) + " Thousand";
          if (finalRemainder > 0) {
            result += " " + convertLessThanThousand(finalRemainder);
          }
        } else if (lakhRemainder > 0) {
          result += " " + convertLessThanThousand(lakhRemainder);
        }
      } else if (remainder >= 1000) {
        const thousands = Math.floor(remainder / 1000);
        const finalRemainder = remainder % 1000;
        result += " " + convertLessThanThousand(thousands) + " Thousand";
        if (finalRemainder > 0) {
          result += " " + convertLessThanThousand(finalRemainder);
        }
      } else if (remainder > 0) {
        result += " " + convertLessThanThousand(remainder);
      }
    }

    // Add paise if present - only "and" before paise
    if (paise > 0) {
      result += " and " + convertLessThanThousand(paise) + " Paise";
    }

    return result;
  };

  const handleSaveInvoice = async () => {
    // Validation
    if (!selectedCustomerId) {
      toast.error("Please select a customer");
      return;
    }

    const hasProducts = rows.some((row) => row.productId && row.qty > 0);
    if (!hasProducts) {
      toast.error("Please add at least one product with quantity");
      return;
    }

    setSavingInvoice(true);

    try {
      const invoiceData = {
        invoiceNo,
        customerId: selectedCustomerId,
        customerName: selectedCustomer?.name, // Add customer name for reference
        items: rows
          .filter((row) => row.productId && row.qty > 0)
          .map((row) => ({
            productId: row.productId,
            productName: row.productName,
            description: row.description,
            hsn: row.hsn,
            rate: row.rate,
            qty: row.qty,
            unit: row.unit,
            gstPercent: row.gstPercent,
            taxableAmount: row.taxableAmount,
            gstAmount: row.gstAmount,
            totalAmount: row.totalAmount,
          })),
        transportMode,
        vehicleNo: vehicleNo || "-",
        noOfPackages: noOfPackages || "0",
        approxWeight: approxWeight || "0",
        taxableAmount: totals.taxable,
        gstAmount: totals.gst,
        grandTotal: totals.grand,
        amountInWords: numberToWords(totals.grand),
        date: new Date(),
        billedTo, // Include billed to details
        shippedTo, // Include shipped to details
      };

      const response = await axios.post(
        "/api/company/saveinvoice",
        invoiceData
      );

      if (response.data) {
        toast.success("Invoice saved successfully!");
        // Optionally, you can redirect or reset form here
        // router.push('/invoices'); // If using Next.js router
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save invoice";
      toast.error(errorMessage);
    } finally {
      setSavingInvoice(false);
    }
  };

  return (
    <>
      {/* ================= INVOICE HEADER ================= */}
      <div className="mx-4 my-4 w-auto border border-black bg-white text-sm">
        <div className="border-b border-black py-3 text-center text-base font-bold uppercase tracking-wide">
          {company.companyName}
        </div>

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

      {/* ================= BUYER / CONSIGNEE ================= */}
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

      {/* ================= ITEMS + FOOTER ================= */}
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

        <div className="flex justify-end p-2">
          <button
            onClick={addRow}
            className="flex items-center gap-1 border border-black px-2 py-1"
          >
            <Plus size={14} /> Add Row
          </button>
        </div>
      </div>

      <div className="mx-4 mt-2 border border-black text-sm bg-white">
        <div className="grid grid-cols-2 border-b border-black">
          <div className="border-r border-black p-2 space-y-2">
            <div className="flex items-center gap-2">
              <b>Mode of Transport :</b>
              <select
                value={transportMode}
                onChange={(e) => setTransportMode(e.target.value)}
                className="border px-2 py-1 text-sm"
              >
                <option>By Road</option>
                <option>By Rikshaw</option>
                <option>By Rail</option>
                <option>By Air</option>
                <option>By Ship</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <b>Vehicle No. :</b>
              <input
                type="text"
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                className="border px-2 py-1 text-sm flex-1"
                placeholder="Enter vehicle number"
              />
            </div>
            <div className="flex items-center gap-2">
              <b>No. of Packages :</b>
              <input
                type="number"
                value={noOfPackages}
                onChange={(e) => setNoOfPackages(e.target.value)}
                className="border px-2 py-1 text-sm w-24"
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <b>Approx. Wt. (Kgs) :</b>
              <input
                type="number"
                value={approxWeight}
                onChange={(e) => setApproxWeight(e.target.value)}
                className="border px-2 py-1 text-sm w-24"
                placeholder="0"
                step="0.01"
              />
            </div>
          </div>
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
          <b>Total Invoice Value (in words) :</b> Rupees{" "}
          {numberToWords(totals.grand)} Only
        </div>
      </div>
      {/* ================= ACTION BUTTONS ================= */}
      <div className="mx-4 my-4 flex gap-3 print:hidden">
        <button
          onClick={handleSaveInvoice}
          disabled={savingInvoice}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[140px]"
        >
          {savingInvoice ? "Saving..." : "Save Bill"}
        </button>
      </div>
    </>
  );
}
