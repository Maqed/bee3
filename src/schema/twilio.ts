import { z } from "zod";

export const sendPhoneNumberOTP = z.object({
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "phone-number.input-phone-number.invalid-number"),
});

export const checkPhoneNumberOTP = z.object({
  code: z.string().regex(/^\d{6}$/, "phone-number.OTP.code"),
  phoneNumber: z
    .string()
    .regex(/^\d{10}$/, "phone-number.input-phone-number.invalid-number"),
});
