import type { IHotelData } from "@/interfaces";
import type { DocumentData } from "firebase/firestore";
import { Link } from "react-router";

function Hotels({ trip }: DocumentData) {
  console.log(trip?.tripData?.hotels);

  return (
    <div>
      <h2 className="font-bold text-xl mt-5">Hotel Recommendation</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-3">
        {trip?.tripData?.hotels?.map((hotel: IHotelData, index: string) => (
          <Link
            to={`https://www.google.com/maps/search/?api=1&query=${hotel?.name}@${hotel?.coordinates?.latitude},${hotel?.coordinates?.longitude}`}
            target="_blank"
            key={index}
          >
            <div className="hover:scale-105 transition-all cursor-pointer">
              <img
                src={hotel?.imageUrl ? hotel?.imageUrl : "/imgPlaceholder.png"}
                alt=""
                className="rounded-xl h-[200px] w-full object-cover"
              />
              <div className="my-3 flex flex-col gap-2 ">
                <h2 className="font-medium ">{hotel?.name}</h2>
                <h2 className="font-xs text-gray-500 ">📍 {hotel?.address}</h2>
                <div className="flex gap-2 text-nowrap overflow-hidden text-ellipsis">
                  💃🏻
                  {hotel?.amenities.map((item, index) => (
                    <h2
                      key={index}
                      className="font-xs text-sm  text-primary text-start overflow-hidden "
                    >
                      {" "}
                      {item},
                    </h2>
                  ))}
                </div>

                <h2 className="text-sm  ">💰 {hotel?.priceRange}</h2>
                <h2 className="text-sm  ">⭐ {hotel?.rating}</h2>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
