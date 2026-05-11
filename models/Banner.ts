import mongoose, { Schema, Document } from "mongoose";

export interface IBanner extends Document {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  buttonText: string;
  bgColor: string;
  accentColor: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    buttonText: { type: String, default: "EXPLORE NOW" },
    bgColor: { type: String, default: "#0a192f" },
    accentColor: { type: String, default: "#3b82f6" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);
