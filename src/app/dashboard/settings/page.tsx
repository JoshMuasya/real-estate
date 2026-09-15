import type { Metadata } from "next";

import { verifySession } from "@/lib/auth/dal";
import { listUserProfiles } from "@/lib/firebase/users";
import { ProfileForm } from "@/components/dashboard/settings/ProfileForm";
import { TeamPanel } from "@/components/dashboard/settings/TeamPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const metadata: Metadata = {
    title: "Settings",
    description: "Manage your account and team access.",
};

export default async function SettingsPage() {
    const user = await verifySession();
    const isAdmin = user.role === "admin";
    const members = isAdmin ? await listUserProfiles() : [];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl text-foreground">Settings</h1>
                <p className="mt-1 text-sm text-muted-foreground">Manage your account and team access.</p>
            </div>

            <Tabs defaultValue="profile">
                <TabsList>
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    {isAdmin && <TabsTrigger value="team">Team</TabsTrigger>}
                </TabsList>
                <TabsContent value="profile">
                    <ProfileForm user={user} />
                </TabsContent>
                {isAdmin && (
                    <TabsContent value="team">
                        <TeamPanel members={members} currentUid={user.uid} />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    );
}
