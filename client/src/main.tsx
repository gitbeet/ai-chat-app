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
import NotFound from "./components/pages/not-found";
import SignUp from "./components/pages/sign-up";
import SignIn from "./components/pages/sign-in";
import { Toaster } from "sonner";
import { LucideBadgeAlert } from "lucide-react";

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
      {
        path: "/sign-in",
        Component: SignIn,
      },
      {
        path: "/sign-up",
        Component: SignUp,
      },
      {
        path: "*",
        Component: NotFound,
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
      <Toaster
        position="bottom-center"
        icons={{
          error: <LucideBadgeAlert className="h-5 w-5" />,
        }}
        toastOptions={{
          duration: 5000,
          classNames: {
            default:
              "!bg-card !border !border-border !text-card-foreground !gap-1.5",
            error: "!text-destructive",
            success: "!text-teal-500",
            content: "text-base",
          },
        }}
      />
    </ThemeProvider>
  </StrictMode>
);
