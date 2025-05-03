import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store";
import { LucideMessageSquareShare } from "lucide-react";
import { Link } from "react-router";

export default function Home() {
  const { user } = useUserStore();

  return (
    <div className="grid items-center justify-items-center min-h-[80dvh] p-8  gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center justify-center ">
        <h1 className="text-5xl font-black text-center">
          Ask Anything. Get Answers Instantly.
        </h1>
        <h3 className="text-center">
          Experience next-gen AI conversations—fast, accurate, and always
          learning.
        </h3>

        {user && (
          <div className="grid place-content-center gap-4">
            <Link to={"/chat"}>
              <Button
                variant={"default"}
                size={"lg"}
              >
                <LucideMessageSquareShare />
                Start chatting
              </Button>
            </Link>
          </div>
        )}
        {!user && (
          <div className="space-x-2">
            <Link to={"/sign-up"}>
              <Button>Sign up</Button>
            </Link>
            <Link to={"/sign-in"}>
              <Button variant={"outline"}>Sign in</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
