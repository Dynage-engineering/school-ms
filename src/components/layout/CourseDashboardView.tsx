import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAllCourses, useUserCourses, useUserData } from "@/lib/utils";
import type { AllCoursesRecord, AllCoursesResponse, UsersRecord } from "@/services/backend/pbTypes";
import { Button } from "../ui/button";
import type { ListResult } from "pocketbase";
import { userCourseRegistration, userCourseUnregistration } from "@/services/backend/userService";

export function CourseDashboardView() {
  const userData = useUserData() as UsersRecord | null;
  const allCourses = useAllCourses() as ListResult<AllCoursesRecord> | null;


  const userRegisteredCourses = useUserCourses() as AllCoursesResponse<unknown>[] | null;

  return (
    <div className="flex gap-4 flex-wrap">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">All Course </CardTitle>
          <CardDescription>Showing all available course</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="">
            {allCourses ? (
              <div className="flex flex-wrap gap-2">
                {allCourses.items?.map((course) => (
                  <div className="border p-4 my-2 rounded hover:border-blue-500 cursor-pointer" key={course.id}>
                    <p>Course Title: <strong>{course.course_name}</strong> </p>

                    <p>Course Code:  <strong>{course.course_code}</strong></p>
                    <p>Course Unit: <strong> {course.course_unit}</strong> </p>
                    <p>Course Instructor: <strong>{course.instructor_fullname}</strong> </p>
                    <Button onClick={()=> userCourseRegistration(course.id)}>Register</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p> Loading all courses</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl"> Registered Courses </CardTitle>
          <CardDescription>Showing all user registered courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="">All registered courses</div>
          <div className="">
            {userRegisteredCourses ? (
              <div className="flex flex-wrap gap-2">
                {userRegisteredCourses.map((course) => (
                  <div className="border p-4 my-2 rounded hover:border-blue-500 cursor-pointer" key={course.id}>
                    <p>Course Title: <strong>{course.course_name}</strong> </p>

                    <p>Course Code:  <strong>{course.course_code}</strong></p>
                    <p>Course Unit: <strong> {course.course_unit}</strong> </p>
                    <p>Course Instructor: <strong>{course.instructor_fullname}</strong> </p>
                    <Button onClick={()=> userCourseUnregistration(course.id)}>Remove Course</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p> Loading all registered courses</p>
            )}
            </div>

        </CardContent>
      </Card>
    </div>
  );
}
