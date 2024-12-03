"use client";

import React, { useState, useEffect } from "react";
import TapToEarnTab from "../components/TapToEarnTab";
import TaskTab from "../components/TaskTab";
import StatsTab from "../components/StatsTab";
import Spinner from "../components/Spinner";
import { Avatar } from "@telegram-apps/telegram-ui";
import { useInitData, User } from "@telegram-apps/sdk-react";
import Profile from "../components/Profile";
import Image from "next/image";
import EarnTasks from "@/components/earn-tasks";
import ReferralTab from "@/components/ReferralTab";
import { authenticateUser } from "@/hooks/authenticate";

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTab, setCurrentTab] = useState("cryptolink");
  const initData = useInitData();

  useEffect(() => {
    if (initData && initData.user) {
      setUser(initData.user);

      const user = {
        uid: initData.user?.id,
        first_name: initData.user?.firstName,
        last_name: initData.user?.lastName,
        username: initData.user?.username,
        is_premium: initData.user?.isPremium,
      };

      authenticateUser(user);
    }
  }, [initData?.user]);

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
      }, 20);
      return () => clearInterval(interval);
    }
  }, [loadingStage]);

  const tabs = [
    {
      id: "cryptolink",
      text: "Cryptolink",
      Icon: () => (
        <div className='w-7'>
          <Image src='/coineal.svg' alt='' width={100} height={100} priority />
        </div>
      ),
    },
    {
      id: "tapToEarn",
      text: "Earn",
      Icon: () => (
        <div className='w-7'>
          <Image src='/earn.svg' alt='' width={100} height={100} priority />
        </div>
      ),
    },
    {
      id: "invite",
      text: "Invite",
      Icon: () => (
        <div className='w-7'>
          <Image src='/axe.svg' alt='' width={100} height={100} priority />
        </div>
      ),
    },
    {
      id: "airdrop",
      text: "Airdrops",
      Icon: () => (
        <div className='w-7'>
          <Image src='/coineal.svg' alt='' width={100} height={100} priority />
        </div>
      ),
    },
  ];

  const renderTabContent = () => {
    switch (currentTab) {
      case "cryptolink":
        return <TapToEarnTab user={user} />;
      case "tapToEarn":
        return <EarnTasks />;
      case "invite":
        return <ReferralTab user={user} />;
      case "airdrop":
        return <StatsTab user={user} />;
      default:
        return null;
    }
  };

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  return (
    <>
      <div className='tab-content'>{renderTabContent()}</div>
      <div className='w-[96%] flex justify-around bg-[#2A522B] bg-opacity-50 backdrop-blur-sm rounded-lg p-4 fixed bottom-0 left-[2%]'>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`flex items-center justify-center flex-col text-white gap-1 ${
              currentTab === tab.id ? "" : "opacity-50"
            }`}>
            <tab.Icon />
            <span className='text-xs mt-1'>{tab.text}</span>
          </button>
        ))}
      </div>
      {loadingStage < 3 && (
        <div className='loading-bar'>
          <div className='progress' style={{ width: `${progress}%` }}></div>
        </div>
      )}
    </>
  );
};

export default Home;
