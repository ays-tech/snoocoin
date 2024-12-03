import { useState, useEffect } from "react";
import Image from "next/image";
import { useGetPoints, useStorePoints } from "@/hooks/api";
import { LinearProgress, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

// Rank thresholds and icons
const ranks = [
  { name: "Newbie", icon: "🌱", points: 10000 },
  { name: "Explorer", icon: "🌍", points: 20000 },
  { name: "Airdropper", icon: "✈️", points: 30000 },
  { name: "Enthusiast", icon: "🚀", points: 40000 },
  { name: "Hodler", icon: "💎", points: 50000 },
  { name: "Trader", icon: "📈", points: 60000 },
  { name: "Miner", icon: "⛏️", points: 70000 },
  { name: "Validator", icon: "🔗", points: 80000 },
  { name: "Whale", icon: "🐋", points: 90000 },
  { name: "Satoshi", icon: "🔱", points: 100000 },
];

const getLevel = (points) => {
  if (points >= 100000) return { name: "Satoshi", icon: "🔱", level: 10 };
  if (points >= 90000) return { name: "Whale", icon: "🐋", level: 9 };
  if (points >= 80000) return { name: "Validator", icon: "🔗", level: 8 };
  if (points >= 70000) return { name: "Miner", icon: "⛏️", level: 7 };
  if (points >= 60000) return { name: "Trader", icon: "📈", level: 6 };
  if (points >= 50000) return { name: "Hodler", icon: "💎", level: 5 };
  if (points >= 40000) return { name: "Enthusiast", icon: "🚀", level: 4 };
  if (points >= 30000) return { name: "Airdropper", icon: "✈️", level: 3 };
  if (points >= 20000) return { name: "Explorer", icon: "🌍", level: 2 };
  return { name: "Newbie", icon: "🌱", level: 1 };
};

export default function SnooEarning({ user }) {
  const { data, isSuccess, isError, refetch } = useGetPoints(user?.id);
  const [points, setPoints] = useState(parseInt(localStorage.getItem("points") || 0));
  const { mutate } = useStorePoints();
  const [readingCoin, setReadingCoin] = useState(parseInt(localStorage.getItem("readingCoin") || 500));

  // Modal visibility state
  const [openRankModal, setOpenRankModal] = useState(false);

  // User Level & Progress
  const userLevel = getLevel(points);

  useEffect(() => {
    localStorage.setItem("points", points);
    localStorage.setItem("readingCoin", readingCoin);

    const totalPoints = localStorage.getItem("points");
    if (user?.id) {
      mutate({ id: user?.id, point: totalPoints });
    }
  }, [points, readingCoin, user?.id]);

  useEffect(() => {
    if (data && isSuccess) {
      setPoints(data);
    }
  }, [data, isSuccess]);

  if (isError) {
    return (
      <div className="text-center mt-20">
        An error occurred! <br />
        <span className="text-lg font-semibold text-green-300" onClick={() => refetch()}>
          Try again
        </span>
      </div>
    );
  }

  const handleOpenRankModal = () => {
    setOpenRankModal(true);
  };

  const handleCloseRankModal = () => {
    setOpenRankModal(false);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gradient-to-b from-blue-900 to-black p-5 text-center">
      <div>
        <Image
          src="/snoo.png"
          alt="Snoo mascot"
          width={200}
          height={200}
          priority
          className="rounded-full animate-pulse"
        />
      </div>

      <div className="mt-5">
        <h1 className="text-2xl font-bold text-yellow-300">
          <span className="text-white">{points}</span> Snoo so far!
        </h1>
        <p className="text-gray-400 mt-3 text-sm">
          Keep going! Snoo is hard at work earning rewards for you.
        </p>
      </div>

      <div className="mt-6">
        <h2
          className="text-lg font-semibold text-yellow-500 cursor-pointer"
          onClick={handleOpenRankModal}
        >
          {userLevel.icon} {userLevel.name}
        </h2>
        <div className="text-sm text-gray-300 mt-2">
          Level: {userLevel.level} / 10
        </div>
        <LinearProgress
          variant="determinate"
          value={(userLevel.level / 10) * 100}
          color="success"
          sx={{ height: 10, borderRadius: 20 }}
        />
      </div>

      <div className="flex gap-4 mt-8">

        <button className="bg-green-500 text-white px-6 py-2 rounded-md shadow-md hover:bg-green-400">
          Claim Rewards (Coming Soon)
        </button>
      </div>

      

      {/* Rank Modal */}
      <Dialog open={openRankModal} onClose={handleCloseRankModal}>
        <DialogTitle className="text-center">All Ranks</DialogTitle>
        <DialogContent>
          <ul className="space-y-3">
            {ranks.map((rank, index) => (
              <li key={index} className="flex items-center gap-2 text-lg">
                {rank.icon} {rank.name} - {rank.points} points
              </li>
            ))}
          </ul>
        </DialogContent>
        <DialogActions>
          <button
            className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-400"
            onClick={handleCloseRankModal}
          >
            Close
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
