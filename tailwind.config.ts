import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
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
                joy: {
                    50: "#effbf5",
                    100: "#d8f5e5",
                    200: "#b4eacf",
                    300: "#82d9b2",
                    400: "#4ec28f",
                    500: "#2ba876",
                    600: "#1d8a60",
                    700: "#186e4e",
                    800: "#165840",
                    900: "#134836",
                    950: "#09281e",
                },
                coral: {
                    50: "#fff4ed",
                    100: "#ffe6d4",
                    200: "#ffc9a9",
                    300: "#ffa372",
                    400: "#ff7439",
                    500: "#fe4f12",
                    600: "#ef3508",
                    700: "#c62409",
                    800: "#9d1f10",
                    900: "#7e1c10",
                    950: "#440b06",
                },
                teal: {
                    50: "#effefb",
                    100: "#c7fff5",
                    200: "#90ffeb",
                    300: "#51f7df",
                    400: "#1de4cd",
                    500: "#04c8b4",
                    600: "#00a194",
                    700: "#058078",
                    800: "#0a6561",
                    900: "#0d5450",
                    950: "#003332",
                },
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
                "float": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "grow": {
                    "0%": { transform: "scale(0.95)", opacity: "0" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                "shimmer": {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                "count-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "float": "float 3s ease-in-out infinite",
                "grow": "grow 0.5s ease-out",
                "shimmer": "shimmer 2s linear infinite",
                "count-up": "count-up 0.6s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};

export default config;
