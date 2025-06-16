import React, { ReactNode } from "react";
import { Head, Html, Tailwind } from "@react-email/components";

const emailTailwindConfig = {
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#0D0C0B",
        primary: "#E6C000",
        "primary-foreground": "#371F05",
        secondary: "#F5F5F0",
        "secondary-foreground": "#1A1814",
        muted: "#F4F4F1",
        "muted-foreground": "#736E67",
        accent: "#F5F5F0",
        "accent-foreground": "#1A1814",
        border: "#E6E4E1",
        destructive: "#D93C15",
        "destructive-foreground": "#FFFFFF",
        success: "#19C237",
        "success-foreground": "#092511",
        warning: "#DCB20F",
        "warning-foreground": "#352B04",
        info: "#1F76EB",
        "info-foreground": "#FFFFFF",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "0.3rem",
        sm: "0.1rem",
      },
    },
  },
};

function EmailBoilerplate({
  locale = "ar",
  children,
}: {
  locale?: string;
  children: ReactNode;
}) {
  const isRtl = locale === "ar";
  const dir = isRtl ? "rtl" : "ltr";

  return (
    <Html lang={locale} dir={dir}>
      <Tailwind config={emailTailwindConfig as any}>
        <Head />
        {children}
      </Tailwind>
    </Html>
  );
}

export default EmailBoilerplate;
