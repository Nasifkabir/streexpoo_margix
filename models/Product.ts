import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  category: string;
  stockQuantity: number;
  purchaseRate: number;
  sellingPrice: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
    },
    stockQuantity: {
      type: Number,
      required: [true, "Please provide the stock quantity"],
      min: 0,
      default: 0,
    },
    purchaseRate: {
      type: Number,
      required: [true, "Please provide the purchase rate (cost)"],
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: [true, "Please provide the selling price"],
      min: 0,
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model<IProduct>("Product", ProductSchema);
