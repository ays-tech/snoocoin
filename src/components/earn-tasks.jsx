
import { LinearProgress } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";

const earnType = [
  {
    id: "social",
    text: "Social",
    Icon: () => (
      <div className='w-7'>
        <Image src='/woman.svg' alt='woman' width={100} height={100} priority />
      </div>
    ),
  },
  {
    id: "daily",
    text: "Daily",
    Icon: () => (
      <div className='w-7'>
        <Image
          src='/clipboard.svg'
          alt='clipboard'
          width={100}
          height={100}
          priority
        />
      </div>
    ),
  },
  {
    id: "campaign",
    text: "Partners",
    Icon: () => (
      <div className='w-7'>
        <Image
          src='/megaphone.svg'
          alt='clipboard'
          width={100}
          height={100}
          priority
        />
      </div>
    ),
  },
];

const tasks = [
  {
    type: "social",
    id: "telegramJoin",
    text: "Join Group",
    coin: "+300",
    Icon: () => (
      <div className="w-7">
        <Image src="/telegram.svg" alt="telegram" width={100} height={100} priority />
      </div>
    ),
    url: "t.me/snoocoins",
    customAction: true,
  },
  {
    type: "social",
    id: "XFollow",
    text: "Follow Snoocoin",
    coin: "+100",
    Icon: () => (
      <div className="w-7">
        <Image src="/x.png" alt="x" width={100} height={100} priority />
      </div>
    ),
    url: "https://x.com/snoocoin?s=21",
  },
  {
    type: "social",
    id: "XLikeRetweet",
    text: "Like and Retweet Pinned Post",
    coin: "+150",
    Icon: () => (
      <div className="w-7">
        <Image src="/x.png" alt="retweet" width={100} height={100} priority />
      </div>
    ),
    url: "https://x.com/snoocoin", // Replace with your pinned post URL
  },
  
  {
    type: "campaign",
    id: "telegramNOT",
    text: "Join NOT-A-GAME community",
    coin: "+100",
    Icon: () => (
      <div className="w-7">
        <Image src="/telegram.svg" alt="telegram" width={100} height={100} priority />
      </div>
    ),
    url: "https://t.me/notgamescommunity",
  },
  // New PumpFun Task under Daily
  {
    type: "daily",
    id: "pumpFun",
    text: "Visit PumpFun",
    coin: "+200",
    Icon: () => (
      <div className="w-7">
        <Image src="/coin.png" alt="pumpfun" width={100} height={100} priority />
      </div>
    ),
    url: "https://pump.fun/coin/DNCERqVsdCdoeKWNt9EBCpdqci97cY4X8eVhnzqqpump",
  },
];

export default function EarnTasks() {
  const [taskType, setTaskType] = useState("social");
  const [isLoading, setIsLoading] = useState({});
  const [reward, setReward] = useState(false);
  const [lastClaimed, setLastClaimed] = useState(localStorage.getItem("lastClaimed") || null);

  // Initialize tasks from localStorage
  const getCompletedTasksFromLocalStorage = () => {
    return {
      telegramJoin: localStorage.getItem("telegramJoin") === "true",
      XFollow: localStorage.getItem("XFollow") === "true",
      telegramBoost: localStorage.getItem("telegramBoost") === "true",
      facebookFollow: localStorage.getItem("facebookFollow") === "true",
      youTubeSub: localStorage.getItem("youTubeSub") === "true",
      pumpFun: localStorage.getItem("pumpFun") === "true",
    };
  };

  const [socialTasksCompleted, setSocialTasksCompleted] = useState(getCompletedTasksFromLocalStorage);

  const filteredTasks = tasks.filter((task) => task.type === taskType);

  useEffect(() => {
    // Reset daily tasks after 24 hours
    const currentTime = new Date().getTime();
    const lastClaimedTime = lastClaimed ? new Date(lastClaimed).getTime() : 0;

    if (currentTime - lastClaimedTime >= 86400000) {
      setLastClaimed(null); // Reset daily tasks
      localStorage.removeItem("lastClaimed"); // Remove the saved last claim time
    }
  }, [lastClaimed]);

  const handleTaskDisplay = (type) => {
    setTaskType(type);
  };

  const handleSocialTask = (task) => {
    setIsLoading((prevLoading) => ({ ...prevLoading, [task.id]: true }));

    if (task.customAction) {
      if (task.id === "telegramJoin") {
        checkTelegramJoinStatus(task);
      }
    } else {
      if (task.id === "XLikeRetweet" && !socialTasksCompleted["XFollow"]) {
        alert("Please complete the Follow task first!");
        setIsLoading((prevLoading) => ({ ...prevLoading, [task.id]: false }));
        return;
      }

      window.open(task.url, "_blank");
      setTimeout(() => {
        completeTask(task);
      }, 10000); // 10 seconds delay
    }
  };



  const checkTelegramJoinStatus = (task) => {
    const hasJoinedTelegram = true; // Simulate joining logic here

    if (hasJoinedTelegram) {
      window.open("https://t.me/snoocoins", "_blank"); // Open Telegram group if joined
      setTimeout(() => {
        completeTask(task);
      }, 10000); // 10 seconds delay
    } else {
      alert("Please join the Telegram group to complete this task.");
      setIsLoading((prevLoading) => ({ ...prevLoading, [task.id]: false }));
    }
  };

  const completeTask = (task) => {
    const balance = parseInt(localStorage.getItem("points")) || 0;
  
    // Mark task as completed in localStorage and state
    localStorage.setItem(`${task.id}`, "true");
  
    setSocialTasksCompleted((prevTasks) => {
      const updatedTasks = { ...prevTasks, [task.id]: true };
      return updatedTasks;
    });
  
    // Update points
    localStorage.setItem("points", balance + parseInt(task.coin));
  
    // Trigger reward display
    setReward(true);
    setTimeout(() => setReward(false), 2000);
  };
  

  return (
    <div className="py-5 px-2">
      <div className="font-bold text-lg text-center">Complete Tasks to Earn More</div>
      <p className="my-2 font-semibold text-center">
        Finish <span className="text-yellow-300">500</span> tasks to claim <span className="text-green-500"> 🌳 $snoo</span>
      </p>
      <div className="bg-[#002247] flex items-center justify-between rounded-lg my-5 px-2 pr-5">
        <div className="w-20">
          <Image width={100} height={100} src="/tasks.svg" alt="task icon" />
        </div>
        <div className="flex flex-col items-center gap-2.5 w-2/5">
          <p>Tasks: 0/5</p>
          <LinearProgress className="w-full" />
        </div>
        <div className="w-16 flex justify-end">
          <div className="rounded-lg bg-[#009A4D] flex flex-col gap-1 py-2 px-3 text-white">
            <div className="text-xs">Rewards</div>
            <div className="text-xl font-bold">+200</div>
          </div>
        </div>
      </div>
  
      {/* Task Type Buttons */}
      <div className="flex gap-3 mb-5">
        {earnType.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTaskDisplay(item.id)}
            className={`px-4 py-2 rounded-full text-xs font-semibold ${
              taskType === item.id ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            <item.Icon />
            {item.text}
          </button>
        ))}
      </div>
  
      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div key={task.id} className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <task.Icon />
              <div>
                <p className="text-lg">{task.text}</p>
                <p className="text-sm text-gray-400">{task.coin} points</p>
              </div>
            </div>
            <button
              onClick={() => handleSocialTask(task)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full"
              disabled={socialTasksCompleted[task.id]}
            >
              {socialTasksCompleted[task.id] ? "Completed" : "Complete"}
            </button>
          </div>
        ))}
      </div>
  
      {/* Daily Claim Button */}
      <div className="mt-5 text-center">
        <button
          onClick={handleDailyClaim}
          className="px-6 py-3 bg-green-500 text-white rounded-full"
          disabled={lastClaimed && new Date().getTime() - new Date(lastClaimed).getTime() < 86400000}
        >
          {lastClaimed ? "Claim Again in 24 Hours" : "Claim Daily Reward"}
        </button>
      </div>
  
      {reward && (
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 py-2 px-6 bg-green-600 text-white rounded-lg">
          Reward Claimed!
        </div>
      )}
    </div>
  );
  
}
