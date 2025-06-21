import { z } from "zod";

const emailSchema = {
  email: z.string().email({ message: "auth.invalid-email" }),
};

const passwordsMatch = (
  { confirmPassword, password }: { confirmPassword: string; password: string },
  ctx: z.RefinementCtx,
) => {
  if (confirmPassword !== password) {
    ctx.addIssue({
      code: "custom",
      message: "auth.passwords-not-matching",
      path: ["confirmPassword"],
    });
  }
};

const twoPasswordInputSchema = {
  password: z.string().min(8, { message: "auth.password-min-characters" }),
  confirmPassword: z.string(),
};

export const registerSchema = z
  .object({
    name: z.string().min(2, { message: "register.name-min-character" }),
    ...emailSchema,
    ...twoPasswordInputSchema,

    acceptTOSAndPrivacyPolicy: z.literal<boolean>(true, {
      errorMap: () => ({ message: "register.accept-tos-required" }),
    }),
  })
  .superRefine(passwordsMatch);

export const loginSchema = z.object({
  ...emailSchema,
  password: z.string().min(1, { message: "login.password-min-characters" }),
});

export const forgotPasswordSchema = z.object({
  ...emailSchema,
});

export const resetPasswordSchema = z
  .object({
    ...twoPasswordInputSchema,
  })
  .superRefine(passwordsMatch);
