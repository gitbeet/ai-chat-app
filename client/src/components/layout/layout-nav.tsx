import { LucideBotMessageSquare } from "lucide-react";
import { useUserStore } from "@/store";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router";

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
  return (
    <nav className="px-4 py-4 max-w-[1200px] flex items-center justify-between mx-auto w-full sticky top-0 bg-background ">
      <Link to={"/"}>
        <LucideBotMessageSquare size={24} />
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
        {!user && (
          <Link to={"/sign-in"}>
            <Button variant={"outline"}>Sign in</Button>
          </Link>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
};

export default LayoutNav;
