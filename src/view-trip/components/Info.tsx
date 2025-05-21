import { Button } from "@/components/ui/button";
import type { DocumentData } from "firebase/firestore";

import { IoIosSend } from "react-icons/io";
function Info({ trip }: DocumentData) {
  return (
    <div>
      <img
        src={
          trip?.tripData?.tripDetails?.generalImageUrl
            ? trip?.tripData?.tripDetails?.generalImageUrl
            : "/imgPlaceholder.png"
        }
        className="h-[350px] w-full object-cover rounded-xl"
      />
      <div className="flex  justify-between items-center gap-5">
        <div className="my-5 flex flex-col gap-2">
          <h2 className="font-bold text-2xl">
            {trip?.userSelection?.location?.display_name}
          </h2>
          <div className="flex flex-col md:flex-row gap-5">
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-sm md:text-lg">
              📅 {trip?.userSelection?.numberOfDays} Days
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-sm md:text-lg">
              💰 {trip?.userSelection?.budget} Budget
            </h2>
            <h2 className="p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-sm md:text-lg">
              🧑🏻‍🤝‍🧑🏻 No. Of Traveler: {trip?.userSelection?.traveler}
            </h2>
          </div>
        </div>

        <Button>
          <IoIosSend />
        </Button>
      </div>
    </div>
  );
}

export default Info;
