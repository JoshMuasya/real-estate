import "dotenv/config";

import { adminAuth } from "@/lib/firebase/admin";
import { upsertUserProfile } from "@/lib/firebase/users";

async function main() {
    const email = process.env.SEED_ADMIN_EMAIL;
    const password = process.env.SEED_ADMIN_PASSWORD;
    const name = process.env.SEED_ADMIN_NAME || "Admin";

    if (!email || !password) {
        throw new Error("SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in the environment.");
    }

    const auth = adminAuth();
    let uid: string;

    try {
        const existing = await auth.getUserByEmail(email);
        uid = existing.uid;
        console.log(`User ${email} already exists (${uid}) — updating role/claims.`);
    } catch {
        const created = await auth.createUser({ email, password, displayName: name });
        uid = created.uid;
        console.log(`Created user ${email} (${uid}).`);
    }

    await auth.setCustomUserClaims(uid, { role: "admin" });
    await upsertUserProfile(uid, { email, name, role: "admin" });

    console.log(`Done — ${email} is now an admin.`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
