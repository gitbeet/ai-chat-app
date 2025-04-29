import { useUserStore } from "@/store";
import { Button } from "./ui/button";

const SignInButton = ({ text = true }: { text?: boolean }) => {
  const { user } = useUserStore();
  return !user ? (
    <a href={`${import.meta.env.VITE_API_URL}/auth/google`}>
      <Button
        variant={"outline"}
        className={!text ? "!p-0 aspect-square" : ""}
      >
        <div className="flex items-center gap-2">
          <img
            src="../../public/google-logo.svg"
            className="w-4 h-4"
          />
          {text && <> Sign in with Google</>}
        </div>
      </Button>
    </a>
  ) : null;
};

export default SignInButton;
