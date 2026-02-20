"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { LogOut, User, Shield, Settings } from "lucide-react";

export function ProfileDropdown() {
    const router = useRouter();
    const { signOut } = useAuthActions();
    const profile = useQuery(api.profiles.getMyProfile);
    const isAdmin = useQuery(api.profiles.isAdmin);
    const upsertProfile = useMutation(api.profiles.upsertProfile);
    const seedAdmin = useMutation(api.profiles.seedAdmin);

    const [isOpen, setIsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editStatus, setEditStatus] = useState("");
    const [editImageUrl, setEditImageUrl] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);

    // ...

    const handleBecomeAdmin = async () => {
        try {
            await seedAdmin();
            alert("You are now an Admin! Refresing...");
            window.location.reload();
        } catch (e: any) {
            alert("Failed: An admin already exists or error occurred.");
        }
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSignOut = async () => {
        await signOut();
        router.push("/");
    };

    const handleEditOpen = () => {
        setEditName(profile?.displayName || "");
        setEditStatus(profile?.status || "");
        setEditImageUrl(profile?.profileImageUrl || "");
        setIsEditOpen(true);
        setIsOpen(false);
    };

    const handleSaveProfile = async () => {
        if (!editName.trim()) return;
        await upsertProfile({
            displayName: editName.trim(),
            status: editStatus.trim() || undefined,
            profileImageUrl: editImageUrl.trim() || undefined,
        });
        setIsEditOpen(false);
    };

    const initials = profile?.displayName
        ? profile.displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "?";

    return (
        <>
            <div ref={dropdownRef} className="relative">
                {/* Profile Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-muted transition-colors"
                >
                    {profile?.profileImageUrl ? (
                        <img
                            src={profile.profileImageUrl}
                            alt={profile.displayName}
                            className="w-9 h-9 rounded-xl object-cover ring-2 ring-joy-400/30"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-joy-400 to-teal-500 flex items-center justify-center text-white text-sm font-bold shadow-md">
                            {initials}
                        </div>
                    )}
                    <div className="hidden sm:block text-left">
                        <p className="text-sm font-semibold leading-tight">
                            {profile?.displayName || "Set up profile"}
                        </p>
                        <p className="text-[10px] text-muted-foreground leading-tight">
                            {profile?.status || (isAdmin ? "Admin" : "Member")}
                        </p>
                    </div>
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border bg-background shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        {/* User info */}
                        <div className="p-4 border-b bg-muted/30">
                            <div className="flex items-center gap-3">
                                {profile?.profileImageUrl ? (
                                    <img
                                        src={profile.profileImageUrl}
                                        alt={profile.displayName}
                                        className="w-12 h-12 rounded-xl object-cover ring-2 ring-joy-400/30"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-joy-400 to-teal-500 flex items-center justify-center text-white text-lg font-bold shadow-md">
                                        {initials}
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="font-semibold truncate">
                                        {profile?.displayName || "Anonymous"}
                                    </p>
                                    <p className="text-xs text-muted-foreground truncate">
                                        {profile?.status || "No status set"}
                                    </p>
                                    {isAdmin && (
                                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-coral-100 text-coral-700 dark:bg-coral-900/30 dark:text-coral-400">
                                            <Shield className="w-2.5 h-2.5" />
                                            Admin
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-2">
                            <button
                                onClick={handleEditOpen}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left"
                            >
                                <Settings className="w-4 h-4 text-muted-foreground" />
                                Edit Profile
                            </button>

                            {isAdmin ? (
                                <button
                                    onClick={() => {
                                        router.push("/admin");
                                        setIsOpen(false);
                                    }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left"
                                >
                                    <Shield className="w-4 h-4 text-coral-500" />
                                    Admin Panel
                                </button>
                            ) : (
                                <button
                                    onClick={handleBecomeAdmin}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors text-left text-muted-foreground/50 hover:text-foreground"
                                    title="Dev only: Becomes admin if none exist"
                                >
                                    <Shield className="w-4 h-4" />
                                    Become Admin (Dev)
                                </button>
                            )}

                            <div className="my-1 border-t" />

                            <button
                                onClick={handleSignOut}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-destructive/10 text-destructive transition-colors text-left"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Profile Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-[family-name:var(--font-outfit)]">
                            Edit Profile ✨
                        </DialogTitle>
                        <DialogDescription>
                            Customize how you appear on CompoundJoy.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {/* Preview */}
                        <div className="flex justify-center">
                            {editImageUrl ? (
                                <img
                                    src={editImageUrl}
                                    alt="Preview"
                                    className="w-20 h-20 rounded-2xl object-cover ring-4 ring-joy-400/20"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-joy-400 to-teal-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                                    {editName ? editName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?"}
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="profile-name">Display Name *</Label>
                            <Input
                                id="profile-name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder="Your name"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="profile-status">Status (optional)</Label>
                            <Input
                                id="profile-status"
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value)}
                                placeholder="e.g. Saving for my dream vacation! 🌴"
                                maxLength={100}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="profile-image">Profile Image URL (optional)</Label>
                            <Input
                                id="profile-image"
                                value={editImageUrl}
                                onChange={(e) => setEditImageUrl(e.target.value)}
                                placeholder="https://example.com/photo.jpg"
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Paste a link to your profile photo
                            </p>
                        </div>

                        <Button
                            variant="joy"
                            className="w-full"
                            onClick={handleSaveProfile}
                            disabled={!editName.trim()}
                        >
                            Save Profile
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
