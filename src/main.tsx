import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/utilities/ThemeProvider";
import { Amplify } from "aws-amplify";
import { AWS_COGNITO } from "./config";
import router from "@/router";
import api from "./components/utilities/api";
import {
  QueryClient,
  QueryClientProvider,
  QueryFunctionContext,
} from "react-query";
import "./global.scss";
import "@/index.css";

Amplify.configure({
  Auth: {
    Cognito: AWS_COGNITO,
  },
});

// Create the QueryClient with type-safe options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      // refetchOnReconnect: false,
      // retry: false,
      // staleTime: twentyFourHoursInMs,
      // Use Axios for queries
      queryFn: async ({ queryKey }: QueryFunctionContext<any>) => {
        const { data } = await api.get(queryKey[0]);
        return data;
      },
    },
    mutations: {
      // Use Axios for mutations
      mutationFn: async ({ mutationKey, variables }: any) => {
        const { data } = await api.post(mutationKey[0], variables);
        return data;
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </React.StrictMode>
  </QueryClientProvider>
);
