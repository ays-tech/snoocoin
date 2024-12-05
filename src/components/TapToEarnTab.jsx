import { useState, useEffect } from "react";
import Image from "next/image";
import { LinearProgress } from "@mui/material";
import { useGetPoints, useStorePoints } from "@/hooks/api"; // API hooks

// Define milestone tiers
const milestones = [10000, 20000, 50000, 100000];

export default function SnooEarning({ user }) {
  const { data: pointsData, isSuccess, isError, refetch } = useGetPoints(user?.id); // Fetch points
  const { mutate: storePoints } = useStorePoints(); // Store updated points
  const [points, setPoints] = useState(() => {
    // Get points from localStorage if available, otherwise default to 0
    return parseInt(localStorage.getItem("points") || 0);
  });

  // Update points when API data is fetched successfully
  useEffect(() => {
    if (isSuccess && pointsData !== points) {
      setPoints(pointsData); // Set points from API only if they differ from the current state
    }
  }, [isSuccess, pointsData, points]);

  // Error handling for fetching points
  useEffect(() => {
    if (isError) {
      console.error("Failed to fetch points. Retrying...");
      refetch();
    }
  }, [isError, refetch]);

  // Store points back to API when updated locally
  useEffect(() => {
    if (user?.id) {
      // Store points in localStorage before sending to API
      localStorage.setItem("points", points);
      storePoints({ id: user.id, point: points });
    }
  }, [points, user?.id, storePoints]);

  // Calculate next milestone and progress
  const nextMilestone = milestones.find((milestone) => milestone > points) || 100000;
  const progress = ((points / nextMilestone) * 100).toFixed(2);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-900 to-black p-5 text-center">
      {/* Snoo Mascot */}
      <div>
        <Image
          src="/snoo.png"
          alt="Snoo mascot"
          width={200}
          height={200}
          priority
          className="rounded-full animate-pulse shadow-md"
        />
      </div>

      {/* Points Display */}
      <div className="mt-5">
        <h1 className="text-3xl font-bold text-yellow-300">
          <span className="text-white">{points}</span> $Snoo
        </h1>
      </div>

      {/* Progress Bar */}
      <div className="mt-10 w-3/4 max-w-md">
        <LinearProgress
          variant="determinate"
          value={progress}
          color="success"
          sx={{ height: 12, borderRadius: 10 }}
        />
        <p className="text-gray-400 text-xs mt-2">
           {points.toLocaleString()} / {nextMilestone.toLocaleString()} Snoocoins
        </p>
      </div>

      {/* Error Message */}
      {isError && (
        <div className="text-red-500 text-sm mt-4">
          Failed to load points. Retrying...
        </div>
      )}
    </div>
  );
}
