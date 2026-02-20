"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useConvexAuth } from "convex/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Trash2, User, Loader2, ArrowLeft, Check, X } from "lucide-react";
import Link from "next/link";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function AdminPage() {
    const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth();
    const isAdmin = useQuery(api.profiles.isAdmin);
    const router = useRouter();
    const profiles = useQuery(api.profiles.getAllProfiles);
    const setUserRole = useMutation(api.profiles.setUserRole);
    const deleteUserProfile = useMutation(api.profiles.deleteUserProfile);

    const [deleteId, setDeleteId] = useState<string | null>(null);

    useEffect(() => {
        if (!isAuthLoading) {
            if (!isAuthenticated) {
                router.push("/sign-in");
            }
        }
    }, [isAuthLoading, isAuthenticated, router]);

    if (isAuthLoading || isAdmin === undefined) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // If not authenticated, we return null (effect handles redirect)
    // If authenticated but NOT admin, show 404 Not Found style page
    if (!isAuthenticated || isAdmin === false) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center p-4">
                <h1 className="text-6xl font-black font-[family-name:var(--font-outfit)] mb-4 text-muted-foreground/20">404</h1>
                <h2 className="text-2xl font-bold mb-4">Page Not Found</h2>
                <p className="text-muted-foreground mb-8 max-w-md">
                    The page you are looking for does not exist or you do not have permission to view it.
                </p>
                <Button variant="default" onClick={() => router.push(isAuthenticated ? "/dashboard" : "/sign-in")}>
                    Go Back
                </Button>
            </div>
        );
    }

    const handleDelete = async (id: string) => {
        // @ts-ignore
        await deleteUserProfile({ profileId: id });
        setDeleteId(null);
    };

    return (
        <div className="min-h-screen bg-muted/30 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold font-[family-name:var(--font-outfit)] flex items-center gap-2">
                                <Shield className="w-8 h-8 text-coral-500" />
                                Admin Panel
                            </h1>
                            <p className="text-muted-foreground">Manage users and permissions</p>
                        </div>
                    </div>
                </div>

                <Card className="border-0 shadow-lg">
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">User</th>
                                        <th className="px-4 py-3">Role</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Joined</th>
                                        <th className="px-4 py-3 rounded-tr-lg text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {profiles?.map((profile: any) => (
                                        <tr key={profile._id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {profile.profileImageUrl ? (
                                                        <img
                                                            src={profile.profileImageUrl}
                                                            alt={profile.displayName}
                                                            className="w-10 h-10 rounded-full object-cover bg-muted"
                                                        />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-joy-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                                            {profile.displayName?.slice(0, 2).toUpperCase()}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium text-foreground">{profile.displayName}</p>
                                                        <p className="text-xs text-muted-foreground">ID: {profile.userId.slice(0, 8)}...</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${profile.role === "admin"
                                                    ? "bg-coral-100 text-coral-700 dark:bg-coral-900/30 dark:text-coral-400"
                                                    : "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400"
                                                    }`}>
                                                    {profile.role === "admin" ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                                    {profile.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 max-w-xs truncate text-muted-foreground">
                                                {profile.status || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {new Date(profile.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {/* Role Toggle */}
                                                    {profile.role === "admin" ? (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setUserRole({ profileId: profile._id, role: "user" })}
                                                            className="text-xs h-8"
                                                            // Provide a safer check: Can't demote yourself if you are an admin viewing this page
                                                            // Actually, simpler: prevent if you are the logged in user
                                                            disabled={true}
                                                            // Admin should not demote themselves to accidentally lose access.
                                                            // For simplicity given the complexity of `profiles` filtering in render.
                                                            title="Cannot demote admins from this panel (safety)"
                                                        >
                                                            Admin
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setUserRole({ profileId: profile._id, role: "admin" })}
                                                            className="text-xs h-8 text-joy-600 hover:text-joy-700 hover:bg-joy-50 dark:hover:bg-joy-900/30"
                                                        >
                                                            Make Admin
                                                        </Button>
                                                    )}

                                                    {/* Delete */}
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Delete User?</DialogTitle>
                                                                <DialogDescription>
                                                                    This will permanently delete <strong>{profile.displayName}</strong> and all their goals and data. This action cannot be undone.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <DialogFooter>
                                                                <Button variant="outline">Cancel</Button>
                                                                <Button
                                                                    variant="destructive"
                                                                    onClick={() => {
                                                                        handleDelete(profile._id);
                                                                    }}
                                                                >
                                                                    Delete User
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {profiles?.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                                                No users found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
