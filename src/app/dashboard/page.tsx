"use client";

import { useState, useEffect } from "react";
import { useConvexAuth, useQuery, useMutation } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Sparkles,
    LogOut,
    Plus,
    DollarSign,
    Target,
    TrendingUp,
    Trophy,
    Loader2,
    Wallet,
    ArrowRight,
} from "lucide-react";
import Link from "next/link";

// Goal emoji picker options
const GOAL_ICONS = [
    "📱", "✈️", "🎵", "🍽️", "💍", "🏠", "🎮", "👟",
    "📸", "🎓", "🚗", "💻", "🏖️", "🎉", "🎯", "💎",
];

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function DashboardSkeleton() {
    return (
        <div className="min-h-screen bg-muted/30">
            <div className="container mx-auto px-4 py-8">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-muted rounded-lg w-48" />
                    <div className="grid md:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-28 bg-muted rounded-xl" />
                        ))}
                    </div>
                    <div className="h-64 bg-muted rounded-xl" />
                </div>
            </div>
        </div>
    );
}

function CreateGoalDialog({ onClose }: { onClose: () => void }) {
    const createGoal = useMutation(api.goals.createGoal);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [targetAmount, setTargetAmount] = useState("");
    const [icon, setIcon] = useState("🎯");
    const [rate, setRate] = useState("7");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name.trim() || !targetAmount) {
            setError("Please fill in the goal name and target amount.");
            return;
        }

        const amount = parseFloat(targetAmount);
        if (isNaN(amount) || amount <= 0) {
            setError("Please enter a valid target amount.");
            return;
        }

        setIsLoading(true);
        try {
            await createGoal({
                name: name.trim(),
                description: description.trim() || undefined,
                targetAmount: amount,
                icon,
                annualReturnRate: parseFloat(rate) / 100,
            });
            onClose();
        } catch (err: any) {
            setError(err?.message || "Failed to create goal.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Icon picker */}
            <div>
                <Label className="mb-2 block">Pick an icon</Label>
                <div className="flex flex-wrap gap-2">
                    {GOAL_ICONS.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => setIcon(emoji)}
                            className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all ${icon === emoji
                                ? "bg-primary/10 ring-2 ring-primary scale-110"
                                : "bg-muted hover:bg-muted/80"
                                }`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="goal-name">What are you saving for? *</Label>
                <Input
                    id="goal-name"
                    placeholder="e.g. New iPhone 16, Trip to Japan, Concert tickets"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="goal-description">Description (optional)</Label>
                <Input
                    id="goal-description"
                    placeholder="Why is this exciting to you?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            {/* Target Amount */}
            <div className="space-y-2">
                <Label htmlFor="goal-amount">Target Amount *</Label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        id="goal-amount"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="1200"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(e.target.value)}
                        disabled={isLoading}
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Annual Return Rate */}
            <div className="space-y-2">
                <Label htmlFor="goal-rate">Expected Annual Return (%)</Label>
                <Input
                    id="goal-rate"
                    type="number"
                    min="0"
                    max="30"
                    step="0.5"
                    placeholder="7"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                    Average S&P 500 return is ~10%. Use 7% for conservative estimates.
                </p>
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                    {error}
                </div>
            )}

            <Button type="submit" variant="joy" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Creating...
                    </>
                ) : (
                    <>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Goal
                    </>
                )}
            </Button>
        </form>
    );
}

function AddMoneyDialog({
    goalId,
    goalName,
    onClose,
}: {
    goalId: any;
    goalName: string;
    onClose: () => void;
}) {
    const addContribution = useMutation(api.goals.addContribution);
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const quickAmounts = [5, 10, 20, 50, 100];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        setIsLoading(true);
        try {
            await addContribution({
                goalId,
                amount: numAmount,
                note: note.trim() || undefined,
            });
            onClose();
        } catch (err: any) {
            setError(err?.message || "Failed to add money.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
                Adding to: <span className="font-semibold text-foreground">{goalName}</span>
            </p>

            {/* Quick amounts */}
            <div>
                <Label className="mb-2 block">Quick add</Label>
                <div className="flex flex-wrap gap-2">
                    {quickAmounts.map((qa) => (
                        <button
                            key={qa}
                            type="button"
                            onClick={() => setAmount(qa.toString())}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${amount === qa.toString()
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted hover:bg-muted/80"
                                }`}
                        >
                            ${qa}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom amount */}
            <div className="space-y-2">
                <Label htmlFor="contribution-amount">Amount *</Label>
                <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        id="contribution-amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        placeholder="25.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        disabled={isLoading}
                        className="pl-8"
                    />
                </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
                <Label htmlFor="contribution-note">Note (optional)</Label>
                <Input
                    id="contribution-note"
                    placeholder="e.g. Weekly savings, Birthday money"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    disabled={isLoading}
                />
            </div>

            {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                    {error}
                </div>
            )}

            <Button type="submit" variant="joy" className="w-full" disabled={isLoading}>
                {isLoading ? (
                    <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                    </>
                ) : (
                    <>
                        <DollarSign className="w-4 h-4 mr-2" />
                        Add Money
                    </>
                )}
            </Button>
        </form>
    );
}

export default function DashboardPage() {
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const { signOut } = useAuthActions();
    const router = useRouter();
    const [isCreateGoalOpen, setIsCreateGoalOpen] = useState(false);
    const [addMoneyGoal, setAddMoneyGoal] = useState<{
        id: any;
        name: string;
    } | null>(null);

    const goals = useQuery(api.goals.getGoals);
    const stats = useQuery(api.goals.getUserStats);

    // Redirect if not authenticated
    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.push("/sign-in");
        }
    }, [isAuthLoading, isAuthenticated, router]);

    if (isAuthLoading || !isAuthenticated) {
        return <DashboardSkeleton />;
    }

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-muted/30">
            {/* Header */}
            <header className="bg-background border-b sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-joy flex items-center justify-center shadow-md">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-lg font-bold font-[family-name:var(--font-outfit)]">
                            Compound<span className="text-gradient">Joy</span>
                        </span>
                    </Link>

                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2">
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold font-[family-name:var(--font-outfit)] mb-2">
                        Welcome back! 🌟
                    </h1>
                    <p className="text-muted-foreground">
                        Here&apos;s how your savings are growing.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="border-0 shadow-sm hover-lift">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-joy-100 dark:bg-joy-900/30 flex items-center justify-center">
                                    <Wallet className="w-5 h-5 text-joy-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Total Saved</p>
                                    <p className="text-xl font-bold">
                                        {stats ? formatCurrency(stats.totalSaved) : "—"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm hover-lift">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-coral-100 dark:bg-coral-900/30 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-coral-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Active Goals</p>
                                    <p className="text-xl font-bold">
                                        {stats ? stats.totalGoals : "—"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm hover-lift">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-teal-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Completed</p>
                                    <p className="text-xl font-bold">
                                        {stats ? stats.completedGoals : "—"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-sm hover-lift">
                        <CardContent className="p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-joy-100 dark:bg-joy-900/30 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-joy-600" />
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground font-medium">Contributions</p>
                                    <p className="text-xl font-bold">
                                        {stats ? stats.totalContributions : "—"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Goals Section */}
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold font-[family-name:var(--font-outfit)]">
                        Your Goals
                    </h2>
                    <Dialog open={isCreateGoalOpen} onOpenChange={setIsCreateGoalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="joy" size="sm" className="gap-2">
                                <Plus className="w-4 h-4" />
                                New Goal
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className="font-[family-name:var(--font-outfit)]">
                                    Create a New Goal 🎯
                                </DialogTitle>
                                <DialogDescription>
                                    What exciting thing are you saving for?
                                </DialogDescription>
                            </DialogHeader>
                            <CreateGoalDialog onClose={() => setIsCreateGoalOpen(false)} />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Goals List */}
                {goals === undefined ? (
                    <div className="grid md:grid-cols-2 gap-4">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-48 bg-muted rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : goals.length === 0 ? (
                    <Card className="border-dashed border-2 shadow-none">
                        <CardContent className="py-16 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-4">
                                <Target className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No goals yet!</h3>
                            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                                Create your first savings goal and start your journey toward the things you love.
                            </p>
                            <Button
                                variant="joy"
                                onClick={() => setIsCreateGoalOpen(true)}
                                className="gap-2"
                            >
                                <Plus className="w-4 h-4" />
                                Create Your First Goal
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                        {goals.map((goal: any) => {
                            const progress = Math.min(
                                (goal.currentAmount / goal.targetAmount) * 100,
                                100
                            );
                            const isComplete = goal.currentAmount >= goal.targetAmount;

                            return (
                                <Card
                                    key={goal._id}
                                    className={`border-0 shadow-sm hover-lift transition-all ${isComplete ? "ring-2 ring-joy-400 bg-joy-50/50 dark:bg-joy-950/20" : ""
                                        }`}
                                >
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-3xl">{goal.icon || "🎯"}</span>
                                                <div>
                                                    <CardTitle className="text-lg">
                                                        {goal.name}
                                                        {isComplete && " 🎉"}
                                                    </CardTitle>
                                                    {goal.description && (
                                                        <CardDescription className="mt-1">
                                                            {goal.description}
                                                        </CardDescription>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Progress */}
                                        <div className="mb-4">
                                            <div className="flex justify-between text-sm mb-2">
                                                <span className="font-semibold">
                                                    {formatCurrency(goal.currentAmount)}
                                                </span>
                                                <span className="text-muted-foreground">
                                                    of {formatCurrency(goal.targetAmount)}
                                                </span>
                                            </div>
                                            <Progress
                                                value={progress}
                                                className="h-3"
                                                indicatorClassName={
                                                    isComplete
                                                        ? "bg-gradient-to-r from-joy-400 to-teal-400"
                                                        : undefined
                                                }
                                            />
                                            <div className="flex justify-between mt-1">
                                                <span className="text-xs text-muted-foreground">
                                                    {progress.toFixed(1)}% complete
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {(goal.annualReturnRate * 100).toFixed(0)}% annual return
                                                </span>
                                            </div>
                                        </div>

                                        {/* Add money button */}
                                        {!isComplete && (
                                            <Dialog
                                                open={addMoneyGoal?.id === goal._id}
                                                onOpenChange={(open: boolean) => {
                                                    if (!open) setAddMoneyGoal(null);
                                                }}
                                            >
                                                <DialogTrigger asChild>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full gap-2"
                                                        onClick={() =>
                                                            setAddMoneyGoal({ id: goal._id, name: goal.name })
                                                        }
                                                    >
                                                        <DollarSign className="w-4 h-4" />
                                                        Add Money
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle className="font-[family-name:var(--font-outfit)]">
                                                            Add Money 💰
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            Every contribution brings you closer to your goal!
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    {addMoneyGoal && (
                                                        <AddMoneyDialog
                                                            goalId={addMoneyGoal.id}
                                                            goalName={addMoneyGoal.name}
                                                            onClose={() => setAddMoneyGoal(null)}
                                                        />
                                                    )}
                                                </DialogContent>
                                            </Dialog>
                                        )}

                                        {isComplete && (
                                            <div className="text-center p-3 rounded-lg bg-joy-100 dark:bg-joy-900/30">
                                                <p className="text-sm font-semibold text-joy-700 dark:text-joy-400">
                                                    🎉 Goal achieved! Enjoy your reward!
                                                </p>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}

                {/* Motivational footer */}
                <div className="mt-12 text-center">
                    <p className="text-sm text-muted-foreground">
                        Every dollar you save today grows into something amazing tomorrow. Keep going! 🌱
                    </p>
                </div>
            </main>
        </div>
    );
}
