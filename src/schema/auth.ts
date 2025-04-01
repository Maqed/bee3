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
const passwordStrength = (
  { password }: { password: string },
  checkPassComplexity: z.RefinementCtx,
) => {
  const containsUppercase = (ch: string) => /[A-Z]/.test(ch);
  const containsLowercase = (ch: string) => /[a-z]/.test(ch);
  const containsSpecialChar = (ch: string) =>
    /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/.test(ch);
  let countOfUpperCase = 0,
    countOfLowerCase = 0,
    countOfNumbers = 0,
    countOfSpecialChar = 0;

  for (let i = 0; i < password.length; i++) {
    let ch = password.charAt(i);
    if (!isNaN(+ch)) countOfNumbers++;
    else if (containsUppercase(ch)) countOfUpperCase++;
    else if (containsLowercase(ch)) countOfLowerCase++;
    else if (containsSpecialChar(ch)) countOfSpecialChar++;
  }

  let errObj = {
    upperCase: { pass: true, message: "add upper case." },
    lowerCase: { pass: true, message: "add lower case." },
    specialCh: { pass: true, message: "add special ch." },
    totalNumber: { pass: true, message: "add number." },
  };

  if (countOfLowerCase < 1) {
    errObj = { ...errObj, lowerCase: { ...errObj.lowerCase, pass: false } };
  }
  if (countOfNumbers < 1) {
    errObj = {
      ...errObj,
      totalNumber: { ...errObj.totalNumber, pass: false },
    };
  }
  if (countOfUpperCase < 1) {
    errObj = { ...errObj, upperCase: { ...errObj.upperCase, pass: false } };
  }
  if (countOfSpecialChar < 1) {
    errObj = { ...errObj, specialCh: { ...errObj.specialCh, pass: false } };
  }

  if (
    countOfLowerCase < 1 ||
    countOfUpperCase < 1 ||
    countOfSpecialChar < 1 ||
    countOfNumbers < 1
  ) {
    checkPassComplexity.addIssue({
      code: "custom",
      path: ["password"],
      message: JSON.stringify(errObj),
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
  .superRefine(passwordsMatch)
  .superRefine(passwordStrength);
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
  .superRefine(passwordStrength)
  .superRefine(passwordsMatch);
