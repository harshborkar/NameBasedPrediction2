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
    <main className="flex items-center justify-center min-h-screen bg-[#0f1216] px-4">
      <div className="w-full max-w-xl bg-[#14181f] border border-[#1e2430] rounded-2xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.35)] animate-fade-in">
        {/* Title */}
        <h1 className="text-2xl font-semibold mb-2 text-[#f5f7fa]">
          <span className="text-[#f4a24f]">Name</span> Predictor
        </h1>
        <p className="text-[#9aa3b2] mb-8 text-sm animate-fade-up">
          Enter a name to predict age, gender, and nationality.
        </p>

        {/* Input + Button */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a name"
            className="flex-1 px-4 py-3 rounded-lg bg-[#0f1319] border border-[#1f2633] text-[#e6ebf2] placeholder-[#6b7687] focus:outline-none focus:ring-2 focus:ring-[#f4a24f]/40 transition-all duration-300"
          />
          <button
            onClick={fetchData}
            disabled={loading}
            className="px-5 rounded-lg font-medium bg-[#f4a24f] text-[#1b1f26] hover:bg-[#e59039] transition-all duration-300 disabled:opacity-50 active:scale-[0.98]"
          >
            {loading ? "Loading..." : "Predict"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <p className="text-[#ff6b6b] mb-4 text-sm animate-fade-up">
            {error}
          </p>
        )}

        {/* Results */}
        {prediction && (
          <div className="space-y-3 animate-fade-up">
            {[
              { label: "Age", value: prediction.age ?? "Unknown" },
              { label: "Gender", value: prediction.gender ?? "Unknown" },
              { label: "Country", value: prediction.country ?? "Unknown" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center px-4 py-3 rounded-lg bg-[#0f1319] border border-[#1f2633] hover:border-[#f4a24f]/40 transition-colors"
              >
                <span className="text-[#9aa3b2] text-sm">{item.label}</span>
                <span className="text-[#f4a24f] font-medium">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
