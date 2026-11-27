import { z } from "zod";

const email = z
  .string()
  .min(1, "emailRequired")
  .max(100, "emailMax")
  .email("emailInvalid");

const password = z
  .string()
  .min(1, "passwordRequired")
  .min(8, "passwordMin")
  .max(64, "passwordMax")
  .regex(/[a-z]/, "passwordLower")
  .regex(/[A-Z]/, "passwordUpper")
  .regex(/[0-9]/, "passwordDigit")
  .regex(/[^a-zA-Z0-9]/, "passwordSymbol")
  .regex(/^\S+$/, "passwordSpace");

export const loginSchema = z.object({
  identifier: z.string().min(1, "identifierRequired").max(100, "emailMax"),
  password: z.string().min(1, "passwordRequired"),
  remember: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "firstNameRequired").min(2, "firstNameMin").max(50, "nameMax"),
    lastName: z.string().min(1, "lastNameRequired").min(2, "lastNameMin").max(50, "nameMax"),
    email,
    password,
    confirmPassword: z.string().min(1, "confirmRequired"),
    acceptedTerms: z.boolean().refine((v) => v, { message: "termsRequired" }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    path: ["confirmPassword"],
    message: "passwordMismatch",
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

export const PASSWORD_RULES = [
  { key: "ruleLength", test: (v: string) => v.length >= 8 },
  { key: "ruleLower", test: (v: string) => /[a-z]/.test(v) },
  { key: "ruleUpper", test: (v: string) => /[A-Z]/.test(v) },
  { key: "ruleDigit", test: (v: string) => /[0-9]/.test(v) },
  { key: "ruleSymbol", test: (v: string) => /[^a-zA-Z0-9]/.test(v) },
] as const;