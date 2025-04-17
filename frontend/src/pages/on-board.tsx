import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Onboard() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-background animate-in fade-in-0 slide-in-from-bottom-3 duration-500">
      <div className="max-w-md w-full text-center space-y-6">
        <h1 className="text-2xl font-bold">
          <img src="/chatify.svg" className="size-16 mx-auto" />
          Welcome to the Chatify
        </h1>
        <p className="text-muted-foreground">
          It looks like you haven't set up your profile yet. Please complete
          your profile setup to continue.
        </p>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => navigate("/profile-setup")}
            className="hover:cursor-pointer"
          >
            Set Up Profile
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
            className="hover:cursor-pointer"
          >
            Skip for Now
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Onboard;
