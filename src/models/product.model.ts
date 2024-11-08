import { Document, Schema, Types, model } from "mongoose";

interface IProduct extends Document {
  name: string;
  imageUrl: string;
  price: number;
  description: string;
  salesCount: number;
  category: Types.ObjectId;
}

const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    salesCount: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
  },
  {
    versionKey: false,
    timestamps: { updatedAt: false },
    toObject: {
      transform(document, returnValue) {
        delete returnValue._id;

        return {
          id: document.id,
          ...returnValue,
        };
      },
    },
  },
);

export default model<IProduct>("Product", productSchema);
