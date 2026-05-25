import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "CUSTOMER";
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
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
      required: false,
      select: false,
    },
    resetPasswordToken: {
      type: String,
      select: false,
    },
    resetPasswordExpiry: {
      type: Date,
      select: false,
    },
    role: {
      type: String,
      enum: ["ADMIN", "CUSTOMER"],
      default: "CUSTOMER",
    },
  },
  { timestamps: true }
);

// Prevent re-compilation of model in development
export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
