import { config } from "dotenv";
import { Resend } from "resend";

config();

const resend = new Resend(process.env.RESEND_API_KEY);

export default resend;
