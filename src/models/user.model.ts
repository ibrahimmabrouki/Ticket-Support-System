import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: {
      type: String,
      required: true,
      lowercase: true,
      minlength: 6,
    },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

export default model<IUser>("users", userSchema);
