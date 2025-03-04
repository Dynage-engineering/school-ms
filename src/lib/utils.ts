import type { AllCoursesRecord, CoursesRecord, UsersRecord } from "@/services/backend/pbTypes"
import { getCoursesList } from "@/services/backend/userService"
import { getUserDetail } from "@/services/backend/utils"
import { type ClassValue, clsx } from "clsx"
import type { ListResult } from "pocketbase"
import { useState, useEffect } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function useUserData() {
const [userData, setUser] = useState<UsersRecord | null>(null)

  useEffect(() => {
      getUserDetail().then((user) => {
          setUser(user)
      })
  }, [])
  return userData
}

export function useUserCourses() {
  const [courses, setCourses] = useState<ListResult<AllCoursesRecord> | null>(null)

  useEffect(() => {
    getCoursesList().then((course) => {
          setCourses(course)
      })
  }, [])

  console.log({courses})

  return courses
}