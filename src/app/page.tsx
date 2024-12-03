// Home.jsx
'use client'
import React, { useState, useEffect } from 'react';
import TapToEarnTab from '../components/TapToEarnTab';
import TaskTab from '../components/TaskTab';
import StatsTab from '../components/StatsTab';
import Spinner from '../components/Spinner';
import { Avatar } from '@telegram-apps/telegram-ui';
import { useInitData, User } from '@telegram-apps/sdk-react';
import Profile from '../components/Profile'; // Import Profile component

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingStage, setLoadingStage] = useState(0); // 0: fetching user data, 1: verifying, 2: getting things ready
  const [progress, setProgress] = useState(0);
  const [currentTab, setCurrentTab] = useState('tapToEarn'); // Initialize currentTab with default tab
  const initData = useInitData();

  // Effect to set user state when initData changes
  useEffect(() => {
    if (initData && initData.user) {
      setUser(initData.user);
    }
  }, [initData]);

  // Effect to simulate loading stages
  useEffect(() => {
    if (loadingStage < 3) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress < 100) {
            return prevProgress + 1;
          } else {
            clearInterval(interval);
            setLoadingStage((prevStage) => prevStage + 1);
            setProgress(0);
            return 0;
          }
        });
      }, 20); // Adjust the speed as necessary
      return () => clearInterval(interval);
    }
  }, [loadingStage]);

  const tabs = [
    { id: 'profile', text: 'Profile', Icon: () => <Avatar size={20} src="https://avatars.githubusercontent.com/u/84640980?v=4" /> },
    { id: 'tapToEarn', text: 'Tap', Icon: () => <span style={{ fontSize: '24px' }}>🎁</span> },
    { id: 'tasks', text: 'Tasks', Icon: () => <span style={{ fontSize: '24px' }}>📋</span> },
    { id: 'stats', text: 'Stats', Icon: () => <span style={{ fontSize: '24px' }}>📊</span> },
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case 'profile':
        return <Profile user={user} />;
      case 'tapToEarn':
        return <TapToEarnTab />;
      case 'tasks':
        return <TaskTab />;
      case 'stats':
        return <StatsTab />;
      default:
        return null;
    }
  };

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  return (
    <div>
      <div className="tab-content">
        {renderTabContent()}
      </div>
      <div className="bottom-navigation flex justify-around bg-gray-800 p-4 fixed bottom-0 left-0 right-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center justify-center flex-col text-white ${currentTab === tab.id ? 'text-blue-500' : ''}`}
          >
            <tab.Icon />
            <span className="text-xs mt-1">{tab.text}</span>
          </button>
        ))}
      </div>
      {loadingStage < 3 && (
        <div className="loading-bar">
          <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </div>
  );
};

export default Home;
