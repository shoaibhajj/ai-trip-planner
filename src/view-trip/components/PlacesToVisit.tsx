import type { DocumentData } from "firebase/firestore";
import PlaceCardItem from "./PlaceCardItem";
import type { IPlaceSuggestions } from "@/interfaces";

function PlacesToVisit({ trip }: DocumentData) {
  return (
    <div>
      <h2 className="font-bold text-lg mt-10">Places To Visit</h2>

      <div>
        {trip?.tripData?.itinerary?.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (item: { day: string; activities: any }, index: string) => {
            return (
              <div key={index} className="mt-5">
                <h2 className="font-medium text-lg">Day {item?.day}</h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {item?.activities?.map(
                    (place: IPlaceSuggestions, index: string) => (
                      <div key={index}>
                        <h2 className="font-medium text-sm text-primary">
                          Best Time to Visit : {place?.bestTime}
                        </h2>
                        <div className="my-3">
                          <PlaceCardItem place={place} />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export default PlacesToVisit;
