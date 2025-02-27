import { pb } from "./pocketbase"
import { z } from "zod"
import { isLoggedInStore, $userDataStore } from '@/stores/account';

export async function userLogin(email: string, password: string) {
    try {
        const authData = await pb.collection('users').authWithPassword(
            email,
            password,
        );

        console.log("Auth Data:", authData); // Debugging: Check the entire authData object

        if (authData && authData.token && authData.record) {
            pb.authStore.save(authData.token);
            isLoggedInStore.set(true);
            if ($userDataStore.get()[authData.record.id] === undefined) {
                $userDataStore.set({ [authData.record.id]: authData.record });
            } else {
                $userDataStore.set({ ...$userDataStore.get(), [authData.record.id]: authData.record
                });
            }

            console.log("Logged in", authData.record); // Debugging: Check the user record
            console.log("Logged User", $userDataStore.get()[authData.record.id]); // Debugging: Check the store

            // Optional: Delay redirection slightly to ensure state is updated
            setTimeout(() => {
                window.location.href = "/app";
            }, 100);
        } else {
            console.error("Invalid authData:", authData);
            alert("Login failed: Invalid response from server.");
        }
    } catch (error) {
        console.error("Login error:", error); // Debugging: Log the error
        alert("Login failed: " + error.message);
    }
}

export async function userCourseRegistration() {
    // return pb.authStore.model
}

export async function userCourseUnregistration() {

}
export async function userCourseList() {

}
export async function userCourseDetail() {}
export async function userBiodataSubmit() {}
export async function userBiodataUpdate() {}
export async function userRegister(email: string, password: string, fullname: string, role?: string) {
    const data = {
        email: email,
        password: password,
        passwordConfirm: password,
        fullname: fullname,
        role: role || "Student",
    }
    const resp = await pb.collection("users").create(data)
    // TODO check if response is good, no error
    if (resp === null) {
        throw new Error("Error creating user")
    }
    window.location.href = "/confirmation"
}

export const loginFormSchema = z.object(
    {
        email: z.string().email().min(5),
        password: z.string().min(8).max(50),
    }
)
export type LoginFormType = z.infer<typeof loginFormSchema>


export const registerFormSchema = z.object(
    {
        fullname: z.string(),
        email: z.string().email().min(5),
        password: z.string().min(8).max(50),
        role: z.enum(["Admin", "Student", "Lecturer"]).default("Student"),
    }
)
export type RegisterFormType = z.infer<typeof registerFormSchema>
