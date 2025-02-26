import nodemailer from "nodemailer";
import { env } from "@/env";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: env.SMTP_AUTH_USER,
    pass: env.SMTP_AUTH_PASSWORD,
  },
});
