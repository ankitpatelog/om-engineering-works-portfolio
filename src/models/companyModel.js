import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    //  Relation with User
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "om-engineering-works-user",
      required: true,
    },

    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    gstin: {
      type: String,
      required: [true, "GSTIN is required"],
      uppercase: true,
      trim: true,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GSTIN format",
      ],
    },

    panno: {
      type: String,
      required: [true, "PAN no. is required"],
      uppercase: true,
      trim: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN number format"],
    },

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

    statecode: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },

    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Invalid email address",
      ],
    },

    // 🧾 Invoice configuration
    invoicePrefix: {
      type: String,
      default: "INVOICE NO:",
      uppercase: true,
      trim: true,
    },

    invoiceCounter: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Prevent model overwrite error (Next.js hot reload)
const Company =
  mongoose.models.Company || mongoose.model("Company", companySchema);

export default Company;
