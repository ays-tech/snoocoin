import { LinearProgress } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAuthenticateUser, useGetPoints } from "@/hooks/api";
// import { useIdleCallback } from "@/hooks/timeout";

const ranks = [
  { name: "Newbie", icon: "🌱", points: 0 },
  { name: "Explorer", icon: "🌍", points: 100 },
  { name: "Airdropper", icon: "✈️", points: 200 },
  { name: "Enthusiast", icon: "🚀", points: 300 },
  { name: "Hodler", icon: "💎", points: 400 },
  { name: "Trader", icon: "📈", points: 500 },
  { name: "Miner", icon: "⛏️", points: 600 },
  { name: "Validator", icon: "🔗", points: 700 },
  { name: "Whale", icon: "🐋", points: 800 },
  { name: "Satoshi", icon: "🔱", points: 900 },
];

const getLevel = (points) => {
  if (points >= 900) return { name: "Satoshi", icon: "🔱", max: 1000 };
  if (points >= 800) return { name: "Whale", icon: "🐋", max: 900 };
  if (points >= 700) return { name: "Validator", icon: "🔗", max: 800 };
  if (points >= 600) return { name: "Miner", icon: "⛏️", max: 700 };
  if (points >= 500) return { name: "Trader", icon: "📈", max: 600 };
  if (points >= 400) return { name: "Hodler", icon: "💎", max: 500 };
  if (points >= 300) return { name: "Enthusiast", icon: "🚀", max: 400 };
  if (points >= 200) return { name: "Airdropper", icon: "✈️", max: 300 };
  if (points >= 100) return { name: "Explorer", icon: "🌍", max: 200 };
  return { name: "Newbie", icon: "🌱", max: 100 };
};

export default function TapToEarnTab({ user, userPayload }) {
  const tapQuantity = 2;
  const authenticateUser = useAuthenticateUser();
  const point = authenticateUser.data?.points;
  // const uid = authenticateUser.data?.uid;
  // const { data, isLoading } = useGetPoints(uid);
  const [points, setPoints] = useState(
    parseInt(localStorage.getItem("points") || 0)
  );
  const [readingCoin, setReadingCoin] = useState(500);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const userLevel = getLevel(points);

  useEffect(() => {
    const authenticate = () => {
      if (userPayload) {
        authenticateUser.mutate(userPayload);
      }
    };

    authenticate();
  }, [userPayload]);

  console.log(authenticateUser.data, point);

  useEffect(() => {
    localStorage.setItem("points", points);
  }, [points]);

  const handlePoints = () => {
    if (readingCoin < tapQuantity) {
      setPoints(points);
      setReadingCoin(readingCoin);
    } else {
      setPoints(points + tapQuantity);
      setReadingCoin(readingCoin - tapQuantity);
    }
  };

  return (
    <div className='p-5'>
      {/* Header */}
      <div className='flex justify-between items-center rounded-lg bg-[#002247] py-3 px-4'>
        {/* User Information */}
        <div className='flex items-center w-1/4'>
          <div className='w-10'>
            <Image
              width={100}
              height={100}
              src='/coineal.svg'
              alt='coin'
              priority
            />
          </div>
          <div className='truncate ml-2'>{user?.firstName || "user"}</div>
        </div>

        {/* Earn per Tap */}
        <div className='flex flex-col items-center relative before:absolute before:h-full before:bg-slate-400 before:w-0.5 before:-left-5 after:absolute after:-right-5 after:h-full after:bg-slate-400 after:w-0.5'>
          <div className='text-slate-300 text-xs'>Earn per Tap</div>
          <div className='text-yellow-300 font-bold text-xl'>+2</div>
        </div>

        {/* Coins to Level */}
        <div className='flex flex-col items-center'>
          <div className='text-slate-300 text-xs'>Coins to level</div>
          <div className='text-yellow-300 font-bold text-xl'>
            {userLevel.max - points || 0}
          </div>
        </div>
      </div>

      {/* Rank Display */}
      <div
        className='w-fit mx-auto mt-4 text-lg'
        onClick={() =>
          setIsModalOpen(true)
        }>{`${userLevel.icon} ${userLevel.name}`}</div>

      {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
          <div className='bg-gray-900 p-6 rounded-lg shadow-lg max-w-md w-full text-gray-300 relative'>
            <button
              className='absolute top-2 right-4 text-gray-400 hover:text-gray-100 transition text-2xl'
              onClick={() => setIsModalOpen(false)}>
              &times;
            </button>
            <h2 className='text-xl font-bold mb-4'>All Ranks</h2>
            <div className='grid gap-2'>
              {ranks.map((rank, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-md flex items-center space-x-2 ${
                    rank.name === userLevel.name
                      ? "bg-blue-500 text-white"
                      : "bg-gray-800 text-white"
                  }`}>
                  <span>{rank.icon}</span>
                  <span>{rank.name}</span>
                  <span className='ml-auto text-xs text-gray-400'>
                    {rank.points} XP
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Coin Count */}
      <div className='flex items-center justify-center gap-1 my-4'>
        <div className='w-8'>
          <Image
            width={100}
            height={100}
            src='/coineal.svg'
            alt='png token'
            priority
          />
        </div>
        <div className='text-3xl font-bold'>{points}</div>
      </div>

      {/* Progress Bar */}
      <div className='flex justify-between items-center mb-1'>
        <div className='text-xl'>Cryptolink</div>
        <div className='text-slate-400'>Lvl 1/10</div>
      </div>
      <LinearProgress
        variant='determinate'
        value={50}
        color='success'
        sx={{ height: 10 }}
      />

      {/* Coin Tap */}
      <motion.div
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{ ease: "easeOut", duration: 0.2 }}
        whileTap={{ scale: 1.05 }}
        onClick={() => handlePoints()}
        className='my-9 w-fit mx-auto'>
        <Image
          width={200}
          height={200}
          src='/coin.webp'
          alt='coin'
          className='rounded-full'
          priority
        />
      </motion.div>

      {/* Bottom Actions */}
      <div className='flex justify-between items-center text-sm'>
        {/* Lightning Charge */}
        <div className='flex items-center gap-1'>
          <div className='w-3'>
            <Image
              width={100}
              height={100}
              src='/lightening.svg'
              alt='lightning'
              priority
            />
          </div>
          <div className='text-yellow-300'>{readingCoin}/500</div>
        </div>

        {/* Earn More Button */}
        <div className='flex items-center gap-3 rounded-full bg-[#2A522B] px-3 py-1'>
          <div className='w-5'>
            <Image
              width={100}
              height={100}
              src='/treasure.svg'
              alt='treasure'
              priority
            />
          </div>
          <div>Earn More</div>
        </div>

        {/* Boost Button */}
        <div className='flex items-center gap-3 rounded-full bg-[#2A522B] px-4 py-2'>
          <div className='w-5'>
            <Image
              width={100}
              height={100}
              src='/rocket.svg'
              alt='rocket'
              priority
            />
          </div>
          <div>Boost</div>
        </div>
      </div>
    </div>
  );
}
