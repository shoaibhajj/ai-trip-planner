import type { DocumentData } from "firebase/firestore";
import { Link } from "react-router";

function TripCardItem({ trip }: DocumentData) {
  return (
    <Link to={`/view-trip/${trip?.userEmail}/${trip?.id}`}>
      <div className="hover:scale-105 transition-all ">
        <img
          src={
            trip?.tripData?.tripDetails?.generalImageUrl
              ? trip?.tripData?.tripDetails?.generalImageUrl
              : "/imgPlaceholder.png"
          }
          alt=""
          className="object-cover rounded-xl h-[220px]"
        />
        <div>
          <h2 className="font-bold text-lg">
            {trip?.userSelection?.location?.display_name}
          </h2>
          <h2 className="text-md text-gray-500">
            {trip?.userSelection?.numberOfDays} Days trip with{" "}
            {trip?.userSelection?.budget} Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default TripCardItem;
