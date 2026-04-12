import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/static-data/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    screens: {
      sm: "540px",
      md: "720px",
      lg: "960px",
      xl: "1140px",
      "2xl": "1320px",
    },
    fontFamily: {
      tajawal: ["MontserratArabic", "Tajawal", "sans-serif"],
      inter: ["Inter", "sans-serif"],
    },
    extend: {
      animation: {
        bounce: "bounce 1.2s infinite ease-in-out",
      },
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "scale(0.8) translateY(0px)", opacity: "0.4", },
          "50%": { transform: "scale(1) translateY(-3px)", opacity: "1" },
        },
      },
      colors: {
        current: "currentColor",
        transparent: "transparent",
        white: "#FFFFFF",
        black: "#090E34",
        dark: "#1D2144",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        yellow: "#FBB040",
        "body-color": "#959CB1",
        stroke: "#D7DFFF",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      boxShadow: {
        signUp: "0px 5px 10px rgba(4, 10, 34, 0.2)",
        image: "0px 3px 30px rgba(9, 14, 52, 0.1)",
        pricing: "0px 34px 68px rgba(0, 0, 0, 0.06)",
        testimonial: "0px 8px 40px -10px rgba(9, 14, 52, 0.1)",
        service: "0px 11px 41px -11px rgba(9, 14, 52, 0.1)",
        blog: "0px 40px 150px -35px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require("tailwindcss-animate")],
};
export default config;
