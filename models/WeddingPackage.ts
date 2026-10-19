import mongoose, { Document, Model, Schema } from "mongoose";

export interface IWeddingPackage extends Document {
  name: string;
  description: string;
  image: string;
  imagePublicId?: string;
  includedItems: string[];
  price: number;
  durationText: string;
  isFeatured: boolean;
  isActive: boolean;
  displayOrder: number;
  audience: "bride" | "groom" | "both";
  createdAt: Date;
  updatedAt: Date;
}

const WeddingPackageSchema = new Schema<IWeddingPackage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: "",
      trim: true,
    },
    imagePublicId: {
      type: String,
      default: "",
      trim: true,
    },
    includedItems: {
      type: [String],
      required: true,
      default: [],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    durationText: {
      type: String,
      required: true,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
    audience: {
      type: String,
      enum: ["bride", "groom", "both"],
      default: "both",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Avoid caching stale schema during Next.js hot module reloading in dev
if (
  process.env.NODE_ENV !== "production" &&
  mongoose.models &&
  mongoose.models.WeddingPackage
) {
  delete mongoose.models.WeddingPackage;
}

const WeddingPackage: Model<IWeddingPackage> =
  mongoose.models.WeddingPackage ||
  mongoose.model<IWeddingPackage>("WeddingPackage", WeddingPackageSchema);

export default WeddingPackage;
