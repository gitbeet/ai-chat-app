import { LucideMessageSquareCode } from "lucide-react";
import { useUserStore } from "@/store";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router";
import SignInButton from "../sign-in-button";

const LayoutNav = () => {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    fetch(`${import.meta.env.VITE_API_URL}/auth/sign-out`, {
      credentials: "include",
    })
      .then(() => setUser(null))
      .catch((e) => console.log(e))
      .finally(() => navigate("/"));
  };
  console.log("USER: ", user);
  return (
    <nav className="px-4 py-2 max-w-[1200px] flex items-center justify-between mx-auto">
      <Link
        to={"/"}
        // className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500"
      >
        <LucideMessageSquareCode size={24} />
      </Link>
      <div className="flex gap-2 items-end">
        {user && (
          <div className="flex gap-2 items-center">
            <p className="text-sm">
              Hi, <b>{user?.name}</b>
            </p>
            <Button
              onClick={handleSignOut}
              variant={"outline"}
            >
              Sign out
            </Button>
          </div>
        )}
        <SignInButton text={false} />
        <ModeToggle />
      </div>
    </nav>
  );
};

export default LayoutNav;
