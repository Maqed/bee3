const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        sm: "0 1px 2px 0 hsl(var(--shadow) / 0.05)",
        DEFAULT:
          "0 1px 3px 0 hsl(var(--shadow) / 0.1), 0 1px 2px -1px hsl(var(--shadow) / 0.1)",
        md: "0 4px 6px -1px hsl(var(--shadow) / 0.1), 0 2px 4px -2px hsl(var(--shadow) / 0.1)",
        lg: "0 10px 15px -3px hsl(var(--shadow) / 0.1), 0 4px 6px -4px hsl(var(--shadow) / 0.1)",
        xl: "0 20px 25px -5px hsl(var(--shadow) / 0.1), 0 8px 10px -6px hsl(var(--shadow) / 0.1)",
        "2xl": "0 25px 50px -12px hsl(var(--shadow) / 0.25)",
        inner: "inset 0 2px 4px 0 hsl(var(--shadow) / 0.05)",
        none: "none",
      },
      dropShadow: {
        sm: "0 1px 1px hsl(var(--shadow) / 0.05)",
        DEFAULT: [
          "0 1px 2px hsl(var(--shadow) / 0.1)",
          "0 1px 1px hsl(var(--shadow) / 0.06)",
        ],
        md: [
          "0 4px 3px hsl(var(--shadow) / 0.07)",
          "0 2px 2px hsl(var(--shadow) / 0.06)",
        ],
        lg: [
          "0 10px 8px hsl(var(--shadow) / 0.04)",
          "0 4px 3px hsl(var(--shadow) / 0.1)",
        ],
        xl: [
          "0 20px 13px hsl(var(--shadow) / 0.03)",
          "0 8px 5px hsl(var(--shadow) / 0.08)",
        ],
        "2xl": "0 25px 25px hsl(var(--shadow) / 0.15)",
        none: "0 0 #0000",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
