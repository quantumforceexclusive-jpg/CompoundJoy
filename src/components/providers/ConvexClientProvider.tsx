"use client";

import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

/**
 * Convex Client Provider
 * 
 * Environment Setup:
 * 1. Create a Convex project at https://dashboard.convex.dev
 * 2. Add NEXT_PUBLIC_CONVEX_URL to your .env.local file
 *    - Find this in your Convex dashboard under "Settings"
 *    - Format: https://your-project-name.convex.cloud
 * 3. For Vercel deployment, add the same env var in Vercel project settings
 */

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

// During build time, the env var may not be set. 
// We create the client lazily to avoid build errors.
let convex: ConvexReactClient | null = null;

function getConvexClient() {
    if (!convex && convexUrl) {
        convex = new ConvexReactClient(convexUrl);
    }
    return convex;
}

export function ConvexClientProvider({ children }: { children: ReactNode }) {
    const client = getConvexClient();

    if (!client) {
        // During build or when CONVEX_URL is not set, render children without Convex
        return <>{children}</>;
    }

    return (
        <ConvexAuthProvider client={client}>
            {children}
        </ConvexAuthProvider>
    );
}
