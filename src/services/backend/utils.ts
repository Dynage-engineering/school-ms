import { pb } from "@/services/backend/pocketbase"
import { isLoggedInStore } from "@/stores/account"
import type { UsersRecord } from "./pbTypes";
// import * as faceapi from 'face-api.js';


export async function getUserDetail(): Promise<UsersRecord | null> {
    if (pb.authStore.record && pb.authStore.record.id) {
        try {
            const user = await pb.collection("users").getOne(pb.authStore.record.id);
            console.log("User", user);
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

export const maskMail = (email: string): string => {
    const [name, domain] = email.split("@");
    const maskedName = name.slice(0, 3) + "*".repeat(6);
    return `${maskedName}@${domain}`;
}

export const getUserWithId = (id: string): Promise<UsersRecord> => {
    return pb.collection("users").getOne(id);
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



// export const compareFaces = async (image1: string, image2: string) => {
//     await faceapi.nets.ssdMobilenetv1.loadFromUri('/models')
// await faceapi.nets.faceRecognitionNet.loadFromUri('/models')
//     const img1 = await faceapi.fetchImage(image1);
//     const img2 = await faceapi.fetchImage(image2);
//     const results = await faceapi.detectAllFaces(img1).withFaceLandmarks().withFaceDescriptors();
//     const results2 = await faceapi.detectAllFaces(img2).withFaceLandmarks().withFaceDescriptors();
//     const faceMatcher = new faceapi.FaceMatcher(results);
//     const bestMatch = faceMatcher.findBestMatch(results2[0].descriptor);
//     console.log(bestMatch.toString());
//     return bestMatch.toString();
// }