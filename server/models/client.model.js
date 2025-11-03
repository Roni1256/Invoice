import mongoose from "mongoose";

const clientSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    invoiceId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Invoice",
      },
    ],
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required:true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    taxId: {
      type: String,
      trim: true,
      default:"-"
    },
    notes: {
      type: String,
      trim: true,
    },
    totalAmount:{
        type:Number,
        default:0
    },
    outstanding:{
        type:Number,
        default:0
    }
  },
  { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema);
export default Client;
