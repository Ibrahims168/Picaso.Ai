import { Schema, model } from "mongoose";

const userSchema = new Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  photo: { type: String },
  creditBalance: { type: Number, default: 0 },
});

const User = model("User", userSchema);

export default User;
