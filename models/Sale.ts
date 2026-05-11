import mongoose, { Schema, Document } from "mongoose";

export interface ISale extends Document {
  productId: mongoose.Types.ObjectId;
  variant?: {
    size: string;
    color: string;
  };
  quantitySold: number;
  sellingPrice: number;
  totalAmount: number;
  profitMargin: number;
  soldBy: mongoose.Types.ObjectId;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SaleSchema: Schema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variant: {
      size: { type: String, enum: ["S", "M", "L", "XL", "XXL"] },
    },
    quantitySold: {
      type: Number,
      required: true,
      min: 1,
    },
    sellingPrice: {
      type: Number, // Actual price sold for
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    profitMargin: {
      type: Number,
      required: true,
    },
    soldBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Sale || mongoose.model<ISale>("Sale", SaleSchema);
