import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    // Product belongs to a user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "om-engineering-works-user",
      required: true,
      index: true, // fast fetch per user
    },

    // 📦 Product details
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: 2,
      maxlength: 300,
    },

    hsnCode: {
      type: String,
      required: [true, "HSN code is required"],
      trim: true,
      match: [/^\d{4,8}$/, "Invalid HSN code"],
    },

    rate: {
      type: Number,
      required: true,
      min: [0, "Rate cannot be negative"],
    },

    unit: {
      type: String,
      default: "Nos.",
      trim: true,
    },

    gstPercent: {
      type: Number,
      required: true,
      enum: [0, 3, 5, 12, 18, 28],
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error (Next.js hot reload)
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
