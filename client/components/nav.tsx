"use client";

import { useUserStore } from "@/store";
import Link from "next/link";
import { Button } from "./ui/button";

const Nav = () => {
  const { user, setUser } = useUserStore();

  const fakeSignUp = () => setUser({ name: "John", email: "john@email.com" });
  const handleSignOut = async () => {
    setUser(null);
    useUserStore.persist.clearStorage();
  };
  return (
    <nav className="px-4 py-2 flex items-center justify-between">
      <Link href={"/"}>
        <p className="font-light text-lg">
          chat<span className="font-black"> /\i</span>
        </p>
      </Link>
      {!user && <Button onClick={fakeSignUp}>Fake sign up</Button>}
      {user && (
        <div className="flex gap-2 items-center">
          <p>
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
    </nav>
  );
};

export default Nav;
