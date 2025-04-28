import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./components/pages/home";
import Layout from "./components/layout/layout";
import Chat from "./components/pages/chat";
import { ThemeProvider } from "./components/theme-provider";
// import { protectedRouteLoader } from "./lib/utils";
import { useUserStore } from "./store";

const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: Home },
      {
        path: "/chat",
        Component: Chat,
        // loader: protectedRouteLoader,
      },
    ],
  },
]);

const App = () => {
  const { fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser(); // Fetch the user on app load
  }, [fetchUser]);

  return <RouterProvider router={router} />;
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="system">
      <App />
    </ThemeProvider>
  </StrictMode>
);
