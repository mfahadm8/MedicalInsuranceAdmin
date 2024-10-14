import { createBrowserRouter } from "react-router-dom";
import GeneralError from "./pages/errors/general-error";
import NotFoundError from "./pages/errors/not-found-error";
import MaintenanceError from "./pages/errors/maintenance-error";
import UnauthorisedError from "./pages/errors/unauthorised-error.tsx";
const router = createBrowserRouter([
  // Auth routes
  {
    path: "/sign-in",
    lazy: async () => ({
      Component: (await import("./pages/auth/sign-in")).default,
    }),
  },

  {
    path: "/sign-up",
    lazy: async () => ({
      Component: (await import("./pages/auth/sign-up")).default,
    }),
  },
  {
    path: "/forgot-password",
    lazy: async () => ({
      Component: (await import("./pages/auth/forgot-password")).default,
    }),
  },
  {
    path: "/update-password",
    lazy: async () => ({
      Component: (await import("./pages/auth/update-password")).default,
    }),
  },
  // Main routes wrapped with ProtectedRoute
  {
    path: "/",
    lazy: async () => {
      const AppShell = await import("./components/shared/app-shell.tsx");
      return { Component: AppShell.default };
    },
    // errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import("./pages/documents")).default,
        }),
      },

      {
        path: "documents",
        lazy: async () => ({
          Component: (await import("./pages/documents")).default,
        }),
      },
    ],
  },

  // Error routes
  { path: "/500", Component: GeneralError },
  { path: "/404", Component: NotFoundError },
  { path: "/503", Component: MaintenanceError },
  { path: "/401", Component: UnauthorisedError },

  // Fallback 404 route
  { path: "*", Component: NotFoundError },
]);

export default router;
