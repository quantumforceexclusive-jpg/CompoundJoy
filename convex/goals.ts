import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { auth } from "./auth";

/**
 * Goals: CRUD operations for savings goals
 */

// Get all goals for the authenticated user
export const getGoals = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        const goals = await ctx.db
            .query("goals")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        return goals;
    },
});

// Get a single goal
export const getGoal = query({
    args: { goalId: v.id("goals") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;

        const goal = await ctx.db.get(args.goalId);
        if (!goal || goal.userId !== userId) return null;

        return goal;
    },
});

// Create a new goal
export const createGoal = mutation({
    args: {
        name: v.string(),
        description: v.optional(v.string()),
        targetAmount: v.number(),
        icon: v.optional(v.string()),
        annualReturnRate: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        return await ctx.db.insert("goals", {
            userId,
            name: args.name,
            description: args.description,
            targetAmount: args.targetAmount,
            currentAmount: 0,
            icon: args.icon || "🎯",
            annualReturnRate: args.annualReturnRate ?? 0.07,
            createdAt: Date.now(),
        });
    },
});

// Delete a goal
export const deleteGoal = mutation({
    args: { goalId: v.id("goals") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const goal = await ctx.db.get(args.goalId);
        if (!goal || goal.userId !== userId) throw new Error("Goal not found");

        // Delete all contributions for this goal
        const contributions = await ctx.db
            .query("contributions")
            .withIndex("by_goal", (q) => q.eq("goalId", args.goalId))
            .collect();

        for (const contribution of contributions) {
            await ctx.db.delete(contribution._id);
        }

        await ctx.db.delete(args.goalId);
    },
});

// Add money to a goal
export const addContribution = mutation({
    args: {
        goalId: v.id("goals"),
        amount: v.number(),
        note: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) throw new Error("Not authenticated");

        const goal = await ctx.db.get(args.goalId);
        if (!goal || goal.userId !== userId) throw new Error("Goal not found");

        // Add contribution record
        await ctx.db.insert("contributions", {
            userId,
            goalId: args.goalId,
            amount: args.amount,
            note: args.note,
            createdAt: Date.now(),
        });

        // Update goal current amount
        await ctx.db.patch(args.goalId, {
            currentAmount: goal.currentAmount + args.amount,
        });
    },
});

// Get contributions for a goal
export const getContributions = query({
    args: { goalId: v.id("goals") },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return [];

        const contributions = await ctx.db
            .query("contributions")
            .withIndex("by_goal", (q) => q.eq("goalId", args.goalId))
            .collect();

        return contributions.filter((c) => c.userId === userId);
    },
});

// Get total saved across all goals
export const getTotalSaved = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return 0;

        const goals = await ctx.db
            .query("goals")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        return goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
    },
});

// Get user stats
export const getUserStats = query({
    args: {},
    handler: async (ctx) => {
        const userId = await auth.getUserId(ctx);
        if (!userId) return null;

        const goals = await ctx.db
            .query("goals")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const contributions = await ctx.db
            .query("contributions")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
        const totalGoals = goals.length;
        const completedGoals = goals.filter(
            (g) => g.currentAmount >= g.targetAmount
        ).length;
        const totalContributions = contributions.length;

        return {
            totalSaved,
            totalGoals,
            completedGoals,
            totalContributions,
        };
    },
});
