import Image from "next/image";
import { LinearProgress } from "@mui/material";

const ranks = [
  { name: "Explorer", icon: "🌍", points: 20000 },
  { name: "Airdropper", icon: "✈️", points: 30000 },
  // Other ranks...
];

export default function SnooEarning({ points = 15000 }) {
  const currentRank = ranks.find(rank => points < rank.points) || ranks[ranks.length - 1];
  const pointsToNextLevel = currentRank.points - points;

  return (
    <div className="h-screen flex flex-col justify-between items-center bg-gradient-to-b from-blue-900 to-black p-5">
      {/* Snoo Mascot */}
      <div className="text-center">
        <Image
          src="/snoo.png"
          alt="Snoo sleeping"
          width={200}
          height={200}
          priority
          className="rounded-full animate-pulse"
        />
        <div className="text-yellow-300 text-lg mt-3">
          Snoo is earning for you!
        </div>
      </div>

      {/* Points Display */}
      <div className="text-center">
        <div className="text-3xl font-bold text-white">{points} XP</div>
        <div className="text-gray-400 text-sm">
          {pointsToNextLevel} XP to level up to {currentRank.name} {currentRank.icon}
        </div>
        <LinearProgress
          variant="determinate"
          value={(points / currentRank.points) * 100}
          color="success"
          sx={{ height: 10, marginTop: 2 }}
        />
      </div>

      {/* Bottom Buttons */}
      <div className="flex justify-between gap-5 w-full max-w-md">
        <button className="bg-yellow-500 text-white px-4 py-2 rounded-md shadow-md">
          Earn More
        </button>
        <button className="bg-green-500 text-white px-4 py-2 rounded-md shadow-md">
          Boost
        </button>
      </div>
    </div>
  );
}
