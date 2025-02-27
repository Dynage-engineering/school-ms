import { pb } from "@/services/backend/pocketbase"
import { isLoggedInStore, $userDataStore } from "@/stores/account"
import type { UsersRecord } from "./pbTypes";

export async function getUserDetail(): Promise<UsersRecord | null> {
    if (pb.authStore.record && pb.authStore.record.id) {
        try {
            const user = await pb.collection("users").getOne(pb.authStore.record.id);
            console.log("User", user);
            // $userDataStore.set(user);
            return user;
        } catch (error) {
            console.error("Error fetching user details:", error);
            return null;
        }
    } else {
        console.warn("User is not authenticated");
        return null;
    }
}


export function isLoggedIn(): boolean {

    console.log(`Checked in: ${pb.authStore.isValid}`)
    return pb.authStore.isValid
}

export function doLogout() {
    pb.authStore.clear()
    isLoggedInStore.set(false)
    window.location.href = "/login"
}