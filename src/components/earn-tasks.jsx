import { LinearProgress, CircularProgress } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

const earnType = [
  {
    id: "social",
    text: "Social",
  },
  {
    id: "campaign",
    text: "Partners",
  },
];

const tasks = [
  // Social Tasks
  {
    type: "social",
    id: "telegramJoin",
    text: "Join Group",
    coin: "500",
    iconSrc: "/telegram.svg", // Use the appropriate icon for each task
    url: "https://t.me/snoocoins",
  },
  {
    type: "social",
    id: "XFollow",
    text: "Follow Snoocoin",
    coin: "+500",
    iconSrc: "/x.png", // Different icon for a different task
    url: "https://x.com/snoocoin?s=21",
  },
  {
    type: "social",
    id: "XLikeRetweet",
    text: "Like and Retweet Pinned Post",
    coin: "+150",
    iconSrc: "/x.png", // Same icon but for a different task
    url: "https://x.com/snoo_coin/status/1864263326408102105",
  },
  // Campaign Tasks
  {
    type: "campaign",
    id: "nothingGames",
    text: "Join NOTHINGGames Community",
    coin: "+500",
    iconSrc: "/telegram.svg", // Icon for campaign task
    url: "https://t.me/notgamescommunity",
  },
];

export default function EarnTasks() {
  const [taskType, setTaskType] = useState("social");
  const [isLoading, setIsLoading] = useState({});
  const [reward, setReward] = useState(false);

  const getCompletedTasksFromLocalStorage = () => {
    const taskStatus = {};
    tasks.forEach((task) => {
      taskStatus[task.id] = localStorage.getItem(task.id) === "true";
    });
    return taskStatus;
  };

  const [socialTasksCompleted, setSocialTasksCompleted] = useState(
    getCompletedTasksFromLocalStorage()
  );

  const filteredTasks = tasks.filter((task) => task.type === taskType);

  const handleTaskDisplay = (type) => {
    setTaskType(type);
  };

  const handleSocialTask = (task) => {
    setIsLoading((prevLoading) => ({ ...prevLoading, [task.id]: true }));
    window.open(task.url, "_blank");

    setTimeout(() => {
      completeTask(task);
    }, 3000); // Simulate delay for task completion
  };

  const completeTask = (task) => {
    const points = parseInt(localStorage.getItem("points")) || 0;

    localStorage.setItem(task.id, "true");
    setSocialTasksCompleted((prevTasks) => ({
      ...prevTasks,
      [task.id]: true,
    }));

    localStorage.setItem("points", points + parseInt(task.coin));
    setReward(true);
    setTimeout(() => setReward(false), 2000);

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
              {/* Task icon dynamically based on task data */}
              {task.iconSrc && (
                <div className="w-7">
                  <Image src={task.iconSrc} alt={task.text} width={100} height={100} priority />
                </div>
              )}
              <div>
                <p className="text-lg">{task.text}</p>
                <p className="text-sm text-gray-400">{task.coin} points</p>
              </div>
            </div>
            <button
              onClick={() => handleSocialTask(task)}
              className="px-4 py-2 bg-blue-500 text-white rounded-full flex items-center justify-center"
              disabled={socialTasksCompleted[task.id] || isLoading[task.id]}
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
        <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 py-2 px-6 bg-green-600 text-white rounded-lg">
          Reward Claimed!
        </div>
      )}
    </div>
  );
}
