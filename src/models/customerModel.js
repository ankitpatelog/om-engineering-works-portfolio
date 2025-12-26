import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    // 🔗 Customer belongs to a user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "om-engineering-works-user",
      required: true,
    },

    // 👤 Customer basic details
    name: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },

    // 🧾 GST Details
    gstin: {
      type: String,
      uppercase: true,
      trim: true,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GSTIN format",
      ],
    },

    pan: {
      type: String,
      uppercase: true,
      trim: true,
      match: [
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        "Invalid PAN format",
      ],
    },

    // 📍 Address (used for both Billing & Shipping)
    address: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    state: {
      type: String,
      required: true,
      trim: true,
    },

    stateCode: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },

    // 🚚 Shipping info (if different from billing)
    shippedTo: {
      name: {
        type: String,
        trim: true,
      },
      address: {
        type: String,
        trim: true,
        maxlength: 300,
      },
      state: {
        type: String,
        trim: true,
      },
      stateCode: {
        type: Number,
        min: 1,
        max: 99,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error (Next.js hot reload)
const Customer =
  mongoose.models.Customer || mongoose.model("Customer", customerSchema);

export default Customer;
