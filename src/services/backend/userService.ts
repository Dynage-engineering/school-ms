import { pb } from "./pocketbase"
import { z } from "zod"
import { isLoggedInStore } from '@/stores/account';
import { getUserWithId } from "./utils";

export async function userLogin(email: string, password: string) {
    try {
        await pb.collection('users').authWithPassword(
            email,
            password,
        );
        // console.log(pb.authStore.isValid);
        // console.log(pb.authStore.token);
        // console.log(pb.authStore.record);


        if (pb.authStore.isValid && pb.authStore.token && pb.authStore.record.id) {
            pb.authStore.save(pb.authStore.token, pb.authStore.record);
            isLoggedInStore.set(true);
        }
        window.location.href = "/app";


    } catch (error) {
        console.error("Login error:", error); // Debugging: Log the error
        alert("Login failed: " + error.message);
    }
}

export async function userCourseRegistration(courseId: string) {

    try {
        const user = await pb.collection('users').getOne(pb.authStore.record.id);
        const data = {};
        await pb.collection('users').update(pb.authStore.record.id, data);
        console.log("Course registered successfully");

    } catch (error) {
        console.error("Error registering course", error);
        return null;

    }
    // return pb.authStore.model
}

export async function userCourseUnregistration() {

}
export async function getCoursesList() {
    try {
        const courses = await pb.collection('all_courses').getList();
        return courses;
    }
    catch (error) {
        console.error("Error fetching courses", error);
        return null;
    }

}
export async function userCourseDetail() { }
export async function userBiodataSubmit() { }
export async function userBiodataUpdate() { }
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
