import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    userId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [100, "Company name cannot exceed 100 characters"],
    },
    companyEmail: {
      type: String,
      required: [true, "Company email is required"],
      trim: true,
      lowercase: true,
      match: [/.+\@.+\..+/, "Please provide a valid email address"],
    },
    companyPhone: {
      type: String,
      required: [true, "Company phone number is required"],
      trim: true,
      maxlength: [15, "Company phone number cannot exceed 15 characters"],
    },
    companyAddress: {
      type: String,
      required: [true, "Company address is required"],
      trim: true,
      maxlength: [200, "Company address cannot exceed 200 characters"],
    },
    city: {
      type: String,
      trim: true,
      maxlength: [50, "City name cannot exceed 50 characters"],
    },
    state: {
      type: String,
      trim: true,
      maxlength: [50, "State name cannot exceed 50 characters"],
    },
    zipCode: {
      type: String,
      trim: true,
      maxlength: [10, "Zip code cannot exceed 10 characters"],
    },
    country: {
      type: String,
      trim: true,
      maxlength: [50, "Country name cannot exceed 50 characters"],
    },
    taxId: {
      type: String,
      trim: true,
      maxlength: [30, "Tax ID cannot exceed 30 characters"],
    },
    website: {
      type: String,
      trim: true,
      match: [/^https?:\/\/.+/, "Please enter a valid website URL"],
    },
    invoicePrefix: {
      type: String,
      default: "INV",
      trim: true,
      maxlength: [10, "Invoice prefix cannot exceed 10 characters"],
    },
    startingNumber: {
      type: Number,
      default: 1001,
    },
    currency: {
      type: String,
      default: "USD",
      trim: true,
      maxlength: [10, "Currency code cannot exceed 10 characters"],
    },
    taxRate: {
      type: Number,
      default: 0,
      min: [0, "Tax rate cannot be negative"],
      max: [100, "Tax rate cannot exceed 100%"],
    },
    paymentTerms: {
      type: Number,
      default: 30,
      min: [0, "Payment term must be positive"],
    },

    // 🧩 Template Selection
    templateStyle: {
      type: String,
      default: "modern",
      enum: ["modern", "classic", "minimal", "elegant"],
    },
    primaryColor: {
      type: String,
      default: "#059669",
      match: [/^#([0-9A-Fa-f]{6})$/, "Invalid HEX color code"],
    },

    // 📊 Additional Info
    industry: {
      type: String,
      trim: true,
      maxlength: [100, "Industry name cannot exceed 100 characters"],
    },
    companySize: {
      type: String,
      trim: true,
      enum: ["1-10", "11-50", "51-200", "201-500", "501+"],
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt fields
  }
);

const Company = mongoose.model("Company", CompanySchema);
export default Company;
