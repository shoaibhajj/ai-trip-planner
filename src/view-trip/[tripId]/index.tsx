import { db } from "@/configs/firebase";
import { doc, getDoc, type DocumentData } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import Info from "../components/Info";
import Hotels from "../components/Hotels";
import PlacesToVisit from "../components/PlacesToVisit";
import { Loader2Icon } from "lucide-react";

function ViewTrip() {
  const { tripId, userEmail } = useParams();
  const [trip, setTrip] = useState<DocumentData>([]);
  const [loading, setLoading] = useState(false);

   useEffect(() => {
     window.scrollTo(0, 0);
   }, []);

  const GetTripData = async () => {
    setLoading(true);
    if (!userEmail || !tripId) {
      console.error("Missing userEmail or tripId");
      return null;
    }
    const docRef = doc(db, "AiTrips", userEmail, "trips", tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setTrip(docSnap.data());
      setLoading(false);
      return docSnap.data();
    } else {
      console.log("No such document!");
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    if (tripId && userEmail) {
      GetTripData();
    }
  }, [tripId, userEmail]);

  if (loading)
    return (
      <div className=" w-full text-center h-screen">
        <Loader2Icon className=" mx-auto my-50 animate-spin" />
      </div>
    );
  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      {trip ? (
        <>
          {/* Information Section */}
          <Info trip={trip} />
          {/* Recommended Hotels */}
          <Hotels trip={trip} />
          {/* Daily Plan */}
          <PlacesToVisit trip={trip} />
        </>
      ) : (
        <div className="w-full text-center h-screen mx-auto">
          <Loader2Icon className="mx-auto my-50 animate-spin" />
        </div>
      )}
    </div>
  );
}

export default ViewTrip;
