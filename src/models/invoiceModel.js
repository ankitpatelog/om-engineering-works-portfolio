import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    // 🔐 Multi-tenant safety
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "om-engineering-works-user",
      required: true,
      index: true,
    },

    // 🏢 Company issuing invoice
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // 👤 Customer receiving invoice
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    // 🧾 Invoice identity
    invoiceNumber: {
      type: String,
      required: true,
      trim: true,
    },

    invoiceDate: {
      type: Date,
      default: Date.now,
    },

    // 💰 Amount breakdown
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    cgst: {
      type: Number,
      default: 0,
      min: 0,
    },

    sgst: {
      type: Number,
      default: 0,
      min: 0,
    },

    igst: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
    },

    roundoff: {
      type: Number,
      default: 0,
    },

    grandTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    // 💳 Payment details
    paymentMode: {
      type: String,
      enum: ["CASH", "UPI", "CARD", "BANK_TRANSFER", "CHEQUE"],
      required: true,
    },

    status: {
      type: String,
      enum: ["DRAFT", "PAID", "UNPAID", "CANCELLED", "PENDING"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  }
);

// 🚀 Indexes
invoiceSchema.index({ userId: 1, invoiceDate: -1 });
invoiceSchema.index({ userId: 1, invoiceNumber: 1 }, { unique: true });

// ✅ Prevent model overwrite error
const Invoice =
  mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);

export default Invoice;
