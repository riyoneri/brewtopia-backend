import { config } from "dotenv";
import { Resend } from "resend";

import { environment } from "../config";

config();

const resend = new Resend(environment.resendApiKey);

export default resend;
