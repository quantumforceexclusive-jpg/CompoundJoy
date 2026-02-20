// Module declarations for packages whose types don't resolve under
// moduleResolution: "bundler" in some IDE environments.

declare module "@radix-ui/react-slot" {
    import { ComponentPropsWithRef, ForwardRefExoticComponent, ReactNode } from "react";

    export interface SlotProps extends ComponentPropsWithRef<"span"> {
        children?: ReactNode;
    }

    export const Slot: ForwardRefExoticComponent<SlotProps>;
}

declare module "@convex-dev/auth/react" {
    import { ConvexReactClient } from "convex/react";
    import { ReactNode } from "react";

    export function ConvexAuthProvider(props: {
        client: ConvexReactClient;
        children: ReactNode;
    }): JSX.Element;

    export function useAuthActions(): {
        signIn: (
            provider: string,
            params?: Record<string, any>
        ) => Promise<{ signingIn: boolean }>;
        signOut: () => Promise<void>;
    };
}

declare module "lucide-react" {
    import { FC, SVGProps } from "react";

    type IconProps = SVGProps<SVGSVGElement> & {
        size?: number | string;
        color?: string;
        strokeWidth?: number | string;
        className?: string;
    };

    type Icon = FC<IconProps>;

    export const Sparkles: Icon;
    export const LogOut: Icon;
    export const Plus: Icon;
    export const DollarSign: Icon;
    export const Target: Icon;
    export const TrendingUp: Icon;
    export const Trophy: Icon;
    export const Loader2: Icon;
    export const Wallet: Icon;
    export const ArrowLeft: Icon;
    export const ArrowRight: Icon;
    export const ArrowUpRight: Icon;
    export const ChevronRight: Icon;
    export const Menu: Icon;
    export const X: Icon;
    export const Eye: Icon;
    export const EyeOff: Icon;
    export const Mail: Icon;
    export const Lock: Icon;
    export const User: Icon;
    export const Check: Icon;
    export const Star: Icon;
    export const Shield: Icon;
    export const BarChart3: Icon;
    export const Calculator: Icon;
    export const Heart: Icon;
    export const Zap: Icon;
    export const PiggyBank: Icon;
    export const Gift: Icon;
    export const Clock: Icon;
    export const Globe: Icon;
    export const Calendar: Icon;
    export const Percent: Icon;
    export const Smartphone: Icon;
    export const TrendingDown: Icon;
}

declare module "class-variance-authority" {
    export type VariantProps<T extends (...args: any) => any> = Omit<
        Parameters<T>[0],
        "class" | "className"
    >;

    export function cva(
        base?: string,
        config?: {
            variants?: Record<string, Record<string, string>>;
            defaultVariants?: Record<string, string>;
            compoundVariants?: Array<
                Record<string, string> & { class?: string; className?: string }
            >;
        }
    ): (props?: Record<string, any>) => string;
}
