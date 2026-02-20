"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TrendingUp, DollarSign, Calendar, Percent } from "lucide-react";

function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export function CalculatorSection() {
    const [amount, setAmount] = useState(25);
    const [period, setPeriod] = useState<"weekly" | "monthly">("weekly");
    const [years, setYears] = useState(3);
    const [goalAmount, setGoalAmount] = useState(1000);
    const [isVisible, setIsVisible] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Reset amount when period changes to keep ranges sensible
    const handlePeriodChange = (newPeriod: "weekly" | "monthly") => {
        setPeriod(newPeriod);
        if (newPeriod === "monthly") {
            setAmount(amount * 4); // rough conversion
        } else {
            setAmount(Math.round(amount / 4));
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setIsVisible(true);
            },
            { threshold: 0.15 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const results = useMemo(() => {
        const weeks = years * 52;
        const periodsPerYear = period === "weekly" ? 52 : 12;
        const totalPeriods = years * periodsPerYear;
        const fixedRate = 7; // Default annual return for chart display
        const periodRate = fixedRate / 100 / periodsPerYear;

        let total = 0;
        const dataPoints: { week: number; value: number; deposited: number }[] = [];

        // For charting, we still want detailed points, but calculation follows period
        // We'll calculate week-by-week for the chart resolution
        let currentDeposit = 0;

        for (let w = 1; w <= weeks; w++) {
            // Add deposit if it's a deposit week/month
            const isDepositTime = period === "weekly" ? true : w % 4 === 0; // Simplified monthly appx

            // Continuous compounding approximation for the chart
            // But let's stick to discrete period logic roughly

            // Simpler approach: Calculate true compounding based on selected period
            // then interpolate for chart if needed. 
            // Actually, let's just use the period logic for the loop
        }

        // Re-write calculation loop for clarity
        total = 0;
        let deposited = 0;
        const points = [];

        for (let p = 1; p <= totalPeriods; p++) {
            total = (total + amount) * (1 + periodRate);
            deposited += amount;

            // Map period back to approximate week for X-axis consistent scaling
            const approximateWeek = period === "weekly" ? p : p * 4.33;

            if (p % (Math.max(1, Math.floor(totalPeriods / 20))) === 0 || p === totalPeriods) {
                points.push({
                    week: approximateWeek,
                    value: Math.round(total),
                    deposited: deposited,
                });
            }
        }

        const totalDeposited = deposited;
        const interestEarned = Math.round(total - totalDeposited);

        // Next deposit calculation: remaining / remaining periods
        const totalMonths = years * 12;
        const nextDepositMonthly = goalAmount / totalMonths;
        const nextDepositPeriod = period === "weekly" ? nextDepositMonthly / 4.33 : nextDepositMonthly;

        return { total: Math.round(total), totalDeposited, interestEarned, dataPoints: points, nextDepositPeriod, totalMonths };
    }, [amount, period, years, goalAmount]);

    // ... chart dimensions ...
    const chartWidth = 600;
    const chartHeight = 280;
    const padding = { top: 20, right: 20, bottom: 30, left: 60 };
    const plotWidth = chartWidth - padding.left - padding.right;
    const plotHeight = chartHeight - padding.top - padding.bottom;

    const maxValue = Math.max(...results.dataPoints.map((d) => d.value), 1);
    const maxDeposited = Math.max(...results.dataPoints.map((d) => d.deposited), 1);

    const getX = (index: number) =>
        padding.left + (index / (results.dataPoints.length - 1)) * plotWidth;
    const getY = (value: number) =>
        padding.top + plotHeight - (value / maxValue) * plotHeight;

    const compoundLine = results.dataPoints
        .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.value)}`)
        .join(" ");
    const depositLine = results.dataPoints
        .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.deposited)}`)
        .join(" ");
    const compoundArea =
        compoundLine +
        ` L ${getX(results.dataPoints.length - 1)} ${getY(0)} L ${getX(0)} ${getY(0)} Z`;

    // ... goals ...
    const goals = [
        { name: "🎉 Concert Tickets", cost: 200 },
        { name: "📱 New iPhone", cost: 1200 },
        { name: "🌴 Dream Vacation", cost: 3000 },
        { name: "💍 Wedding Fund", cost: 8000 },
        { name: "🏠 Home Upgrade", cost: 5000 },
    ];

    const affordableGoals = goals.filter((g) => results.total >= g.cost);

    return (
        <section ref={sectionRef} id="calculator" className="py-24 bg-background relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className={`inline-block text-sm font-semibold text-joy-600 dark:text-joy-400 uppercase tracking-wider mb-3 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                        See the Magic
                    </span>
                    <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold font-[family-name:var(--font-outfit)] mb-4 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        Your Money, <span className="text-gradient">Compounded</span>
                    </h2>
                    <p className={`text-lg text-muted-foreground max-w-xl mx-auto transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                        Play with the numbers yourself. See how small, consistent savings grow into something amazing.
                    </p>
                </div>

                <div className={`max-w-5xl mx-auto transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
                    <Card className="border-0 shadow-xl overflow-hidden">
                        <div className="grid lg:grid-cols-5 gap-0">
                            {/* Controls */}
                            <div className="lg:col-span-2 p-6 lg:p-8 bg-muted/50 space-y-8">
                                {/* Amount & Period Toggle */}
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <Label className="flex items-center gap-2 text-base font-semibold">
                                            <DollarSign className="w-4 h-4 text-joy-500" />
                                            {period === "weekly" ? "Weekly" : "Monthly"} Savings
                                        </Label>

                                        {/* Toggle Switch */}
                                        <div className="flex bg-muted-foreground/10 p-1 rounded-lg">
                                            <button
                                                onClick={() => handlePeriodChange("weekly")}
                                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${period === "weekly"
                                                    ? "bg-background shadow-sm text-foreground"
                                                    : "text-muted-foreground hover:text-foreground"
                                                    }`}
                                            >
                                                Weekly
                                            </button>
                                            <button
                                                onClick={() => handlePeriodChange("monthly")}
                                                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${period === "monthly"
                                                    ? "bg-background shadow-sm text-foreground"
                                                    : "text-muted-foreground hover:text-foreground"
                                                    }`}
                                            >
                                                Monthly
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min={period === "weekly" ? 5 : 20}
                                            max={period === "weekly" ? 500 : 2000}
                                            step={period === "weekly" ? 5 : 20}
                                            value={amount}
                                            onChange={(e) => setAmount(Number(e.target.value))}
                                            className="flex-1 accent-joy-500 h-2 rounded-full"
                                        />
                                        <span className="text-lg font-bold w-20 text-right tabular-nums">
                                            ${amount}
                                        </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {period === "weekly"
                                            ? `$${(amount * 4.33).toFixed(0)}/month`
                                            : `$${(amount * 12).toFixed(0)}/year`
                                        }
                                    </p>
                                </div>

                                {/* Years */}
                                <div>
                                    <Label className="flex items-center gap-2 mb-3 text-base font-semibold">
                                        <Calendar className="w-4 h-4 text-coral-500" />
                                        Time Period
                                    </Label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min={1}
                                            max={10}
                                            step={1}
                                            value={years}
                                            onChange={(e) => setYears(Number(e.target.value))}
                                            className="flex-1 accent-coral-500 h-2 rounded-full"
                                        />
                                        <span className="text-lg font-bold w-16 text-right tabular-nums">
                                            {years}yr{years > 1 ? "s" : ""}
                                        </span>
                                    </div>
                                </div>

                                {/* Goal Amount */}
                                <div>
                                    <Label className="flex items-center gap-2 mb-3 text-base font-semibold">
                                        <TrendingUp className="w-4 h-4 text-teal-500" />
                                        Goal Amount
                                    </Label>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="range"
                                            min={100}
                                            max={50000}
                                            step={100}
                                            value={goalAmount}
                                            onChange={(e) => setGoalAmount(Number(e.target.value))}
                                            className="flex-1 accent-teal-500 h-2 rounded-full"
                                        />
                                        <span className="text-lg font-bold w-24 text-right tabular-nums">
                                            {formatCurrency(goalAmount)}
                                        </span>
                                    </div>
                                </div>

                                {/* Next Deposit (computed) */}
                                <div className="p-4 rounded-xl bg-gradient-to-r from-joy-50 to-teal-50 dark:from-joy-950/30 dark:to-teal-950/30 border border-joy-200 dark:border-joy-800">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Percent className="w-4 h-4 text-joy-600 dark:text-joy-400" />
                                        <span className="text-sm font-semibold text-joy-700 dark:text-joy-300">Next Deposit</span>
                                    </div>
                                    <p className="text-2xl font-bold text-gradient">
                                        {formatCurrency(Math.ceil(results.nextDepositPeriod))}
                                        <span className="text-sm font-normal text-muted-foreground ml-1">
                                            /{period === "weekly" ? "week" : "month"}
                                        </span>
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        {formatCurrency(goalAmount)} over {results.totalMonths} months = {formatCurrency(goalAmount / results.totalMonths)}/mo
                                    </p>
                                </div>

                                {/* Results */}
                                <div className="pt-4 border-t space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">You deposit</span>
                                        <span className="font-semibold">{formatCurrency(results.totalDeposited)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Interest earned</span>
                                        <span className="font-semibold text-joy-600 dark:text-joy-400">
                                            +{formatCurrency(results.interestEarned)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t">
                                        <span className="font-semibold">Total Value</span>
                                        <span className="text-2xl font-bold text-gradient">
                                            {formatCurrency(results.total)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="lg:col-span-3 p-6 lg:p-8 flex flex-col">
                                <div className="flex items-center gap-6 mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-gradient-joy" />
                                        <span className="text-xs font-medium text-muted-foreground">
                                            With compounding
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                                        <span className="text-xs font-medium text-muted-foreground">
                                            Deposits only
                                        </span>
                                    </div>
                                </div>

                                <div className="flex-1 min-h-[280px]">
                                    <svg
                                        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                                        className="w-full h-full"
                                        preserveAspectRatio="xMidYMid meet"
                                    >
                                        <defs>
                                            <linearGradient id="compoundGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="hsl(160, 65%, 40%)" stopOpacity="0.3" />
                                                <stop offset="100%" stopColor="hsl(160, 65%, 40%)" stopOpacity="0.02" />
                                            </linearGradient>
                                        </defs>

                                        {/* Grid lines */}
                                        {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                                            <g key={pct}>
                                                <line
                                                    x1={padding.left}
                                                    y1={padding.top + plotHeight * (1 - pct)}
                                                    x2={padding.left + plotWidth}
                                                    y2={padding.top + plotHeight * (1 - pct)}
                                                    stroke="currentColor"
                                                    className="text-border"
                                                    strokeWidth="1"
                                                />
                                                <text
                                                    x={padding.left - 8}
                                                    y={padding.top + plotHeight * (1 - pct) + 4}
                                                    textAnchor="end"
                                                    className="fill-muted-foreground text-[10px]"
                                                >
                                                    {formatCurrency(maxValue * pct)}
                                                </text>
                                            </g>
                                        ))}

                                        {/* Area fill */}
                                        <path d={compoundArea} fill="url(#compoundGradient)" />

                                        {/* Deposit line */}
                                        <path
                                            d={depositLine}
                                            fill="none"
                                            stroke="currentColor"
                                            className="text-muted-foreground/30"
                                            strokeWidth="2"
                                            strokeDasharray="6 4"
                                        />

                                        {/* Compound line */}
                                        <path
                                            d={compoundLine}
                                            fill="none"
                                            stroke="hsl(160, 65%, 40%)"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />

                                        {/* End dot */}
                                        {results.dataPoints.length > 0 && (
                                            <circle
                                                cx={getX(results.dataPoints.length - 1)}
                                                cy={getY(results.dataPoints[results.dataPoints.length - 1].value)}
                                                r="5"
                                                fill="hsl(160, 65%, 40%)"
                                                stroke="white"
                                                strokeWidth="2"
                                            />
                                        )}
                                    </svg>
                                </div>

                                {/* Affordable goals */}
                                {affordableGoals.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <p className="text-xs font-medium text-muted-foreground mb-2">
                                            With {formatCurrency(results.total)}, you could afford:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {affordableGoals.map((goal, i) => (
                                                <span
                                                    key={i}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-joy-100 text-joy-700 dark:bg-joy-900/30 dark:text-joy-400"
                                                >
                                                    {goal.name}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </section>
    );
}
