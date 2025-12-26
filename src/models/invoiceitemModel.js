import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema(
  {
    // 🔗 Parent invoice
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
      index: true,
    },

    // 🔗 Original product (reference only)
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    // 🧾 SNAPSHOT FIELDS (IMMUTABLE)
    productNameSnapshot: {
      type: String,
      required: true,
      trim: true,
    },

    hsnSnapshot: {
      type: String,
      required: true,
      trim: true,
      match: [/^\d{4,8}$/, "Invalid HSN code"],
    },

    rateSnapshot: {
      type: Number,
      required: true,
      min: 0,
    },

    gstSnapshot: {
      type: Number,
      required: true,
      enum: [0, 5, 12, 18, 28],
    },

    // 📦 Quantity & calculation
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 🚀 Fast fetch of items for an invoice
invoiceItemSchema.index({ invoiceId: 1 });

// ✅ Prevent model overwrite error
const InvoiceItem =
  mongoose.models.InvoiceItem ||
  mongoose.model("InvoiceItem", invoiceItemSchema);

export default InvoiceItem;
