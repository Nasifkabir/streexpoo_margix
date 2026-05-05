import mongoose, { Schema, Document } from "mongoose";

export interface IStoreSettings extends Document {
  storeName: string;
  logoUrl?: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  footerText: string;
  facebookUrl?: string;
  instagramUrl?: string;
  currencySymbol: string;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSettingsSchema: Schema = new Schema(
  {
    storeName: {
      type: String,
      default: "Margix Fashion",
    },
    logoUrl: {
      type: String,
      default: "",
    },
    contactEmail: {
      type: String,
      default: "support@margix.com",
    },
    contactPhone: {
      type: String,
      default: "+880 1234 567 890",
    },
    address: {
      type: String,
      default: "123 Fashion Street, Margix City",
    },
    footerText: {
      type: String,
      default: "© 2025 Margix Fashion. All rights reserved.",
    },
    facebookUrl: {
      type: String,
      default: "https://facebook.com",
    },
    instagramUrl: {
      type: String,
      default: "https://instagram.com",
    },
    currencySymbol: {
      type: String,
      default: "৳",
    },
  },
  { timestamps: true }
);

// We only ever need one settings document, so we can ensure it acts as a singleton if needed
export default mongoose.models.StoreSettings ||
  mongoose.model<IStoreSettings>("StoreSettings", StoreSettingsSchema);
