import { useEffect } from "react";
import { Button } from "../ui/button";
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router";

function Header() {
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <div className="p-2 shadow-sm flex justify-between items-center px-5 gap-20">
      <Link to={ "/"}>
        <img src="/logo.svg" />
      </Link>
      <div className="flex items-center  gap-5">
        {user ? (
          <>
            <Link to={"/create-trip"}  className="hidden md:block">
              <Button className="rounded-full   " variant={"outline"} >
                + Create Trip
              </Button>
            </Link>
            <Link to={"/my-trips"}>
              <Button className="rounded-full " variant={"outline"}>
                My Trips
              </Button>
            </Link>
          </>
        ) : (
          <SignInButton mode="modal">
            <Button>Sign In</Button>
          </SignInButton>
        )}

        {user && <UserButton />}
      </div>
    </div>
  );
}

export default Header;
