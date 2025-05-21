import { Button } from "@/components/ui/button";
import { Link } from "react-router";

function NotFound() {
  return (
    <div className="flex flex-col mt-50 text-center gap-10 text-2xl md:text-5xl">
      <h1 className="  text-primary  font-bold"> 404 Not Found Page</h1>
      <Button className="mx-auto w-fit  hover:scale-105 transition-all">
        <Link to={"/"} className=" ">
          Go Home Page
        </Link>
      </Button>
    </div>
  );
}

export default NotFound;
