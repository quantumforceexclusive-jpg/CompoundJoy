import { convexAuth } from "@convex-dev/auth/server";
import { Password } from "@convex-dev/auth/providers/Password";

/**
 * Convex Auth Configuration
 * 
 * Setup:
 * 1. Run `npx @convex-dev/auth` to initialize auth in your Convex project
 * 2. Set CONVEX_AUTH_PRIVATE_KEY and CONVEX_AUTH_PUBLIC_KEY in your Convex dashboard
 * 3. The Password provider enables email + password sign-up/sign-in
 */
export const { auth, signIn, signOut, store } = convexAuth({
    providers: [Password],
});
