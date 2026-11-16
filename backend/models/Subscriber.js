import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      maxlength: 254,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Subscriber = mongoose.model("Subscriber", subscriberSchema);

export default Subscriber;