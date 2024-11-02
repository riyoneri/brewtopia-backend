import { IAdmin, IUser } from "../models";

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
      admin?: IAdmin;
      auth?: { id: string; role: string };
    }
  }
}
