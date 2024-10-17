import { Schema, model } from "mongoose";

export interface IUser {
  name: string;
  email: {
    value: string;
    verified: boolean;
  };
  password?: string;
  imageUrl?: string;
  authTokens: {
    emailVerification?: string;
    resetPassword?: {
      value: string;
      expirationDate: string;
    };
  };
  active: boolean;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: {
      type: {
        value: {
          type: String,
          required: true,
        },
        verified: {
          type: Boolean,
          required: true,
          default: false,
        },
      },
      required: true,
      _id: false,
    },
    password: String,
    imageUrl: String,
    active: { type: Boolean, required: true, default: true },
    authTokens: {
      type: {
        emailVerification: String,
        resetPassword: {
          type: {
            value: String,
            expirationDate: Date,
          },
          _id: false,
        },
      },
      _id: false,
    },
  },
  {
    versionKey: false,
    timestamps: {
      updatedAt: false,
    },
    toJSON: {
      transform(document, returnValue) {
        delete returnValue.password;
        delete returnValue._id;
        delete returnValue.authTokens;
        delete returnValue.active;

        return {
          id: document.id,
          ...returnValue,
          email: returnValue.email.value,
          imageUrl: returnValue?.imageUrl?.includes("https")
            ? returnValue?.imageUrl
            : returnValue.imageUrl
              ? `${process.env.AWS_DISTRIBUTION_DOMAIN_NAME}/${returnValue.imageUrl}`
              : undefined,
        };
      },
    },
  },
);

export default model<IUser>("User", userSchema);
