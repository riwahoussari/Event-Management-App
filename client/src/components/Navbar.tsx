import { useUser } from "@/context/UserContext";
import { Link, Outlet } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "./ui/skeleton";
import { GUEST_NAV_LINKS, USER_NAV_LINKS } from "@/lib/constants";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import BurgerMenuSvg from "./ui/BurgerMenuSvg";
import { useEffect, useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "sonner";

export default function Navbar() {
  const { user, loading } = useUser();

  if (loading)
    return (
      <>
        <header className="w-full px-6 py-4 border-b shadow-sm flex justify-between items-center">
          <nav className="flex gap-6 md:gap-12 items-center">
            <Skeleton className="w-[50px] h-[20px]" />
            <Skeleton className="w-[50px] h-[20px]" />
            <Skeleton className="w-[50px] h-[20px]" />
          </nav>
          <Skeleton className="w-9 h-9 rounded-full" />
        </header>
        <Outlet />
      </>
    );

  return (
    <>
      <header className="w-full px-6 py-4 border-b shadow-sm flex justify-between items-center">
        {/* Left navigation links */}
        <div className="flex items-center gap-6">
          {user && <DropdownNavMenu />}
          <nav className="flex gap-6 md:gap-12 items-center">
            {(
              (user?.account_type && USER_NAV_LINKS[user.account_type]) ||
              GUEST_NAV_LINKS
            ).map((link) => (
              <Link
                key={link.text}
                to={link.link}
                className="md:text-lg font-medium hover:underline"
              >
                {link.text}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right profile link */}
        <Link to="/profile">
          <Avatar className="w-9 h-9">
            <AvatarImage src="/profile-pic-placeholder.png" alt="User" />
            <AvatarFallback>
              <div className="w-9 h-9 bg-gray-400 flex items-end justify-center">
                <svg
                  className="w-6 h-8"
                  viewBox="0 0 20 20"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <title>profile [#1335]</title>
                  <desc>Created with Sketch.</desc>
                  <defs></defs>
                  <g
                    id="Page-1"
                    stroke="none"
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
                  >
                    <g
                      id="Dribbble-Light-Preview"
                      transform="translate(-420.000000, -2159.000000)"
                      fill="#000000"
                    >
                      <g
                        id="icons"
                        transform="translate(56.000000, 160.000000)"
                      >
                        <path
                          d="M374,2009 C371.794,2009 370,2007.206 370,2005 C370,2002.794 371.794,2001 374,2001 C376.206,2001 378,2002.794 378,2005 C378,2007.206 376.206,2009 374,2009 M377.758,2009.673 C379.124,2008.574 380,2006.89 380,2005 C380,2001.686 377.314,1999 374,1999 C370.686,1999 368,2001.686 368,2005 C368,2006.89 368.876,2008.574 370.242,2009.673 C366.583,2011.048 364,2014.445 364,2019 L366,2019 C366,2014 369.589,2011 374,2011 C378.411,2011 382,2014 382,2019 L384,2019 C384,2014.445 381.417,2011.048 377.758,2009.673"
                          id="profile-[#1335]"
                        ></path>
                      </g>
                    </g>
                  </g>
                </svg>
              </div>
            </AvatarFallback>
          </Avatar>
        </Link>
      </header>
      <Outlet />
    </>
  );
}

function DropdownNavMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    data,
    error,
    refetch: logout,
  } = useFetch<{ message: string }>(
    "/api/auth/logout",
    { method: "POST" },
    false
  );

  // Show toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error("Failed to load events", {
        description: error || "Something went wrong",
      });
    }

    if (data && data.message) {
      window.location.reload();
    }
  }, [error, data]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={() => {
          console.log("hi");
          setIsOpen((prev) => !prev);
        }}
        className="cursor-pointer"
      >
        <Button variant="outline" size="sm" className=" cursor-pointer">
          <BurgerMenuSvg isOpen={isOpen} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
