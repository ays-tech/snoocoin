import { LinearProgress, CircularProgress } from "@mui/material";
import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useGetPoints, useStorePoints } from "@/hooks/api";
import SkeletonLoader from "./skeleton";
// import { useIdleCallback } from "@/hooks/timeout";

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
  if (points >= 100000)
    return { name: "Satoshi", icon: "🔱", max: Infinity, level: 10 };
  if (points >= 90000)
    return { name: "Whale", icon: "🐋", max: 100000, level: 9 };
  if (points >= 80000)
    return { name: "Validator", icon: "🔗", max: 90000, level: 8 };
  if (points >= 70000)
    return { name: "Miner", icon: "⛏️", max: 80000, level: 7 };
  if (points >= 60000)
    return { name: "Trader", icon: "📈", max: 70000, level: 6 };
  if (points >= 50000)
    return { name: "Hodler", icon: "💎", max: 60000, level: 5 };
  if (points >= 40000)
    return { name: "Enthusiast", icon: "🚀", max: 50000, level: 4 };
  if (points >= 30000)
    return { name: "Airdropper", icon: "✈️", max: 40000, level: 3 };
  if (points >= 20000)
    return { name: "Explorer", icon: "🌍", max: 30000, level: 2 };
  return { name: "Newbie", icon: "🌱", max: 20000, level: 1 };
};

export default function TapToEarnTab({ user }) {
  const tapQuantity = 2;
  const { data, isSuccess, isError, refetch } = useGetPoints(user?.id);
  const [points, setPoints] = useState(
    parseInt(localStorage.getItem("points") || 0)
  );
  const { mutate, error } = useStorePoints();
  const [readingCoin, setReadingCoin] = useState(
    parseInt(localStorage.getItem("readingCoin") || 500)
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resetTime, setResetTime] = useState(0);

  const claimTime = localStorage.getItem("claimTime");

  const userLevel = getLevel(points);

  const RESET_HOUR = 24;
  const RESET_MIN = 60;

  const now = new Date();
  const lastClaim = new Date(claimTime);

  const elapsedTimeInHour = (now - lastClaim) / 1000 / 3600;
  const timeLeftInHour = Math.floor(
    RESET_HOUR - (((now - lastClaim) / (1000 * 60 * 60)) % 24)
  );
  const timeLeftInMins = Math.floor(
    RESET_MIN - (((now - lastClaim) / (1000 * 60)) % 60)
  );
  const timeLeftInSecs = Math.floor(
    RESET_MIN - (((now - lastClaim) / 1000) % 60)
  );

  useEffect(() => {
    // function to determine 24 hours interval
    if (elapsedTimeInHour >= RESET_HOUR) {
      setReadingCoin(500);
    }

    const timer = setInterval(() => {
      const progress = (elapsedTimeInHour * 100) / RESET_HOUR;
      progress >= 100 ? setResetTime(100) : setResetTime(progress);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [elapsedTimeInHour]);

  useEffect(() => {
    localStorage.setItem("points", points);
    localStorage.setItem("readingCoin", readingCoin);
    const totalPoints = localStorage.getItem("points");
    if (user?.id) {
      mutate({ id: user?.id, point: totalPoints });
    }
  }, [points, data]);

  useEffect(() => {
    if (data) {
      isSuccess && setPoints(data);
    }
  }, [data]);

  console.log(data, error);

  const handlePoints = () => {
    if (readingCoin < tapQuantity) {
      setPoints(points);
      setReadingCoin(readingCoin);
    } else {
      setPoints(points + tapQuantity);
      setReadingCoin(readingCoin - tapQuantity);
      localStorage.setItem("claimTime", new Date());
    }
  };

  if (isError) {
    return (
      <div className='text-center mt-20'>
        An error just occurred! <br />
        <span
          className='text-lg font-semibold text-green-300'
          onClick={() => refetch()}>
          Try again
        </span>
      </div>
    );
  }

  // if (isLoading) {
  //   return (
  //     <div className='p-5 py-10 flex flex-col h-[90vh] justify-between'>
  //       <SkeletonLoader height={50} className='flex-1' />
  //       <SkeletonLoader className='w-1/3 mx-auto' />
  //       <SkeletonLoader height={20} className='w-1/5 mx-auto mb-5' />
  //       <SkeletonLoader height={10} className='w-1/3' />
  //       <SkeletonLoader height={15} className='flex-1' />
  //       <div className='w-44 h-44 rounded-full mx-auto bg-white my-5' />
  //       <SkeletonLoader height={40} className='flex-1' />
  //     </div>
  //   );
  // }

  return (
    <div className='h-[85vh] flex flex-col justify-between overflow-auto px-5 pt-3'>
      {/* Header */}
      <div className='flex justify-between items-center rounded-lg bg-[#002247] py-3 px-4'>
        {/* User Information */}
        <div className='flex items-center w-1/3'>
          <div className='w-10 h-10 bg-[#232e3c] rounded-full flex items-center justify-center text-2xl text-green-400'>
            {user?.firstName.slice(0, 1)}
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
        className='w-fit mx-auto mt-2 text-lg'
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
      <div className='flex items-center justify-center gap-1 my-2'>
        <div className='w-8'>
          <Image
            width={100}
            height={100}
            src='/coin.png'
            alt='png token'
            priority
          />
        </div>
        <div className='text-3xl font-bold'>{points}</div>
      </div>

      {/* Progress Bar */}
      <div>
        <div className='flex justify-between items-center'>
          <div className='text-xl'>Cryptolink</div>
          <div className='text-slate-400'>
            Lvl {userLevel.level}/{ranks.length}
          </div>
        </div>
        <LinearProgress
          variant='determinate'
          value={parseInt(userLevel.level) * 10}
          color='success'
          sx={{ height: 10 }}
        />
      </div>

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

      {/* Reset Duration */}
      {readingCoin === 0 && (
        <div className='flex items-center gap-2 mb-2'>
          <CircularProgress
            variant='determinate'
            value={resetTime}
            color='success'
            size={25}
            thickness={5}
          />
          <div className='text-sm text-slate-400'>
            {`${timeLeftInHour}H ${timeLeftInMins}M ${timeLeftInSecs}S time left`}
          </div>
        </div>
      )}

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
