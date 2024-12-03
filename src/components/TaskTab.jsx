import React, { useState, useEffect } from 'react';

const TASKS_CONFIG = [
  {
    id: 'twitterFollow',
    label: 'Follow $coinapp on Twitter',
    url: 'https://twitter.com/{name}',
    actionText: 'Follow',
  },
  {
    id: 'instagramFollow',
    label: 'Follow $coinapp on Instagram',
    url: 'https://www.instagram.com/{name_of_instagram}/',
    actionText: 'Follow',
  },
  {
    id: 'telegramJoin',
    label: 'Join Telegram group',
    actionText: 'Join',
    customAction: true, // Special case for custom action
  },
  {
    id: 'twitterRetweet',
    label: 'Retweet',
    url: 'https://twitter.com/{retweet_link}',
    actionText: 'Retweet',
  },
  {
    id: 'buyTokens',
    label: 'Buy tokens',
    actionText: 'Buy Tokens',
    customAction: true, // Special case for custom action
  },
  {
    id: 'pumpFunPage',
    label: 'Check out our PumpFun page',
    url: 'https://pump.fun/coin/DNCERqVsdCdoeKWNt9EBCpdqci97cY4X8eVhnzqqpump',
    actionText: 'Visit Page',
  },
];

export default function TaskTab() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState({});
  const [socialTasksCompleted, setSocialTasksCompleted] = useState({});
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    const storedPoints = localStorage.getItem('totalPoints');
    if (storedPoints) {
      setTotalPoints(parseInt(storedPoints));
    }
    
    // Add console.log to check TASKS_CONFIG
    console.log("TASKS_CONFIG:", TASKS_CONFIG);
  }, []);

  const handleLogin = () => {
    setLoggedIn(true);
    // Logic for rewarding daily login
    // Example: Reward points, increase streak, etc.
  };

  const handleSocialTask = (task) => {
    setIsLoading((prevLoading) => ({ ...prevLoading, [task.id]: true }));

    if (task.customAction) {
      if (task.id === 'telegramJoin') {
        checkTelegramJoinStatus(task);
      } else if (task.id === 'buyTokens') {
        completeTask(task.id);
      }
    } else {
      window.open(task.url, '_blank');
      setTimeout(() => {
        completeTask(task.id);
      }, 10000); // 10 seconds delay to simulate task completion
    }
  };

  const completeTask = (taskId) => {
    setIsLoading((prevLoading) => ({ ...prevLoading, [taskId]: false }));
    setSocialTasksCompleted((prevTasks) => ({ ...prevTasks, [taskId]: true }));
    updateTotalPoints(2); // Add 2 points for completing the task
  };

  const updateTotalPoints = (points) => {
    const newTotalPoints = totalPoints + points;
    setTotalPoints(newTotalPoints);
    localStorage.setItem('totalPoints', newTotalPoints.toString());
  };

  const checkTelegramJoinStatus = (task) => {
    // Simulating checking if user has joined Telegram group
    const hasJoinedTelegram = true; // Replace with actual logic to check membership

    if (hasJoinedTelegram) {
      completeTask(task.id);
      window.open('https://t.me/{telegram_link}', '_blank'); // Open Telegram group link if joined
    } else {
      alert('Please join the Telegram group to complete this task.');
      setIsLoading((prevLoading) => ({ ...prevLoading, [task.id]: false }));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-900 to-black text-white font-sans">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">Complete the Challenges, Earn the Rewards!</h2>
        <h3 className="text-2xl mb-4">Total Points: {totalPoints}</h3>
      </div>

      <div className="w-full max-w-lg bg-gradient-to-b from-blue-900 to-black rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-4 text-center text-gray-300">Social Media Tasks</h3>
        <ul className="space-y-4">
          {TASKS_CONFIG.map((task) => (
            <li key={task.id} className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="font-semibold text-gray-300">{task.label}:</span>
              {!socialTasksCompleted[task.id] ? (
                isLoading[task.id] ? (
                  <div className="spinner-border animate-spin inline-block w-4 h-4 border-4 rounded-full border-blue-500 border-t-transparent"></div>
                ) : (
                  <button
                    onClick={() => handleSocialTask(task)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
                  >
                    {task.actionText}
                  </button>
                )
              ) : (
                <span className="text-green-500 animate-fade-in">✔️</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
