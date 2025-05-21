/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const amadeusClientId = import.meta.env.VITE_AMADEUS_API_KEY;
const amadeusClientSecret = import.meta.env.VITE_AMADEUS_API_SECRET;
const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined in environment variables.");
  throw new Error(
    "GEMINI_API_KEY is not defined in environment variables. The AI service cannot be initialized."
  );
}

if (!amadeusClientId || !amadeusClientSecret) {
  console.error("Amadeus API credentials are not defined.");
  throw new Error("Amadeus API credentials missing in environment variables.");
}

if (!pexelsApiKey) {
  console.error("PEXELS_API_KEY is not defined.");
  throw new Error("Pexels API key missing in environment variables.");
}

const ai = new GoogleGenAI({ apiKey });

const modelName = "gemini-1.5-flash-latest";

const generationConfig = {
  response_mime_type: "application/json",
  temperature: 0.3,
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

let amadeusAccessToken = "";
let amadeusTokenExpiry = 0;

async function fetchAmadeusAccessToken(): Promise<string> {
  const now = Date.now();

  if (amadeusAccessToken && now < amadeusTokenExpiry - 60000) {
    return amadeusAccessToken;
  }

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");
  params.append("client_id", amadeusClientId);
  params.append("client_secret", amadeusClientSecret);

  const res = await fetch(
    "https://test.api.amadeus.com/v1/security/oauth2/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch Amadeus access token");
  }

  const data = await res.json();

  amadeusAccessToken = data.access_token;
  amadeusTokenExpiry = now + data.expires_in * 1000;

  return amadeusAccessToken;
}

async function fetchAmadeusHotelImage(
  hotelName: string
): Promise<string | null> {
  try {
    const token = await fetchAmadeusAccessToken();

    const res = await fetch(
      `https://test.api.amadeus.com/v2/shopping/hotel-offers?hotelName=${encodeURIComponent(
        hotelName
      )}&page[limit]=1`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      console.warn("Amadeus hotel search failed", await res.text());
      return null;
    }

    const data = await res.json();

    const offers = data.data;
    if (offers && offers.length > 0) {
      const hotel = offers[0].hotel;
      if (hotel && hotel.media && hotel.media.length > 0) {
        return hotel.media[0].uri || null;
      }
    }
    return null;
  } catch (e) {
    console.warn("Amadeus fetch failed for:", hotelName, e);
    return null;
  }
}

async function fetchPexelsImage(query: string): Promise<string | null> {
  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(
      query
    )}&per_page=1&orientation=landscape`;

    const response = await fetch(url, {
      headers: {
        Authorization: pexelsApiKey,
      },
    });

    if (!response.ok) {
      console.warn(
        `Pexels API error: ${response.status} ${await response.text()}`
      );
      return null;
    }

    const data = await response.json();
    if (data.photos?.length > 0) {
      return data.photos[0].src.large || data.photos[0].src.medium;
    }

    return null;
  } catch (error) {
    console.warn("Pexels API request failed:", error);
    return null;
  }
}

function findNestedObjects(obj: any, targetKeys: string[]): any[] {
  let results: any[] = [];

  if (typeof obj !== "object" || obj === null) {
    return results;
  }

  const hasAllKeys = targetKeys.every((key) => key in obj);
  if (hasAllKeys) {
    results.push(obj);
    return results;
  }

  for (const key in obj) {
    if (typeof obj[key] === "object") {
      results = results.concat(findNestedObjects(obj[key], targetKeys));
    }
  }

  return results;
}

export const generateAiTripPlan = async (userProvidedPrompt: string) => {
  const exampleContent = {
    tripDetails: {
      location: "Bonn, Germany",
      duration: "3 Days",
      travelers: 2,
      budget: "Luxury",
      generalImageUrl: "Real_location_image_1",
    },
    hotels: [
      {
        name: "Hotel Dreesen",
        address: "Am Hof 1, 53111 Bonn, Germany",
        priceRange: "€300-€500 per night",
        description: "A 5-star hotel in a historic building",
        rating: 4.8,
        amenities: ["Spa", "Restaurant"],
        coordinates: {
          latitude: 50.7361,
          longitude: 7.0987,
        },
        imageUrl: "real_hotel_image_1",
      },
      {
        name: "Hotel Example 2",
        address: "Example Street 2, Bonn",
        priceRange: "€200-€300 per night",
        description: "Mid-range hotel with modern amenities",
        rating: 4.2,
        amenities: ["Wi-Fi", "Breakfast"],
        coordinates: {
          latitude: 50.735,
          longitude: 7.099,
        },
        imageUrl: "real_hotel_image_2",
      },
      {
        name: "Hotel Example 3",
        address: "Example Street 3, Bonn",
        priceRange: "€100-€200 per night",
        description: "Budget-friendly option",
        rating: 3.9,
        amenities: ["Wi-Fi", "Parking"],
        coordinates: {
          latitude: 50.737,
          longitude: 7.097,
        },
        imageUrl: "real_hotel_image_3",
      },
    ],
    itinerary: [
      {
        day: 1,
        activities: [
          {
            name: "Bonn Minster",
            description: "Historic church",
            imageUrl: "real_activity_image_1",
            coordinates: {
              latitude: 50.7348,
              longitude: 7.0987,
            },
            cost: "Free",
            duration: "1 hour",
            bestTime: "9:00 AM - 12:00 PM",
          },
          {
            name: "Beethoven House",
            description: "Museum dedicated to the composer",
            imageUrl: "real_activity_image_2",
            coordinates: {
              latitude: 50.7355,
              longitude: 7.0992,
            },
            cost: "€10",
            duration: "2 hours",
            bestTime: "10:00 AM - 02:00 PM",
          },
          {
            name: "3 ITEM",
            description: "Museum dedicated to the composer",
            imageUrl: "real_activity_image_2",
            coordinates: {
              latitude: 50.7355,
              longitude: 7.0992,
            },
            cost: "€10",
            duration: "2 hours",
            bestTime: "10:00 AM - 02:00 PM",
          },
        ],
      },
    ],
  };

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `Generate a travel plan in JSON format only (no additional text or notes) for location: ${userProvidedPrompt}.
Strictly use this exact structure:
${JSON.stringify(exampleContent, null, 2)}

Important rules:
1. Include minimum 3 hotels and 3 activities per day
2. Use exactly these field names for hotels: name, address, priceRange, description, rating, amenities, coordinates, imageUrl
3. Use exactly these field names for activities: name, description, imageUrl, coordinates, cost, duration, bestTime
4. Add 'generalImageUrl' to tripDetails with location placeholder
5. The root object must contain "tripDetails", "hotels", and "itinerary"
6. For imageUrl give real image or close to it, use pattern: real_hotel_image_1, real_activity_image_1, real_location_image_1
7. Do not include any additional text or explanations`,
        },
      ],
    },
  ];

  const requestConfig = {
    generationConfig,
    safetySettings,
  };

  try {
    const streamResponse = await ai.models.generateContentStream({
      model: modelName,
      contents,
      config: requestConfig,
    });

    let fullResponseText = "";
    for await (const chunk of streamResponse) {
      if (chunk && chunk.text && typeof chunk.text === "string") {
        fullResponseText += chunk.text;
      }
    }

    const jsonStart = fullResponseText.indexOf("{");
    const jsonEnd = fullResponseText.lastIndexOf("}") + 1;
    const jsonOnly = fullResponseText.slice(jsonStart, jsonEnd);

    let tripJson;
    try {
      tripJson = JSON.parse(jsonOnly);
    } catch (e) {
      console.error("Failed to parse AI response as JSON:", e);
      throw new Error("Invalid JSON from AI response");
    }

    // Fetch general location image
    if (tripJson.tripDetails?.location) {
      const locationImage = await fetchPexelsImage(
        tripJson.tripDetails.location
      );
      if (locationImage) {
        tripJson.tripDetails.generalImageUrl = locationImage;
      }
    }

    // Process hotels
    const hotelCandidates = findNestedObjects(tripJson, [
      "name",
      "address",
      "priceRange",
    ]);
    if (hotelCandidates.length < 3) {
      console.warn("AI generated fewer than 3 hotels");
    }

    for (const hotel of hotelCandidates) {
      let hotelImage = await fetchAmadeusHotelImage(
        `${hotel.name} ${tripJson.tripDetails?.location || ""}`
      );

      if (!hotelImage) {
        hotelImage = await fetchPexelsImage(
          `${hotel.name} ${tripJson.tripDetails?.location || ""} exterior`
        );
      }

      if (hotelImage) {
        hotel.imageUrl = hotelImage;
      }
    }

    // Process activities
    const activityCandidates = findNestedObjects(tripJson, [
      "name",
      "description",
      "duration",
    ]);
    for (const activity of activityCandidates) {
      if (activity.imageUrl?.startsWith("real_activity_image_")) {
        const activityImage = await fetchPexelsImage(
          `${activity.name} ${tripJson.tripDetails?.location || ""}`
        );
        if (activityImage) {
          activity.imageUrl = activityImage;
        }
      }
    }

    // Validate activities per day
    if (tripJson.itinerary) {
      for (const day of tripJson.itinerary) {
        if (day.activities?.length < 2) {
          console.warn(`Day ${day.day} has fewer than 2 activities`);
        }
      }
    }

    return JSON.stringify(tripJson, null, 2);
  } catch (error) {
    console.error("Error generating trip plan:", error);
    throw error;
  }
};
