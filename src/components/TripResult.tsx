import { useLocation } from "react-router";


const TripResult = () => {
  const location = useLocation();
  const tripData = location.state?.tripData;

  if (!tripData) {
    return (
      <p className="p-5 text-red-500">
        No trip data found. Please go back and generate a plan.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Your AI-Generated Trip Plan</h1>
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-[80vh] text-sm">
        {JSON.stringify(tripData, null, 2)}
      </pre>
    </div>
  );
};

export default TripResult;
