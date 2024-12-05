import { LinearProgress, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useState, useEffect } from "react";

// Sections for tasks
const earnType = [
  { id: "social", text: "Social" },
  { id: "campaign", text: "Partners" },
  { id: "daily", text: "Daily Tasks" }, // New daily section
];

// Task data
const tasks = [
  // Social Tasks
  {
    type: "social",
    id: "telegramJoin",
    text: "Join Group",
    coin: "500",
    iconSrc: "/telegram.svg",
    url: "https://t.me/snoocoins",
  },
  {
    type: "social",
    id: "XFollow",
    text: "Follow Snoocoin",
    coin: "+500",
    iconSrc: "/x.png",
    url: "https://x.com/snoo_coin?s=21",
  },
  {
    type: "social",
    id: "XLikeRetweet",
    text: "Like and Retweet Pinned Post",
    coin: "+150",
    iconSrc: "/x.png",
    url: "https://x.com/snoo_coin/status/1864263326408102105",
  },
  // Campaign Tasks
  {
    type: "campaign",
    id: "nothingGames",
    text: "Join Community",
    coin: "+500",
    iconSrc: "/telegram.svg",
    url: "https://t.me/notgamescommunity",
  },
  // Daily Tasks
  {
    type: "daily",
    id: "twitterFollow",
    text: "visit our X",
    coin: "+200",
    iconSrc: "/x.png",
    url: "https://x.com/snoo_coin?s=21",
  },
];

export default function EarnTasks() {
  const [taskType, setTaskType] = useState("social");
  const [isLoading, setIsLoading] = useState({});
  const [reward, setReward] = useState(false);
  const [timer, setTimer] = useState({}); // Holds timers for completed daily tasks


  // Get completed tasks from localStorage
  const getCompletedTasksFromLocalStorage = () => {
    const taskStatus = {};
    tasks.forEach((task) => {
      taskStatus[task.id] = localStorage.getItem(task.id) === "true";
    });
    return taskStatus;
  };

  // Get last daily reset date
  const getLastDailyReset = () => {
    const lastReset = localStorage.getItem("lastDailyReset");
    return lastReset ? new Date(lastReset) : null;
  };

  // Reset daily tasks if needed
  const resetDailyTasksIfNeeded = () => {
    const lastReset = getLastDailyReset();
    const today = new Date();

    // If last reset is not today, clear only daily tasks
    if (!lastReset || lastReset.getDate() !== today.getDate()) {
      localStorage.setItem("lastDailyReset", today.toISOString());
      tasks
        .filter((task) => task.type === "daily")
        .forEach((task) => {
          localStorage.removeItem(task.id);
        });
    }
  };

  const calculateRemainingTime = (lastResetTime) => {
    const now = new Date();
    const resetTime = new Date(lastResetTime);
    resetTime.setDate(resetTime.getDate() + 1); // Add 24 hours
    return Math.max(0, resetTime - now); // Ensure no negative value
  };
  
  const setupTimersForDailyTasks = () => {
    const timers = {};
    tasks
      .filter((task) => task.type === "daily")
      .forEach((task) => {
        const lastCompleted = localStorage.getItem(`${task.id}_completedAt`);
        if (lastCompleted) {
          const remainingTime = calculateRemainingTime(lastCompleted);
          if (remainingTime > 0) {
            timers[task.id] = remainingTime;
          }
        }
      });
    setTimer(timers);
  };
  
  const formatTime = (milliseconds) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };
  

  // Call resetDailyTasksIfNeeded on mount
  useEffect(() => {
    resetDailyTasksIfNeeded();
    setupTimersForDailyTasks(); // Initialize timers when component loads
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimers) => {
        const updatedTimers = {};
        Object.keys(prevTimers).forEach((taskId) => {
          if (prevTimers[taskId] > 1000) {
            updatedTimers[taskId] = prevTimers[taskId] - 1000; // Decrement by 1 second
          } else {
            localStorage.removeItem(`${taskId}_completedAt`); // Clear task when timer ends
          }
        });
        return updatedTimers;
      });
    }, 1000);
    return () => clearInterval(interval); // Clear interval on unmount
  }, []);
  

  const [socialTasksCompleted, setSocialTasksCompleted] = useState(
    getCompletedTasksFromLocalStorage()
  );

  const filteredTasks = tasks.filter((task) => task.type === taskType);

  // Update the task type displayed
  const handleTaskDisplay = (type) => {
    setTaskType(type);
  };

  // Handle task interaction
  const handleSocialTask = (task) => {
    setIsLoading((prevLoading) => ({ ...prevLoading, [task.id]: true }));
    window.open(task.url, "_blank");

    setTimeout(() => {
      completeTask(task);
    }, 7000); // Simulate task completion delay
  };

  // Mark a task as complete
  const completeTask = (task) => {
    const points = parseInt(localStorage.getItem("points")) || 0;
  
    // Mark task as completed
    localStorage.setItem(task.id, "true");
    setSocialTasksCompleted((prevTasks) => ({
      ...prevTasks,
      [task.id]: true,
    }));
  
    // Handle daily tasks separately
    if (task.type === "daily") {
      localStorage.setItem(`${task.id}_completedAt`, new Date().toISOString());
      setupTimersForDailyTasks(); // Set timers for daily tasks
    }
  
    // Reward logic
    localStorage.setItem("points", points + parseInt(task.coin));
    setReward(true);
    setTimeout(() => setReward(false), 2000);
  
    // Stop loading indicator
    setIsLoading((prevLoading) => ({ ...prevLoading, [task.id]: false }));
  };
  

  return (
    <div className="py-5 px-2 bg-gradient-to-b from-blue-900 to-black">
      <div className="font-bold text-lg text-center ">Complete Tasks to Earn More</div>
      <div className="bg-[#002247] flex items-center justify-between rounded-lg my-5 px-2 pr-5">
        <div className="w-20">
          <Image width={100} height={100} src="/tasks.svg" alt="task icon" />
        </div>
        <div className="flex flex-col items-center gap-2.5 w-2/5">
          <p>
            Tasks: {Object.values(socialTasksCompleted).filter((v) => v).length}/{tasks.length}
          </p>
          <LinearProgress className="w-full" />
        </div>
      </div>

      {/* Buttons for earn type */}
      <div className="flex gap-3 mb-5">
        {earnType.map((item) => (
          <button
            key={item.id}
            onClick={() => handleTaskDisplay(item.id)}
            className={`px-6 py-2 rounded-full text-xs font-semibold ${
              taskType === item.id ? "bg-blue-500 text-white" : "bg-gray-300"
            }`}
          >
            {item.text}
          </button>
        ))}
      </div>

      {/* Display tasks for selected type */}
      <div className="space-y-3 ">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="flex justify-between items-center bg-[#1A1A1A] p-4 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {task.iconSrc && (
                <div className="w-7">
                  <Image src={task.iconSrc} alt={task.text} width={100} height={100} priority />
                </div>
              )}
               <div>
                  <p className="text-lg">{task.text}</p>
                  <p className="text-sm text-gray-400">{task.coin} points</p>
                  {task.type === "daily" && timer[task.id] && (
                    <p className="text-sm text-red-500">
                      Time left: {formatTime(timer[task.id])}
                    </p>
                  )}
                </div>
            </div>
            <button
                onClick={() => handleSocialTask(task)}
                className="px-4 py-2 bg-blue-500 text-white rounded-full flex items-center justify-center"
                disabled={socialTasksCompleted[task.id] || isLoading[task.id]} // Use socialTasksCompleted here
              >
                {isLoading[task.id] ? (
                  <CircularProgress size={20} className="text-white" />
                ) : socialTasksCompleted[task.id] ? (
                  "Completed"
                ) : (
                  "Complete"
                )}
              </button>

          </div>
        ))}
      </div>

      {reward && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 py-2 px-6 bg-green-600 text-white rounded-lg z-50">
          Reward Claimed!
        </div>
      )}
    </div>
  );
}
