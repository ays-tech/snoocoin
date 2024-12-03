import React from "react";
import { motion } from "framer-motion";

export default function OGTeaser() {
  return (
    <div className="bg-gradient-to-b from-blue-900 to-black text-white min-h-screen flex flex-col items-center justify-center relative">
      {/* Hero Section */}
      <div className="relative text-center">
        <motion.div
          animate={{ rotateY: 360 }}
          transition={{ duration: 10, repeat: Infinity }}
          className="w-64 h-96 bg-gradient-to-r from-purple-600 to-blue-600 shadow-2xl rounded-lg flex items-center justify-center mx-auto p-6 cursor-pointer transform hover:scale-105 transition-transform">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 10 }}
            className="relative w-full h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-2xl p-4">
            <p className="absolute top-4 left-4 text-lg font-semibold text-white text-shadow-lg">OG</p>
            <p className="text-4xl font-extrabold text-white text-center">OG Pass</p>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-lg opacity-60 animate-pulse"></div>
          </motion.div>
        </motion.div>
        <h1 className="mt-6 text-3xl font-bold">Be Part of the Exclusive OG Club</h1>
        <p className="mt-4 text-lg text-gray-300">
          Unlock guaranteed rewards, special privileges, and hidden perks.
        </p>
      </div>

      {/* Benefits Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 px-6 w-full max-w-5xl">
        {["Guaranteed Rewards", "Exclusive Events", "Hidden Perks"].map((benefit, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, rotateX: 10 }}
            className="bg-white/10 backdrop-blur-md rounded-lg p-6 shadow-lg border border-white/20 transform transition-all hover:shadow-2xl">
            <div className="text-2xl font-semibold text-white">{benefit}</div>
            <p className="text-gray-400 mt-2">
              {index === 0
                ? "Earn bonus rewards as an OG."
                : index === 1
                ? "Access secret events and opportunities."
                : "Enjoy benefits no one else has seen."}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Updated Curious Minds Section */}
      <div className="mt-12 text-center">
        <h3 className="text-3xl font-bold mb-4">Become Part of Something Big</h3>
        <p className="text-lg mb-6 text-gray-300">
          Take the first step into a growing movement. Secure your access to future rewards and join a visionary journey.
        </p>
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="bg-gradient-to-r from-green-400 to-blue-500 px-10 py-5 rounded-lg shadow-xl text-white font-semibold text-lg cursor-pointer transform transition-all hover:shadow-2xl">
          <span className="block text-2xl">Join the Movement</span>
          <span className="block text-sm mt-1 text-yellow-300">Earn exclusive rewards as an early believer.</span>
        </motion.div>
        <p className="mt-4 text-gray-400">
          Don't just buy a token—invest in a future where your vision grows with ours.
        </p>
      </div>

      {/* Coming Soon Section */}
      <div className="mt-20">
        <div className="relative w-80 h-80 mx-auto">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-800 to-black animate-pulse"></div>
          <div className="absolute inset-5 rounded-full bg-black flex items-center justify-center">
            <p className="text-xl font-bold text-yellow-400">OG Portal Unlocks Soon</p>
          </div>
        </div>
        <p className="mt-6 text-gray-400">
          The OG path is hidden for now, but keep holding your tokens.
        </p>
      </div>
    </div>
  );
}
