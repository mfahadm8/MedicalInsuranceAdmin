// import {
//   LayoutDashboard,
//   Users,
//   Briefcase,
//   ListChecks,
//   FolderOpen,
//   Building2,
// } from "lucide-react";
export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

// const userType =
//   localStorage.getItem("auth") &&
//   JSON.parse(localStorage.getItem("auth") || "")?.userType;

// let routes: SideLink[] = [];
// // Define routes based on user role
// switch (userType) {
//   case "systemadmin":
//     routes = [
//       {
//         title: "Organizations",
//         label: "",
//         href: "/",
//         icon: <LayoutDashboard size={25} />,
//       },
//       {
//         title: "Tasks",
//         label: "",
//         href: "/tasks",
//         icon: <ListChecks size={25} />,
//       },
//       {
//         title: "Documents",
//         label: "",
//         href: "/documents",
//         icon: <FolderOpen size={25} />,
//       },
//       {
//         title: "Buildings",
//         label: "",
//         href: "/buildings",
//         icon: <Building2 size={25} />,
//       },
//       {
//         title: "Jobs",
//         label: "",
//         href: "/jobs",
//         icon: <Briefcase size={25} />,
//       },
//       {
//         title: "Users",
//         label: "",
//         href: "/users",
//         icon: <Users size={25} />,
//       },
//     ];
//     break;
//   case "superadmin":
//     routes = [
//       {
//         title: "Clients",
//         label: "",
//         href: "/",
//         icon: <Users size={25} />,
//       },
//       {
//         title: "Tasks",
//         label: "",
//         href: "/tasks",
//         icon: <ListChecks size={25} />,
//       },
//       {
//         title: "Documents",
//         label: "",
//         href: "/documents",
//         icon: <FolderOpen size={25} />,
//       },
//       {
//         title: "Buildings",
//         label: "",
//         href: "/buildings",
//         icon: <Building2 size={25} />,
//       },
//       {
//         title: "Contractors",
//         label: "",
//         href: "/contractors",
//         icon: <Users size={25} />,
//       },
//       {
//         title: "Jobs",
//         label: "",
//         href: "/jobs",
//         icon: <Briefcase size={25} />,
//       },
//       {
//         title: "Users",
//         label: "",
//         href: "/users",
//         icon: <Users size={25} />,
//       },
//     ];
//     break;
//   case "admin":
//     routes = [
//       {
//         title: "Clients",
//         label: "",
//         href: "/",
//         icon: <Users size={25} />,
//       },
//       {
//         title: "Tasks",
//         label: "",
//         href: "/tasks",
//         icon: <ListChecks size={25} />,
//       },
//       {
//         title: "Documents",
//         label: "",
//         href: "/documents",
//         icon: <FolderOpen size={25} />,
//       },
//       {
//         title: "Buildings",
//         label: "",
//         href: "/buildings",
//         icon: <Building2 size={25} />,
//       },
//       {
//         title: "Contractors",
//         label: "",
//         href: "/contractors",
//         icon: <Users size={25} />,
//       },
//       {
//         title: "Jobs",
//         label: "",
//         href: "/jobs",
//         icon: <Briefcase size={25} />,
//       },
//       {
//         title: "Users",
//         label: "",
//         href: "/users",
//         icon: <Users size={25} />,
//       },
//     ];
//     break;
//   case "resident":
//     routes = [
//       {
//         title: "Tasks",
//         label: "",
//         href: "/tasks",
//         icon: <ListChecks size={25} />,
//       },
//       {
//         title: "Documents",
//         label: "",
//         href: "/documents",
//         icon: <FolderOpen size={25} />,
//       },
//       {
//         title: "Feedback and Complaints",
//         label: "",
//         href: "/feedback",
//         icon: <FolderOpen size={25} />,
//       },
//     ];
//     break;
//   case "standard":
//     routes = [
//       {
//         title: "Tasks",
//         label: "",
//         href: "/tasks",
//         icon: <ListChecks size={25} />,
//       },
//       {
//         title: "Documents",
//         label: "",
//         href: "/documents",
//         icon: <FolderOpen size={25} />,
//       },
//       {
//         title: "Jobs",
//         label: "",
//         href: "/jobs",
//         icon: <Briefcase size={25} />,
//       },
//       {
//         title: "Buildings",
//         label: "",
//         href: "/buildings",
//         icon: <Building2 size={25} />,
//       },
//     ];
//     break;
//   case "contractor":
//     routes = [
//       {
//         title: "Jobs",
//         label: "",
//         href: "/jobs",
//         icon: <Briefcase size={25} />,
//       },
//       {
//         title: "Documents",
//         label: "",
//         href: "/documents",
//         icon: <FolderOpen size={25} />,
//       },
//     ];
//     break;
//   case "stakeholder":
//     routes = [
//       {
//         title: "Tasks",
//         label: "",
//         href: "/tasks",
//         icon: <ListChecks size={25} />,
//       },
//       {
//         title: "Documents",
//         label: "",
//         href: "/documents",
//         icon: <FolderOpen size={25} />,
//       },
//       {
//         title: "Feedback and Complaints",
//         label: "",
//         href: "/feedback",
//         icon: <FolderOpen size={25} />,
//       },
//     ];
//     break;
//   default:
//     routes = [];
//     break;
// }

// export const sidelinks: SideLink[] = [...routes];

// hooks/useSidebarLinks.ts

import { useMemo } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ListChecks,
  FolderOpen,
  Building2,
  HardHat,
} from "lucide-react";
import { useAuth } from "@/components/utilities/AuthProvider";

export interface NavLink {
  title: string;
  label?: string;
  href: string;
  icon: JSX.Element;
}

export interface SideLink extends NavLink {
  sub?: NavLink[];
}

export function useSidebarLinks(): SideLink[] {
  const type = useMemo(() => {
    const auth = localStorage.getItem("auth");
    return auth
      ? {
          userType: JSON.parse(auth)?.userType,
          organizationType: JSON.parse(auth)?.organizationType,
        }
      : "";
  }, []);

  return useMemo(() => {
    let routes: SideLink[] = [];

    switch (type.userType) {
      case "systemadmin":
        routes = [
          {
            title: "Organizations",
            href: "/",
            icon: <LayoutDashboard size={25} />,
          },
          { title: "Tasks", href: "/tasks", icon: <ListChecks size={25} /> },
          {
            title: "Documents",
            href: "/documents",
            icon: <FolderOpen size={25} />,
          },
          {
            title: "Buildings",
            href: "/buildings",
            icon: <Building2 size={25} />,
          },
          {
            title: "Incident",
            href: "/incidents",
            icon: <HardHat size={25} />,
          },
          { title: "Jobs", href: "/jobs", icon: <Briefcase size={25} /> },
          { title: "Users", href: "/users", icon: <Users size={25} /> },
        ];
        break;
      case "superadmin":
        routes = [
          { title: "Clients", href: "/", icon: <Users size={25} /> },
          { title: "Tasks", href: "/tasks", icon: <ListChecks size={25} /> },
          {
            title: "Documents",
            href: "/documents",
            icon: <FolderOpen size={25} />,
          },
          {
            title: "Buildings",
            href: "/buildings",
            icon: <Building2 size={25} />,
          },
          {
            title: "Contractors",
            href: "/contractors",
            icon: <Users size={25} />,
          },
          { title: "Resident", href: "/resident", icon: <HardHat size={25} /> },
          { title: "Jobs", href: "/jobs", icon: <Briefcase size={25} /> },
          { title: "Users", href: "/users", icon: <Users size={25} /> },
        ];
        break;
      case "admin":
        routes =
          type.organizationType === "client"
            ? [
                {
                  title: "Tasks",
                  href: "/tasks",
                  icon: <ListChecks size={25} />,
                },
                {
                  title: "Documents",
                  href: "/documents",
                  icon: <FolderOpen size={25} />,
                },
                {
                  title: "Buildings",
                  href: "/buildings",
                  icon: <Building2 size={25} />,
                },
                {
                  title: "Contractors",
                  href: "/contractors",
                  icon: <Users size={25} />,
                },
                { title: "Jobs", href: "/jobs", icon: <Briefcase size={25} /> },
                { title: "Users", href: "/users", icon: <Users size={25} /> },
              ]
            : [
                { title: "Clients", href: "/", icon: <Users size={25} /> },
                {
                  title: "Tasks",
                  href: "/tasks",
                  icon: <ListChecks size={25} />,
                },
                {
                  title: "Documents",
                  href: "/documents",
                  icon: <FolderOpen size={25} />,
                },
                {
                  title: "Buildings",
                  href: "/buildings",
                  icon: <Building2 size={25} />,
                },
                {
                  title: "Contractors",
                  href: "/contractors",
                  icon: <Users size={25} />,
                },
                { title: "Jobs", href: "/jobs", icon: <Briefcase size={25} /> },
                { title: "Users", href: "/users", icon: <Users size={25} /> },
              ];
        break;

      case "resident":
        routes = [
          { title: "Tasks", href: "/tasks", icon: <ListChecks size={25} /> },
          {
            title: "Documents",
            href: "/documents",
            icon: <FolderOpen size={25} />,
          },
          {
            title: "Feedback and Complaints",
            href: "/feedback",
            icon: <FolderOpen size={25} />,
          },
        ];
        break;
      case "standard":
        routes = [
          { title: "Tasks", href: "/tasks", icon: <ListChecks size={25} /> },
          {
            title: "Documents",
            href: "/documents",
            icon: <FolderOpen size={25} />,
          },
          { title: "Jobs", href: "/jobs", icon: <Briefcase size={25} /> },
          {
            title: "Buildings",
            href: "/buildings",
            icon: <Building2 size={25} />,
          },
          {
            title: "Incident",
            href: "/incidents",
            icon: <HardHat size={25} />,
          },
        ];
        break;
      case "contractor":
        routes = [
          { title: "Jobs", href: "/jobs", icon: <Briefcase size={25} /> },
          {
            title: "Documents",
            href: "/documents",
            icon: <FolderOpen size={25} />,
          },
        ];
        break;
      case "stakeholder":
        routes = [
          { title: "Tasks", href: "/tasks", icon: <ListChecks size={25} /> },
          {
            title: "Documents",
            href: "/documents",
            icon: <FolderOpen size={25} />,
          },
          {
            title: "Feedback and Complaints",
            href: "/feedback",
            icon: <FolderOpen size={25} />,
          },
        ];
        break;
      default:
        routes = [];
        break;
    }

    return routes;
  }, [type]);
}
