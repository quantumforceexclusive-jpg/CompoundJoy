// Force dynamic rendering for all dashboard pages
// since they depend on Convex auth state
export const dynamic = "force-dynamic";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
