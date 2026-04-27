"use client";

import { useCity } from "@/context/CityContext";
import { City } from "@/data/cities";

const popularCities: City[] = [
  { name: "New Delhi", state: "Delhi" },
  { name: "Mumbai", state: "Maharashtra" },
  { name: "Jaipur", state: "Rajasthan" },
  { name: "Lucknow", state: "Uttar Pradesh" },
  { name: "Udaipur", state: "Rajasthan" },
  { name: "Kolkata", state: "West Bengal" },
  { name: "Chennai", state: "Tamil Nadu" },
  { name: "Hyderabad", state: "Telangana" },
  { name: "Bangalore", state: "Karnataka" },
  { name: "Pune", state: "Maharashtra" },
  { name: "Chandigarh", state: "Chandigarh" },
  { name: "Panaji", state: "Goa" },
  { name: "Ahmedabad", state: "Gujarat" },
  { name: "Jodhpur", state: "Rajasthan" },
  { name: "Agra", state: "Uttar Pradesh" },
  { name: "Varanasi", state: "Uttar Pradesh" },
  { name: "Indore", state: "Madhya Pradesh" },
  { name: "Bhopal", state: "Madhya Pradesh" },
  { name: "Kochi", state: "Kerala" },
  { name: "Coimbatore", state: "Tamil Nadu" },
  { name: "Dehradun", state: "Uttarakhand" },
  { name: "Amritsar", state: "Punjab" },
  { name: "Mysore", state: "Karnataka" },
  { name: "Shimla", state: "Himachal Pradesh" },
];

export default function PopularCities() {
  const { selectedCity, setSelectedCity } = useCity();

  return (
    <section className="py-16 md:py-20 bg-shaadi-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
            Popular Wedding{" "}
            <span className="bg-gradient-to-r from-shaadi-red to-shaadi-rose bg-clip-text text-transparent">
              Destinations
            </span>
          </h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            Explore wedding vendors in India&apos;s most popular wedding cities
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {popularCities.map((city) => {
            const isSelected =
              selectedCity?.name === city.name &&
              selectedCity?.state === city.state;
            return (
              <button
                key={`${city.name}-${city.state}`}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                  isSelected
                    ? "bg-gradient-to-r from-shaadi-red to-shaadi-rose text-white border-transparent shadow-md"
                    : "bg-white text-slate-700 border-gray-200 hover:border-shaadi-pink hover:text-shaadi-red hover:shadow-sm"
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
