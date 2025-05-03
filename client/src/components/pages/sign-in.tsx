import { useUserStore } from "@/store";
import { SignInForm } from "../sign-in-form";
import { useNavigate } from "react-router";

const SignIn = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  if (user) navigate("/");
  return (
    <main className="mt-16 max-w-[450px] mx-auto">
      <SignInForm />
    </main>
  );
};

export default SignIn;
