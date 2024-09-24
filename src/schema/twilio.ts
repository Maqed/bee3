import { z } from "zod";

export const sendPhoneNumberOTP = z.object({
  phoneNumber: z.string().regex(/^\d{10}$/, "errors.phoneNumber")
});

export const checkPhoneNumberOTP = z.object({
  code: z.string().regex(/^\d{6}$/, "errors.code"),
  phoneNumber: z.string().regex(/^\d{10}$/, "errors.phoneNumber")
});