import { Document, Schema, model } from "mongoose";

export interface IPromotion extends Document {
  name: string;
  price: number;
  startDate: string;
  endDate: string;
}

const promotionSchema = new Schema<IPromotion>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
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

export default model<IPromotion>("Promotion", promotionSchema);
