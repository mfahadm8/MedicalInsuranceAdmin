import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/shared/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utilities/AuthProvider";
import { useQuery } from "react-query";
import api from "../utilities/api";
import { roles } from "@/data/roles";

export function UserNav() {
  const { logout } = useAuth();
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const userDetails = {};
  // useQuery(
  //   ["get-user-details", auth],
  //   () => api.get(`/users/details/${auth?.userId}`),
  //   {
  //     enabled: !!auth,
  //     refetchOnMount: false, // Prevent refetching when remounting
  //     staleTime: 600000, // 10 minutes in milliseconds
  //     cacheTime: 600000,
  //     select: (response) => response.data.data,
  //     // onSuccess: (data) => {

  //     //   const newAuthWithOrgType = {
  //     //     ...auth,
  //     //     organizationType: data.data.data.org[0].type,
  //     //   };
  //     //   localStorage.setItem("auth", JSON.stringify(newAuthWithOrgType));
  //     // },
  //   }
  // );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex gap-3   relative w-full">
          {userDetails && (
            <p className="text-[14px]">
              {/* {userDetails?.firstName + " " + userDetails?.lastName} */}

              {/* <span className="text-[10px] block text-end">{`(${
                roles.filter((item) => item.role === userDetails?.userType)[0]
                  .name
              })`}</span> */}
            </p>
          )}
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            Logout
          </Button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            {/* <p className="text-sm font-medium leading-none">satnaing</p> */}
            <p className="text-xs leading-none text-muted-foreground">
              {auth?.email || ""}
            </p>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuSeparator />
        {/* <DropdownMenuItem className="font-normal cursor-pointer">
          Profile{" "}
        </DropdownMenuItem> */}
        <DropdownMenuItem
          onClick={logout}
          className="font-normal cursor-pointer"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
