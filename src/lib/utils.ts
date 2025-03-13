import type { AllCoursesRecord, AllCoursesResponse, CoursesRecord, UsersRecord } from "@/services/backend/pbTypes"
import { getAllCoursesList, getUserCoursesList } from "@/services/backend/userService"
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

export function useAllCourses() {
  const [all_courses, setCourses] = useState<ListResult<AllCoursesRecord> | null>(null)

  useEffect(() => {
    getAllCoursesList().then((course) => {
      setCourses(course)
    })
  }, [])

  console.log({ all_courses })

  return all_courses
}


export function useUserCourses() {
  const [usercourses, setCourses] = useState<AllCoursesResponse<unknown>[] | null>(null)

  useEffect(() => {
    getUserCoursesList().then((course) => setCourses(course))
  }, [])

  console.log({ usercourses })

  return usercourses
}

