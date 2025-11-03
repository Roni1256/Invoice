import mongoose, { Types } from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InventoryItem",
    },
    quantity: {
      type: Number,
      required: [true, "Item quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    amount: {
      type: Number,
      required: [true, "Item amount is required"],
      min: [0, "Amount cannot be negative"],
    },
  },
  { _id: false } // avoids creating _id for each item
);

const InvoiceSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: [true,"Client Id is required"],
    },
    clientName:{
      type: String,
      required: true,
      trim: true,
    },
    clientEmail:{
      type: String,
      required: true,
      trim: true,
    },
    invoiceNumber: {
      type: String,
      required: [true, "Invoice number is required"],
      unique: true,
      trim: true,
    },
    issueDate: {
      type: Date,
      required: [true, "Issue date is required"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    amount: {
      type: Number,
      required: [true, "Invoice amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    status: {
      type: String,
      enum: ["paid", "pending", "overdue", "draft"],
      default: "unpaid",
    },
    items: {
      type: [ItemSchema],
      validate: [
        (arr) => arr.length > 0,
        "Invoice must have at least one item",
      ],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    taxRate: {
      type: Number,
      default: 0,
      min: [0, "Tax rate cannot be negative"],
    },
    paymentTerms:{
      type:Number,
      default:"30"
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    discountType: {
      type: String,
      
    },
    shipping:{
      type:Number,
      default:0
    },
    terms:{
      type:String,
      default:""
    }
  },
  { timestamps: true }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);
export default Invoice;
