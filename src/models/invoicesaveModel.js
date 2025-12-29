import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    /* ================= AUTH / OWNER ================= */
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "om-engineering-works-user",
      required: true,
      index: true,
    },

    /* ================= INVOICE META ================= */
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    invoiceDate: {
      type: Date,
      default: Date.now,
    },

    /* ================= COMPANY SNAPSHOT ================= */
    company: {
      companyName: String,
      gstin: String,
      panno: String,
      address: String,
      state: String,
      stateCode: String,
      phone: String,
      email: String,
    },

    /* ================= CUSTOMER SNAPSHOT ================= */
    billedTo: {
      name: String,
      address: String,
      gstin: String,
      pan: String,
      state: String,
      stateCode: String,
      poNo: String,
      poDate: String,
    },

    shippedTo: {
      name: String,
      address: String,
      gstin: String,
      pan: String,
      state: String,
      stateCode: String,
    },

    /* ================= ITEMS (ROWS[]) ================= */
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        productName: String,
        description: String,
        hsn: String,
        rate: Number,
        qty: Number,
        unit: String,
        gstPercent: Number,
        taxableAmount: Number,
        gstAmount: Number,
        totalAmount: Number,
      },
    ],

    /* ================= TRANSPORT ================= */
    transport: {
      mode: String,
      vehicleNo: String,
      noOfPackages: Number,
      approxWeight: Number,
    },

    /* ================= TOTALS ================= */
    totals: {
      taxableAmount: Number,
      cgst: Number,
      sgst: Number,
      igst: Number,
      roundOff: Number,
      grandTotal: Number,
    },

    amountInWords: String,

    status: {
      type: String,
      enum: ["FINAL"],
      default: "FINAL",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", invoiceSchema);
