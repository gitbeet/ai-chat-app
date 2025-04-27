import { LucideSprout } from "lucide-react";
import { useUserStore } from "@/store";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { Link, useNavigate } from "react-router";

const LayoutNav = () => {
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const fakeSignUp = () => setUser({ name: "John", email: "john@email.com" });
  const handleSignOut = async () => {
    navigate("/");
    setUser(null);
    useUserStore.persist.clearStorage();
  };
  return (
    <nav className="px-4 py-2 max-w-[1200px] flex items-center justify-between mx-auto">
      <Link
        to={"/"}
        className="flex items-center"
      >
        <LucideSprout className="text-primary" />
        <span className="text-lg font-light relative top-0.5">sprout</span>
      </Link>
      <div className="flex gap-2 items-end">
        {!user && <Button onClick={fakeSignUp}>Fake sign up</Button>}
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
        <ModeToggle />
      </div>
    </nav>
  );
};

export default LayoutNav;
