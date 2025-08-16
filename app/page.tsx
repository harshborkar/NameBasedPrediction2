"use client";
import { useState } from "react";

interface Prediction {
  age?: number;
  gender?: string;
  country?: string;
}

export default function Home() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const [ageRes, genderRes, countryRes] = await Promise.all([
        fetch(`https://api.agify.io/?name=${name}`),
        fetch(`https://api.genderize.io/?name=${name}`),
        fetch(`https://api.nationalize.io/?name=${name}`),
      ]);
      const ageData = await ageRes.json();
      const genderData = await genderRes.json();
      const countryData = await countryRes.json();
      setPrediction({
        age: ageData.age,
        gender: genderData.gender,
        country: countryData.country?.[0]?.country_id || "Unknown",
      });
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#1a1a1a] px-4">
      <div className="w-full max-w-2xl bg-[#222] border border-gray-800 rounded-xl shadow-md p-8">
        
        {/* Title */}
        <h1 className="text-3xl font-semibold mb-2 text-[#f59e0b]">
          Name Predictor
        </h1>
        <p className="text-gray-400 mb-6">
          Enter a name and we’ll predict age, gender, and nationality.
        </p>

        {/* Input + Button in grid like reference */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <input
            type="text"
            placeholder="Enter a name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-2 px-4 py-3 rounded-md bg-[#2b2b2b] border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-[#f59e0b]"
          />
          <button
            onClick={fetchData}
            disabled={loading}
            className="w-full py-3 rounded-md font-medium bg-[#f59e0b] text-black hover:bg-[#d97706] transition disabled:opacity-50"
          >
            {loading ? "Predicting..." : "Predict"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-red-400 mb-4">{error}</p>
        )}

        {/* Results */}
        {prediction && (
          <div className="bg-[#2b2b2b] rounded-lg border border-gray-700 p-6">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Age</span>
              <span className="text-[#f59e0b]">{prediction.age ?? "Unknown"}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Gender</span>
              <span className="text-[#f59e0b]">{prediction.gender ?? "Unknown"}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-400">Country</span>
              <span className="text-[#f59e0b]">{prediction.country ?? "Unknown"}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
