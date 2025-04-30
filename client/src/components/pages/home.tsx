import { Button } from "@/components/ui/button";
import { useUserStore } from "@/store";
import { Link } from "react-router";
import SignInButton from "../sign-in-button";

export default function Home() {
  const { user } = useUserStore();

  return (
    <div className="grid items-center justify-items-center min-h-[80dvh] p-8  gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] items-center justify-center ">
        <h1 className="text-5xl font-black">
          Ask Anything. Get Answers Instantly.
        </h1>
        <h3>
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
                Start chatting
              </Button>
            </Link>
          </div>
        )}
        <SignInButton />
      </main>
    </div>
  );
}
