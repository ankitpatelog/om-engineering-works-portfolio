"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { OrbitProgress } from "react-loading-indicators";
import { Plus, Trash2 } from "lucide-react";

export default function CompleteInvoicePage({ invoiceNo }) {
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
                      onChange={(e) =>
                        handleQtyChange(index, e.target.value)
                      }
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
