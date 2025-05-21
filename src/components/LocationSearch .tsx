import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Loader2Icon } from "lucide-react";
import type { IPlace } from "@/interfaces";

interface IProps {
  setPlace: (val: IPlace | null) => void;
}

const LocationSearch = ({ setPlace }: IProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<IPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLUListElement | null>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  const search = async (val: string) => {
    if (val.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        "https://api.locationiq.com/v1/autocomplete",
        {
          params: {
            key: import.meta.env.VITE_LOCATION_IQ_API_KEY,
            q: val,
            limit: 10,
            format: "json",
          },
        }
      );
      setResults(res.data);
    } catch (err) {
      console.error("LocationIQ error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setPlace(null);

    // Debounce the search
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      search(val);
    }, 500); 
  };

  const handleSelect = (place: IPlace) => {
    setQuery(place.display_name);
    setPlace(place);
    setResults([]);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!listRef.current?.contains(e.target as Node)) {
        setResults([]);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full mx-auto">
      <div className="flex items-center gap-1">
        <input
          value={query}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          placeholder="Search location..."
        />
        {loading && <Loader2Icon className="animate-spin transition-all" />}
      </div>

      {results.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-10 w-full bg-white border border-gray-200 rounded shadow-md max-h-60 overflow-y-auto"
        >
          {results.map((place, index) => (
            <li
              key={index}
              onClick={() => handleSelect(place)}
              className="w-full p-2 hover:bg-blue-100 cursor-pointer"
            >
              {place.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationSearch;
