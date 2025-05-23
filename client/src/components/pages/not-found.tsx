import { useNavigate } from "react-router";
import { Button } from "../ui/button";
import { LucideArrowLeft, LucideHome } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="flex flex-col items-center justify-center gap-8 min-h-[80dvh]">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-center">404</h1>
        <p className="text-center">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
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
