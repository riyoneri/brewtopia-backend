import { Document, Schema, model } from "mongoose";

export interface ICategory extends Document {
  name: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
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

export default model<ICategory>("Category", categorySchema);
