import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "STAFF";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: false, // In case we add OAuth later
      select: false, // Don't return password by default
    },
    role: {
      type: String,
      enum: ["ADMIN", "STAFF"],
      default: "STAFF",
    },
  },
  { timestamps: true }
);

// Prevent re-compilation of model in development
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
