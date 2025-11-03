import mongoose from "mongoose";

const inventoryItemSchema = new mongoose.Schema(
  {
    companyId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    unit: {
      type: String,
      required: true,
      enum: ['pcs', 'kg', 'litre', 'box', 'set', 'unit','pack','can','bag','bottle'],
      default: 'pcs',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    minStock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    status: {
      type: String,
      enum: ['In Stock', 'Low Stock', 'Out of Stock'],
      default: 'In Stock',
    },
  },
  { timestamps: true }
);

// Automatically update status based on quantity and minStock
inventoryItemSchema.pre("save", function (next) {
  if (this.quantity <= 0) {
    this.status = "Out of Stock";
  } else if (this.quantity <= this.minStock) {
    this.status = "Low Stock";
  } else {
    this.status = "In Stock";
  }
  next();
});

const InventoryItem = mongoose.model("InventoryItem", inventoryItemSchema);

export default InventoryItem;
