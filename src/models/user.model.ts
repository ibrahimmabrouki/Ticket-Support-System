import { truncate } from "fs";
import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  username:string;
  role: string;
  refreshToken?: string;
  
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, lowercase: true, minlength: 6 },
    phone: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    role: { type: String, enum: ["employee", "client"], default: "employee", required: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export default model<IUser>("users", userSchema);
