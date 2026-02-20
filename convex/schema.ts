import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

/**
 * CompoundJoy Database Schema
 * 
 * Uses Convex Auth tables for authentication, plus custom tables for:
 * - goals: Savings goals with target amounts and descriptions
 * - contributions: Individual money additions toward goals
 */
export default defineSchema({
    ...authTables,

    goals: defineTable({
        userId: v.string(),
        name: v.string(),
        description: v.optional(v.string()),
        targetAmount: v.number(),
        currentAmount: v.number(),
        icon: v.optional(v.string()),
        annualReturnRate: v.number(), // e.g. 0.07 for 7%
        deadline: v.number(), // timestamp in ms, max 12 months from creation
        createdAt: v.number(),
    }).index("by_user", ["userId"]),

    contributions: defineTable({
        userId: v.string(),
        goalId: v.id("goals"),
        amount: v.number(),
        note: v.optional(v.string()),
        createdAt: v.number(),
    })
        .index("by_user", ["userId"])
        .index("by_goal", ["goalId"]),
});
