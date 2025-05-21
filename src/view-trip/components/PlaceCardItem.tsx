import { Button } from "@/components/ui/button";
import type { IPlaceSuggestions } from "@/interfaces";
import { FaMapLocationDot } from "react-icons/fa6";
import { Link } from "react-router";

function PlaceCardItem({ place }: { place: IPlaceSuggestions }) {
  return (
    <Link
      to={`https://www.google.com/maps/search/?api=1&query=${place?.name}@${place?.coordinates?.latitude},${place?.coordinates?.longitude}`}
      target="_blank"
    >
      <div className="border rounded-xl p-3 mt-2 flex gap-2 hover:scale-105 transition-all hover:shadow-md cursor-pointer">
        <img
          src={place?.imageUrl ? place?.imageUrl : "/imgPlaceholder.png"}
          alt=""
          className="w-[150px] h-[150px] rounded-xl object-cover./"
        />
        <div>
          <h2 className="font-bold text-lg ">{place?.name}</h2>
          <p className="text-sm text-gray-400">{place?.description}</p>
          <h2 className="mt-2">🕑 {place?.duration}</h2>
          <h2>💸 {place?.cost}</h2>
          <Button className="mt-2" size={"sm"} variant={"outline"}>
            <FaMapLocationDot />
          </Button>
        </div>
      </div>
    </Link>
  );
}

export default PlaceCardItem;
