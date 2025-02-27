import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { UsersRecord } from "@/services/backend/pbTypes"
import { getUserDetail } from "@/services/backend/utils"
import { $userDataStore } from "@/stores/account"

import { useStore } from '@nanostores/react';
import { useState, useEffect } from "react";

export function DashboardView() {
  const [userData, setUser] = useState<UsersRecord | null>(null)

  useEffect(() => {
      getUserDetail().then((user) => {
          setUser(user)
      })
  }, [])

  const userStore = useStore($userDataStore)
  console.log("Dashboard store", userStore)
  console.log({ userData })

  return (
      <Card className="mx-auto max-w-sm">
          <CardHeader>
              <CardTitle className="text-2xl">Dashboard Page </CardTitle>
              <CardDescription>
                  This shows the dashboard page
              </CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid gap-4">
                  {userData ? (
                      <div>
                          <p className="text-lg font-semibold">Fullname: {userData.fullname}</p>
                          <p className="text-lg font-semibold">Email: {userData.email}</p>
                          <p className="text-lg font-semibold">Role: {userData.role}</p>
                      </div>
                  ) : (
                      <p>Loading user data...</p>
                  )}
              </div>
          </CardContent>
      </Card>
  )
}