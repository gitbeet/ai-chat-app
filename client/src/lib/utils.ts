import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useUserStore } from "@/store";

import { redirect } from "react-router";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function protectedRouteLoader() {
  const user = useUserStore.getState().user;
  if (!user) {
    return redirect("/");
  }
  return {};
}
