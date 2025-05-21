import LocationSearch from "@/components/LocationSearch ";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectBudgetOptions, SelectTravelesList } from "@/constants/options";
import type { IFormData, IPlace } from "@/interfaces";
import { toast } from "sonner";

import  { useEffect, useState } from "react";

import { generateAiTripPlan } from "@/configs/AiModel";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/configs/firebase";
import { Loader2Icon } from "lucide-react";
import { useNavigate } from "react-router";
// import GooglePlacesAutocomplete from "react-google-places-autocomplete";

function CreateTrip() {
  // const [place, setPlace] = useState<IPlace | null>();
  const [formData, setFromData] = useState<IFormData>();
  const [selectedBudget, setselectedBudget] = useState("");
  const [selectedTraveler, setselectedTraveler] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const navigate = useNavigate();

  const handleInputChange = (name: string, val: string | IPlace) => {
    setFromData({
      ...formData!,
      [name]: val,
    });
  };

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onGenerateTrip = async () => {
    if (!user) {
      navigate("/signIn");
    }

    setLoading(true);
    if (
      Number(formData?.numberOfDays) > 5 ||
      !formData?.numberOfDays ||
      !formData?.location ||
      !formData?.budget ||
      !formData?.traveler
    ) {
      toast("Please Fill All Details to continue!");
      setLoading(false);
      return;
    }
    toast("It takes some Time ,Please Don't refresh the page ");

    const finalPrompt = `Generate Travel Plan for Location: ${formData?.location?.display_name} for ${formData?.numberOfDays} Days for ${formData?.traveler} with a ${formData?.budget} budget. 
  Provide a JSON response with:
  - Hotel options (name, address, price range, description, rating)
  - Day-by-day itinerary (place names, descriptions, best times to visit, estimated costs)
  - Include geo coordinates for all locations
  - For hotels, include price ranges and amenities
  - For activities, include duration and any admission fees`;

    console.log(finalPrompt);

    const result = await generateAiTripPlan(finalPrompt);

    console.log("result before save in DB", result);

    const userData = localStorage.getItem("user");
    const localStorageUser = userData ? JSON.parse(userData) : null;
    if (result && (user || localStorageUser)) {
      const docId = Date.now().toString();
      const email = user?.primaryEmailAddress?.emailAddress || docId;

      const userDocRef = doc(db, "AiTrips", email);

      await setDoc(doc(userDocRef, "trips", docId), {
        userSelection: formData,
        tripData: JSON.parse(result),

        userEmail: user?.primaryEmailAddress?.emailAddress,
        userName: user?.fullName,

        id: docId,
      });
      setLoading(false);
      navigate(
        `/view-trip/${user?.primaryEmailAddress?.emailAddress}/${docId}`
      );
    }
   setLoading(false);
    return result;
  };

  return (
    <div className="px-5 sm:px-10 md:px-32 lg:px-56 xl:px-72 mt-10">
      <h2 className="font-bold text-3xl text-center md:text-start">
        Tell us your travel preferences ⛺🌴
      </h2>
      <p className="mt-8 md:mt-3 text-gray-500 text-xl text-center md:text-start ">
        Just provide some basic information, and our AI trip planner  will generate
        a customized itinerary based on your preferences.
      </p>

      <div className="mt-20 flex flex-col gap-9">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is your destination of choice?
          </h2>
          {/* <GooglePlacesAutocomplete apiKey="AIzaSyBQgDEMZtBjiD8u2USEpVt4cTVgNTXbHk4" /> */}
          <LocationSearch
            setPlace={(value) => handleInputChange("location", value!)}
          />
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip
          </h2>
          <Input
            placeholder="Ex.3"
            type="number"
            onChange={(e) => handleInputChange("numberOfDays", e.target.value)}
          />
        </div>

        <div>
          <h2 className="text-xl my-3 font-medium">What is your Budget ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
            {SelectBudgetOptions.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  handleInputChange("budget", item.title);
                  setselectedBudget(item.title);
                }}
                className={`p-4 border rounded-lg cursor-pointer hover:scale-105 transition-all  hover:shadow-lg
                  ${selectedBudget === item.title && "border-primary border-2"}
                  `}
              >
                <h2 className="text-4xl ">{item.icon}</h2>
                <h2 className="font-bold text-lg ">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            Who do you plan on traveling with on your next adventure?
          </h2>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 mt-5 `}>
            {SelectTravelesList.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  handleInputChange("traveler", item.people);
                  setselectedTraveler(item.title);
                }}
                className={`p-4 border rounded-lg cursor-pointer hover:scale-105 transition-all  hover:shadow-lg ${
                  selectedTraveler === item.title && "border-primary border-2"
                }`}
              >
                <h2 className="text-4xl ">{item.icon}</h2>
                <h2 className="font-bold text-lg ">{item.title}</h2>
                <h2 className="text-sm text-gray-500">{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className=" flex my-20 justify-end">
        {user ? (
          <Button disabled={loading} className="" onClick={onGenerateTrip}>
            {loading ? (
              <Loader2Icon className="animate-spin" />
            ) : (
              <>Generate Trip</>
            )}
          </Button>
        ) : (
          <SignInButton mode="modal">
            <Button disabled={loading} className="" onClick={onGenerateTrip}>
              {loading ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <>Generate Trip</>
              )}
            </Button>
          </SignInButton>
        )}
      </div>
    </div>
  );
}

export default CreateTrip;
