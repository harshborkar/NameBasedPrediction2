"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Home() {
  const [name, setName] = useState("");
  const [data, setData] = useState<{ age?: number | null; gender?: string | null; country?: string | null }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!name) return;
    setLoading(true);
    setError(null);
    try {
      const [ageRes, genderRes, countryRes] = await Promise.all([
        fetch(`https://api.agify.io/?name=${name}`),
        fetch(`https://api.genderize.io/?name=${name}`),
        fetch(`https://api.nationalize.io/?name=${name}`),
      ]);
      if (!ageRes.ok || !genderRes.ok || !countryRes.ok) throw new Error("API request failed");

      const ageData = await ageRes.json();
      const genderData = await genderRes.json();
      const countryData = await countryRes.json();

      setData({
        age: ageData?.age ?? null,
        gender: genderData?.gender ?? null,
        country: countryData?.country?.[0]?.country_id ?? null,
      });
    } catch (err: any) {
      console.error("Error fetching data:", err);
      setError("⚠️ Failed to fetch data. Please try again.");
      setData({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden text-[#EAEAEA] p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black via-[#1a1a1a] to-black"
        animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Floating glowing particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-amber-500 opacity-40"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
          }}
          animate={{
            y: [Math.random() * window.innerHeight, -50],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Content */}
      <motion.h1
        className="relative text-4xl font-extrabold mb-6 z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
      >
        Let’s <span className="text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]">Predict</span>
      </motion.h1>

      {/* Input + Button */}
      <motion.div
        className="relative flex space-x-2 mb-6 w-full max-w-md z-10"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
      >
        <input
          type="text"
          placeholder="Enter your name"
          className="flex-1 p-3 rounded-lg bg-[#1E1E1E]/90 border border-[#2D2D2D] 
          text-[#EAEAEA] placeholder-gray-500 focus:outline-none 
          focus:ring-2 focus:ring-amber-500 transition-all duration-300"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <motion.button
          onClick={fetchData}
          whileHover={{ scale: 1.05, boxShadow: "0px 0px 14px rgba(245,158,11,0.7)" }}
          whileTap={{ scale: 0.9 }}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          Predict
        </motion.button>
      </motion.div>

      {/* Loading */}
      {loading && (
        <motion.div
          className="text-gray-400 flex items-center space-x-2 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span>Fetching predictions...</span>
        </motion.div>
      )}

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            className="text-red-400 mt-4 relative z-10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Result Card */}
      <AnimatePresence>
        {!loading && !error && (data.age !== undefined || data.gender || data.country) && (
          <motion.div
            className="relative bg-[#1E1E1E]/90 border border-[#2D2D2D] shadow-lg rounded-xl p-6 text-lg w-full max-w-md mt-4 z-10"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            exit={{ opacity: 0, scale: 0.92 }}
          >
            <p><span className="text-amber-400 font-semibold">Name:</span> {name || "N/A"}</p>
            <p><span className="text-amber-400 font-semibold">Predicted Age:</span> {data.age ?? "Unknown"}</p>
            <p><span className="text-amber-400 font-semibold">Predicted Gender:</span> {data.gender ?? "Unknown"}</p>
            <p><span className="text-amber-400 font-semibold">Most Likely Country:</span> {data.country ?? "Unknown"}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
