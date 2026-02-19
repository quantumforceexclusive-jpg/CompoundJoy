import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const outfit = Outfit({
    subsets: ["latin"],
    variable: "--font-outfit",
    display: "swap",
});

export const metadata: Metadata = {
    title: "CompoundJoy — Grow Small Savings Into Big Moments",
    description:
        "Turn $10–50/week into dream vacations, new gadgets, concerts & life upgrades through the magic of compound interest. Start saving for joy today!",
    keywords: [
        "compound interest",
        "savings goals",
        "saving money",
        "financial goals",
        "vacation savings",
        "goal tracker",
    ],
    openGraph: {
        title: "CompoundJoy — Grow Small Savings Into Big Moments",
        description:
            "Turn $10–50/week into dream vacations, new gadgets, concerts & life upgrades through the magic of compound interest.",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
            <body className="antialiased min-h-screen">
                <ConvexClientProvider>
                    {children}
                </ConvexClientProvider>
            </body>
        </html>
    );
}
