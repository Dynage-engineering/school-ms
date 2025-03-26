import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useStore } from "@nanostores/react";
import { isLoggedInStore } from "@/stores/account";

import { doLogout } from "@/services/backend/utils";
import { useUserData } from "@/lib/utils";
import type { UsersRecord } from "@/services/backend/pbTypes";

export default function NavbarMobileSidebar() {
  const userData = useUserData() as UsersRecord | null;

  const $isLoggedIn = useStore(isLoggedInStore);

  return !$isLoggedIn ? (
    <div className="flex w-full lg:w-40 justify-end items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <a href="/login">
        <Button>Log In</Button>
      </a>
    </div>
  ) : (
    <div className="flex w-full lg:w-20 items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-full ml-auto flex-none sm:flex-initial"
          >
            <Avatar className="h-9 w-9 sm:flex">
              <AvatarImage
                src={`https://ui-avatars.com/api/?background=random`}
                alt="Avatar"
              />
              <AvatarFallback>AL</AvatarFallback>
              {/* <AvatarFallback>{shortenName(userData.fullname)}</AvatarFallback> */}
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <a href="/app">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
          </a>
          <DropdownMenuSeparator />
          <a href="/app/course">
            <DropdownMenuItem>Courses</DropdownMenuItem>
          </a>
          {userData && userData?.role === "Admin" && (
            <a href="/app/livestream">
              <DropdownMenuItem>Livestream</DropdownMenuItem>
            </a>
          )}
          <a href="/app/student">
            <DropdownMenuItem>Student</DropdownMenuItem>
          </a>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={doLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
