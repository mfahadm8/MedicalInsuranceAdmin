import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import useIsCollapsed from "@/hooks/use-is-collapsed";
import ProtectedRoute from "@/components/utilities/ProtectedRoutes";
import { AuthContextProvider } from "@/components/utilities/AuthProvider";

export default function AppShell() {
  const [isCollapsed, setIsCollapsed] = useIsCollapsed();
  return (
    <AuthContextProvider>
      <ProtectedRoute>
        <div className="relative h-full overflow-hidden bg-background">
          {/* <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} /> */}
          <main
            id="content"
            className={`overflow-x-hidden pt-16 transition-[margin] md:overflow-y-hidden md:pt-0   h-full`}
          >
            <Outlet />
          </main>
        </div>
      </ProtectedRoute>
    </AuthContextProvider>
  );
}
