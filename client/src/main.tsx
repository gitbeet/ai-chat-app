import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./components/pages/home";
import Layout from "./components/layout/layout";
import Chat from "./components/pages/chat";
import { ThemeProvider } from "./components/theme-provider";
import { protectedRouteLoader } from "./lib/utils";

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: Home },
      {
        path: "/chat",
        Component: Chat,
        loader: protectedRouteLoader,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
