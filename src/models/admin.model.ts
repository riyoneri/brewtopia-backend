import {
  Document,
  HydratedArraySubdocument,
  HydratedDocument,
  Model,
  Schema,
  model,
} from "mongoose";

interface Notification {
  id: string;
  message: string;
  link: string;
}

export interface IAdmin extends Document {
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
  notifications: Array<Notification>;
}

type AdminHydratedDocument = HydratedDocument<
  IAdmin,
  { notifications: HydratedArraySubdocument<Notification> }
>;

type EmptyObject = Record<PropertyKey, never>;

type AdminModelType = Model<
  IAdmin,
  EmptyObject,
  EmptyObject,
  EmptyObject,
  AdminHydratedDocument
>;

const adminSchema = new Schema<IAdmin, AdminModelType>(
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
    notifications: {
      type: [
        {
          id: {
            type: String,
            required: true,
          },
          message: {
            type: String,
            required: true,
          },
          link: {
            type: String,
            required: true,
          },
        },
      ],
      required: true,
      _id: false,
    },
  },
  {
    versionKey: false,
    timestamps: {
      updatedAt: false,
    },
    toObject: {
      transform(document, returnValue) {
        delete returnValue.password;
        delete returnValue._id;
        delete returnValue.authTokens;
        return {
          id: document.id,
          ...returnValue,
          email: returnValue.email.value,
          imageUrl: returnValue.imageUrl
            ? `${process.env.AWS_DISTRIBUTION_DOMAIN_NAME}/${returnValue.imageUrl}`
            : undefined,
        };
      },
    },
  },
);

export default model<IAdmin>("Admin", adminSchema);
