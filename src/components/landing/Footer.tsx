import { Sparkles } from "lucide-react";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="bg-background border-t py-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-joy flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold font-[family-name:var(--font-outfit)]">
                            Compound<span className="text-gradient">Joy</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <a href="#how-it-works" className="hover:text-foreground transition-colors">
                            How It Works
                        </a>
                        <a href="#features" className="hover:text-foreground transition-colors">
                            Features
                        </a>
                        <a href="#calculator" className="hover:text-foreground transition-colors">
                            Calculator
                        </a>
                        <Link href="/sign-up" className="hover:text-foreground transition-colors">
                            Sign Up
                        </Link>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} CompoundJoy. Made with 💚
                    </p>
                </div>
            </div>
        </footer>
    );
}
