// Generate JWT_PRIVATE_KEY and JWKS for Convex Auth
// Usage: node generateKeys.mjs

import { exportJWK, exportPKCS8, generateKeyPair } from "jose";

const keys = await generateKeyPair("RS256", { extractable: true });
const privateKey = await exportPKCS8(keys.privateKey);
const publicKey = await exportJWK(keys.publicKey);
const jwks = JSON.stringify({ keys: [{ use: "sig", ...publicKey }] });

console.log("=== COPY THESE INTO YOUR CONVEX DASHBOARD ===");
console.log("");
console.log("Variable 1 - JWT_PRIVATE_KEY:");
console.log(`JWT_PRIVATE_KEY="${privateKey.trimEnd().replace(/\n/g, " ")}"`);
console.log("");
console.log("Variable 2 - JWKS:");
console.log(`JWKS=${jwks}`);
console.log("");
console.log("=== END ===");
