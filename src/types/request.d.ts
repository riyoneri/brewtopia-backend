import { IAdmin } from "../models/admin.model";
import { IUser } from "../models/user.model";

declare global {
  namespace Express {
    export interface Request {
      user?: IUser;
      admin?: IAdmin;
      auth?: { id: string; role: string };
    }
  }
}
