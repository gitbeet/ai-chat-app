import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { LucideArrowLeft, LucideHome } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center gap-8 h-[60dvh]">
      <h1 className="text-5xl font-black">404</h1>
      <p>Oops! The page you're looking for doesn't exist or has been moved.</p>
      <div className="space-x-2">
        <Button
          className="w-fit"
          onClick={() => navigate(-1)}
        >
          <LucideArrowLeft />
          Go back
        </Button>
        <Button
          variant={"outline"}
          className="w-fit"
          onClick={() => navigate("/")}
        >
          <LucideHome />
          Go Home
        </Button>
      </div>
    </main>
  );
};

export default NotFound;
