import { LinearProgress } from "@mui/material";
import Image from "next/image";
import { useState } from "react";

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
    id: "referral",
    text: "Referral",
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
  {
    id: "partners",
    text: "Partners",
    Icon: () => (
      <div className='w-7'>
        <Image
          src='/handshake.svg'
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
    id: "telegramJoin",
    text: "Join Cryptolink on Telegram",
    coin: "+30000",
    Icon: () => (
      <div className='w-7'>
        <Image
          src='/telegram.svg'
          alt='woman'
          width={100}
          height={100}
          priority
        />
      </div>
    ),
    url: "https://github.com/ays-tech/bibi-frontend",
    customAction: true,
  },
  {
    id: "XFollow",
    text: "Follow Cryptolink on X",
    coin: "+30000",
    Icon: () => (
      <div className='w-7'>
        <Image
          src='/coineal.svg'
          alt='woman'
          width={100}
          height={100}
          priority
        />
      </div>
    ),
    url: "https://github.com/ays-tech/bibi-frontend",
  },
  {
    id: "telegramBoost",
    text: "Boost Cryptolink Channel",
    coin: "+30000",
    Icon: () => (
      <div className='w-7'>
        <Image
          src='/telegram.svg'
          alt='woman'
          width={100}
          height={100}
          priority
        />
      </div>
    ),
    url: "https://github.com/ays-tech/bibi-frontend",
  },
  {
    id: "facebookFollow",
    text: "Follow Cryptolink on Facebook",
    coin: "+30000",
    Icon: () => (
      <div className='w-7'>
        <Image
          src='/facebook.svg'
          alt='woman'
          width={100}
          height={100}
          priority
        />
      </div>
    ),
    url: "https://github.com/ays-tech/bibi-frontend/",
  },
  {
    id: "youTubeSub",
    text: "Subscribe to Cryptolink on YouTube",
    coin: "+30000",
    Icon: () => (
      <div className='w-7'>
        <Image
          src='/youtube.svg'
          alt='woman'
          width={100}
          height={100}
          priority
        />
      </div>
    ),
    url: "https://github.com/ays-tech/bibi-frontend",
  },
];

export default function EarnTasks() {
  const [taskType, setTaskType] = useState("social");
  const [isLoading, setIsLoading] = useState({});
  const [socialTasksCompleted, setSocialTasksCompleted] = useState({});

  const handleTaskDisplay = (type) => {
    setTaskType(type);
  };

  const handleSocialTask = (task) => {
    setIsLoading((prevLoading) => ({ ...prevLoading, [task.id]: true }));

    if (task.customAction) {
      if (task.id === "telegramJoin") {
        checkTelegramJoinStatus(task);
      }
      //  else if (task.id === "buyTokens") {
      //   // Logic for rewarding token purchase task
      //   completeTask(task.id);
      // }
    } else {
      window.open(task.url, "_blank");
      setTimeout(() => {
        completeTask(task.id);
      }, 10000); // 10 seconds delay
    }
  };

  const checkTelegramJoinStatus = (task) => {
    // Simulating checking if user has joined Telegram group
    const hasJoinedTelegram = true; // Replace with actual logic to check membership

    if (hasJoinedTelegram) {
      completeTask(task.id);
      window.open("https://t.me/Cryptolnk_bot?profile", "_blank"); // Open Telegram group link if joined
    } else {
      alert("Please join the Telegram group to complete this task.");
      setIsLoading((prevLoading) => ({ ...prevLoading, [task.id]: false }));
    }
  };

  const completeTask = (taskId) => {
    setIsLoading((prevLoading) => ({ ...prevLoading, [taskId]: false }));
    setSocialTasksCompleted((prevTasks) => ({ ...prevTasks, [taskId]: true }));
    // Add logic for completed task
  };

  return (
    <div className='py-5 px-2'>
      <div className='font-bold text-lg text-center'>
        Complete Tasks to Earn More
      </div>
      <p className='my-2 font-semibold text-center'>
        Finish <span className='text-yellow-300'>500</span> tasks to claim{" "}
        <span className='text-green-500'> 🌳 10 USDT</span>
      </p>
      <div className='bg-[#002247] flex items-center justify-between rounded-lg my-5 px-2 pr-5'>
        <div className='w-20'>
          <Image width={100} height={100} src='/tasks.svg' alt='task icon' />
        </div>
        <div className='flex flex-col items-center gap-2.5 w-2/5'>
          <p>Tasks: 0/50</p>
          <LinearProgress
            variant='determinate'
            value={50}
            color='success'
            sx={{ height: 4, width: "100%" }}
          />
        </div>
        <div className='bg-green-400 px-2 py-1 rounded-md'>Claim</div>
      </div>
      <div className='flex flex-wrap gap-2'>
        {earnType.map((earn) => (
          <div
            key={earn.id}
            onClick={() => handleTaskDisplay(earn.id)}
            className={` flex items-center gap-2 px-3 py-2 rounded-lg ${
              taskType === earn.id
                ? "bg-green-300 text-[#002247] font-semibold outline outline-1"
                : "bg-[#002247]"
            }`}>
            <earn.Icon />
            <div>{earn.text}</div>
          </div>
        ))}
      </div>
      <div className='text-left my-3'>
        {taskType[0].toUpperCase() + taskType.slice(1)} Tasks
      </div>
      <div className='flex flex-col gap-2 pb-20'>
        {tasks.map((task, index) => (
          <div
            key={index}
            className='bg-[#002247] flex items-center justify-between gap-2 p-3 rounded-lg'>
            <div className='flex items-center'>
              <task.Icon />
              <div className='ml-5'>
                <p>{task.text}</p>
                <div className='flex items-center mt-1'>
                  <div className='w-6 mr-1'>
                    <Image
                      width={100}
                      height={100}
                      alt='next'
                      src='/coineal.svg'
                    />
                  </div>
                  <p>{task.coin}</p>
                </div>
              </div>
            </div>
            {!socialTasksCompleted[task.id] ? (
              isLoading[task.id] ? (
                <div className='spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full border-blue-500 border-t-transparent'></div>
              ) : (
                <div onClick={() => handleSocialTask(task)} className='w-10'>
                  <Image width={100} height={100} alt='next' src='/next.svg' />
                </div>
              )
            ) : (
              <span className='text-green-500 animate-fade-in'>✔️</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
