import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  username: { type: String, required: true },
  firstName: String,
  lastName: String,
  photo: String,
  creditBalance: { type: Number, default: 0 },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
