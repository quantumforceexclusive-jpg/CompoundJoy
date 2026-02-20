import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

/**
 * User Profiles: Manage user display info, profile images, and roles
 */

// Get the current user's profile (auto-create if doesn't exist)
export const getMyProfile = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;

        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        return profile;
    },
});

// Create or update the current user's profile
export const upsertProfile = mutation({
    args: {
        displayName: v.string(),
        profileImageUrl: v.optional(v.string()),
        status: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const existing = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                displayName: args.displayName,
                profileImageUrl: args.profileImageUrl,
                status: args.status,
            });
            return existing._id;
        } else {
            return await ctx.db.insert("userProfiles", {
                userId,
                displayName: args.displayName,
                profileImageUrl: args.profileImageUrl,
                role: "user",
                status: args.status,
                createdAt: Date.now(),
            });
        }
    },
});

// Check if current user is admin
export const isAdmin = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return false;

        const profile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        return profile?.role === "admin";
    },
});

// ============= ADMIN ONLY =============

// Get all user profiles (admin only)
export const getAllProfiles = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        const adminProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!adminProfile || adminProfile.role !== "admin") return [];

        const profiles = await ctx.db.query("userProfiles").collect();
        return profiles;
    },
});

// Set a user's role (admin only)
export const setUserRole = mutation({
    args: {
        profileId: v.id("userProfiles"),
        role: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const adminProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!adminProfile || adminProfile.role !== "admin") {
            throw new Error("Unauthorized: Admin access required");
        }

        await ctx.db.patch(args.profileId, { role: args.role });
    },
});

// Delete a user profile (admin only)
export const deleteUserProfile = mutation({
    args: {
        profileId: v.id("userProfiles"),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const adminProfile = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (!adminProfile || adminProfile.role !== "admin") {
            throw new Error("Unauthorized: Admin access required");
        }

        const targetProfile = await ctx.db.get(args.profileId);
        if (!targetProfile) throw new Error("Profile not found");

        // Don't allow admin to delete themselves
        if (targetProfile.userId === userId) {
            throw new Error("Cannot delete your own admin profile");
        }

        // Delete user's goals and contributions
        const goals = await ctx.db
            .query("goals")
            .withIndex("by_user", (q) => q.eq("userId", targetProfile.userId))
            .collect();

        for (const goal of goals) {
            const contributions = await ctx.db
                .query("contributions")
                .withIndex("by_goal", (q) => q.eq("goalId", goal._id))
                .collect();
            for (const c of contributions) {
                await ctx.db.delete(c._id);
            }
            await ctx.db.delete(goal._id);
        }

        // Delete the profile
        await ctx.db.delete(args.profileId);
    },
});

// Seed the first admin (call once with your user)
export const seedAdmin = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        // Check if any admin exists
        const allProfiles = await ctx.db.query("userProfiles").collect();
        const hasAdmin = allProfiles.some((p) => p.role === "admin");

        if (hasAdmin) {
            throw new Error("Admin already exists. Use setUserRole to add more.");
        }

        const existing = await ctx.db
            .query("userProfiles")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, { role: "admin" });
        } else {
            await ctx.db.insert("userProfiles", {
                userId,
                displayName: "Admin",
                role: "admin",
                createdAt: Date.now(),
            });
        }
    },
});
