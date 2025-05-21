export interface IPlace {
  place_id: string;
  display_name: string;
}

export interface IFormData {
  location: IPlace;
  budget: string;
  numberOfDays: string;
  traveler: string;
}

interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface IHotelData {
  name: string;
  address: string;
  priceRange: string;
  rating: string;
  coordinates: ICoordinates;
  amenities: string[];
  imageUrl: string;
}

export interface IPlaceSuggestions {
  bestTime: string;
  cost: string;
  description: string;
  duration: string;
  imageUrl: string;
  name: string;
  coordinates: ICoordinates;
}
