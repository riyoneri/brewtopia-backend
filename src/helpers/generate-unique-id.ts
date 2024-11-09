import { nanoid } from "nanoid";

export const getVerifyEmailUniqueId = () => nanoid(25);

export const getResetPasswordUniqueId = () => nanoid(30);

export const getProductImageUniqueId = () => nanoid(25);
