import { useEffect, useState } from "react";
import { IconChevronsLeft, IconMenu2, IconX } from "@tabler/icons-react";
import { Layout } from "./layout";
import { Button } from "./button";
import Nav from "./nav";
import { cn } from "@/lib/utils";
import { useSidebarLinks } from "@/data/sidelinks";

import { useAuth } from "../utilities/AuthProvider";
import Logo from "@/assets/NavLogo.svg";
import LogoMob from "@/assets/NavLogoMob.svg";

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  isCollapsed: boolean;
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({
  className,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const [navOpened, setNavOpened] = useState(false);
  const links = useSidebarLinks();

  /* Make body not scrollable when navBar is opened */
  useEffect(() => {
    if (navOpened) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
  }, [navOpened]);

  return (
    <aside
      className={cn(
        `fixed left-0 right-0 top-0 z-50 w-full md:border-r-2 border-r-muted transition-[width] md:bottom-0 md:right-auto md:h-svh ${isCollapsed ? "md:w-16" : "md:w-64"
        }`,
        className
      )}
    >
      {/* Overlay in mobile */}
      {/* <div
        // onClick={() => setNavOpened(false)}
        className={`absolute inset-0 transition-[opacity] delay-100 duration-700 ${
          navOpened ? "h-svh opacity-0" : "h-0 opacity-0"
        } w-full bg-black md:hidden`}
      /> */}
      <Layout fixed className={navOpened ? "h-svh" : ""}>
        {/* Header */}
        <Layout.Header
          sticky
          className={cn(
            "z-50 flex justify-between px-4 py-3 shadow-sm  ",
            "sidebar-bg",
            isCollapsed ? "md:pl-2" : "md:pl-4"
          )}
        >
          <div className={`flex   relative items-center ${!isCollapsed ? "gap-2" : ""}`}>
            <div
              className={`flex flex-col justify-end truncate ${isCollapsed ? "visible w-12" : "visible w-auto"
                }`}
            >
              {isCollapsed ? (
                <img
                  src={LogoMob}
                  alt=""
                  // height={100}
                  width={50}
                  className="mt-5 mr-2"
                />
              ) : (
                <img
                  src={Logo}
                  alt=""
                  width={130}
                  className="md:mt-5 mt-2 h-10 relative -left-4"
                />
              )}
            </div>

          </div>

          {/* Toggle Button in mobile */}
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Toggle Navigation"
            aria-controls="sidebar-menu"
            aria-expanded={navOpened}
            onClick={() => setNavOpened((prev) => !prev)}
          >
            {navOpened ? <IconX /> : <IconMenu2 />}
          </Button>
        </Layout.Header>

        {/* Navigation links */}
        <div className=" md:sidebar-bg h-full">
          <Nav
            id="sidebar-menu"
            className={`   z-40 h-full flex-1 overflow-auto   ${navOpened
              ? "max-h-screen"
              : "max-h-0 py-0 md:max-h-screen md:py-2"
              }`}
            closeNav={() => setNavOpened(false)}
            isCollapsed={isCollapsed}
            links={links}
          />
        </div>

        {/* Scrollbar width toggle button */}
        <Button
          onClick={() => setIsCollapsed((prev) => !prev)}
          size="icon"
          variant="outline"
          className={cn(
            "absolute -right-5 top-1/2 z-50 hidden rounded-full md:inline-flex"
          )}
        >
          <IconChevronsLeft
            stroke={1.5}
            className={`h-5 w-5 ${isCollapsed ? "rotate-180" : ""}`}
          />
        </Button>
      </Layout>
    </aside>
  );
}
