import { useUserStore } from "@/store";
import { Button } from "./ui/button";
import googleLogo from "../../public/google-logo.svg";

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
            src={googleLogo}
            className="w-4 h-4"
          />
          {text && <> Sign in with Google</>}
        </div>
      </Button>
    </a>
  ) : null;
};

export default SignInButton;
