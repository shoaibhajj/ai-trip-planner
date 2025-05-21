import { db } from "@/configs/firebase";
import { useUser } from "@clerk/clerk-react";
import { collection, getDocs, type DocumentData } from "firebase/firestore";

import { useEffect, useState } from "react";
import TripCardItem from "./TripCardItem";

function MyTrips() {
  const [loading, setLoading] = useState(false);
  console.log(loading);

  const { user } = useUser();
  const [trips, setTrips] = useState<DocumentData>([]);

  const getUserTrips = async () => {
    setLoading(true);
    if (!user) {
      setLoading(false);
      return null;
    }

    if (!user?.primaryEmailAddress?.emailAddress) {
      console.error("Missing user please sign in again");
      setLoading(false);
      return null;
    }

    const querySnapshot = await getDocs(
      collection(
        db,
        "AiTrips",
        user?.primaryEmailAddress?.emailAddress,
        "trips"
      )
    );
    setTrips([]);
    querySnapshot.forEach((doc) => {
      setTrips((prev: unknown) => [
        ...(Array.isArray(prev) ? prev : []),
        doc.data(),
      ]);
      console.log(doc.id, " => ", doc.data());
      console.log("trips", trips);
    });
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      getUserTrips();
    }
  }, [user]);

  return (
    <div className=" sm:p-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">My Trips</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mt-10">
        {trips.length > 0
          ? trips.map((trip: DocumentData, index: number) => (
              <TripCardItem trip={trip} key={trip.id || index} />
            ))
          : Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="h-[220px] w-full bg-slate-200 animate-pulse rounded-xl"
              />
            ))}
      </div>
    </div>
  );
}

export default MyTrips;
