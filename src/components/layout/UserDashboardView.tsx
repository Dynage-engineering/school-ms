import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAllCourses, useUserData } from "@/lib/utils";
import type { CoursesRecord, UsersRecord } from "@/services/backend/pbTypes";
import { maskMail } from "@/services/backend/utils";
import { Button } from "../ui/button";
import type { ListResult } from "pocketbase";

export function UserDashboardView() {
  const userData = useUserData() as UsersRecord | null;
  const userCourses = useAllCourses() as ListResult<CoursesRecord> | null;

  console.log({ userData });

  return (
    <div className="flex gap-4 flex-wrap">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">User Details </CardTitle>
          <CardDescription>Showing all user details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {userData ? (
              <div className="flex flex-col gap-2 items-start text-lg font-semibold">
                <p>
                  Fullname:{" "}
                  <span className="font-normal text-md">
                    {" "}
                    {userData.fullname}
                  </span>{" "}
                </p>
                <p>
                  Email:{" "}
                  <span className="font-normal text-md">
                    {" "}
                    {maskMail(userData.email)}
                  </span>{" "}
                </p>
                <p>
                  Role:{" "}
                  <span className="font-normal text-md"> {userData.role} </span>
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
          <CardTitle className="text-2xl"> Courses </CardTitle>
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
                    {" "}
                    {userData.courses?.length}
                  </span>
                </p>

                <a href="/app/course">
                  <Button> Register Course </Button>
                </a>
              </div>
            ) : (
              <div className="">
                <p>Loading user course...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
