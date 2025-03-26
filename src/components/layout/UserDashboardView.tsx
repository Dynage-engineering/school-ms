import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUserData } from "@/lib/utils";
import type { UsersRecord } from "@/services/backend/pbTypes";
import { maskMail } from "@/services/backend/utils";
import { Button } from "../ui/button";
import { pb } from "@/services/backend/pocketbase";
import { useRef } from "react";

export function UserDashboardView() {
  const userData = useUserData() as UsersRecord | null;

  console.log("User Data", userData);
  // Create a reference for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle the avatar upload
  const handleAvatarUpload = async () => {
    const inputEl = fileInputRef.current;
    if (!inputEl || !inputEl.files || inputEl.files.length === 0) {
      alert("Please capture or select an image.");
      return;
    }
    const file = inputEl.files[0];
    const formData = new FormData();
    // Ensure the field name matches the one defined in your "users" collection for the avatar.
    formData.append("avatar", file);

    try {
      // Update the current user's record (assumes pb.authStore.record.id exists)
      const updatedUser = await pb.collection("users").update(
        pb.authStore.record.id,
        formData
      );
      console.log("Avatar updated successfully:", updatedUser);
      alert("Avatar updated successfully!");
      // Optionally, you can trigger a state update here to refresh the user data.
    } catch (error: any) {
      console.error("Error updating avatar", error);
      alert("Failed to update avatar. Please try again.");
    }
  };

  return (
    <div className="flex gap-4 flex-wrap">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">User Details</CardTitle>
          <CardDescription>Showing all user details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {userData ? (
              <div className="flex flex-col gap-2 items-start text-lg font-semibold">
                {userData.avatar ? (
                  <img
                    src={userData.avatar}
                    alt="User Avatar"
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <>
                    <input
                      type="file"
                      accept="image/*"
                      capture="user"
                      ref={fileInputRef}
                      className="p-2 border rounded"
                    />
                    <Button onClick={handleAvatarUpload} id="uploadAvatarButton">
                      Upload Image
                    </Button>
                  </>
                )}
                <p>
                  Fullname:{" "}
                  <span className="font-normal text-md">{userData.fullname}</span>
                </p>
                <p>
                  Email:{" "}
                  <span className="font-normal text-md">
                    {maskMail(userData.email)}
                  </span>
                </p>
                <p>
                  Role:{" "}
                  <span className="font-normal text-md">{userData.role}</span>
                </p>
              </div>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Courses</CardTitle>
          <CardDescription>Showing all user courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {userData ? (
              <div
                key={userData.id}
                className="flex flex-col gap-2 items-start text-lg font-semibold"
              >
                <p>
                  Total Courses Registered:{" "}
                  <span className="font-normal text-md">
                    {userData.courses?.length}
                  </span>
                </p>
                <a href="/app/course">
                  <Button>Register Course</Button>
                </a>
              </div>
            ) : (
              <p>Loading user courses...</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}