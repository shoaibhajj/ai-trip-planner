
import { Button } from "../ui/button";
import { Link } from "react-router";
import { useUser } from "@clerk/clerk-react";

function Hero() {
  const { user } = useUser();
  return (
    <div className="flex flex-col items-center md:mx-56 gap-9">
      <h1 className="font-extrabold text-2xl md:text-[45px] text-center mt-16">
        <span className="text-primary p-5 md:p-0 ">
          Discover Your Next Adenture with AI:
        </span>{" "}
        Personalize Itineraries at Your Fingertips
      </h1>
      <p className="text-gray-500 text-xl text-center  md:text-nowrap ">
        Your personal trip planner and travel curator, creating custom
        itineraries tailored to your interests and budget.
      </p>
      {user ? (
        <Link to={"/create-trip"}>
          <Button className="hover:scale-105 transition-all">
            {" "}
            Get Started, It's Free
          </Button>
        </Link>
      ) : (
        <Link to={"/signIn"}>
          <Button className="hover:scale-105 transition-all">
            {" "}
            Get Started, It's Free
          </Button>
        </Link>
      )}

      <img src="/landing.PNG" className="" alt="landing" />
    </div>
  );
}

export default Hero;
