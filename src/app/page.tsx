"use client";

import React, { useState, useEffect } from "react";
import TapToEarnTab from "../components/TapToEarnTab";
import TaskTab from "../components/TaskTab";
import WalletPage from "../components/wallet-tab";
import Spinner from "../components/Spinner";
import { Avatar } from "@telegram-apps/telegram-ui";
import { useInitData, User } from "@telegram-apps/sdk-react";
import Profile from "../components/Profile";
import Image from "next/image";
import EarnTasks from "@/components/earn-tasks";
import ReferralTab from "@/components/ReferralTab";
import { authenticateUser } from "@/hooks/authenticate";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Home: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [currentTab, setCurrentTab] = useState("cryptolink");
  const initData = useInitData();

  useEffect(() => {
    const registerUser = async () => {
      if (initData && initData.user) {
        const referrerUid = initData.startParam
          ? Number(initData.startParam)
          : 0;

        setUser(initData.user);

        const userPayload = {
          uid: initData.user.id,
          first_name: initData.user.firstName || "Unknown",
          last_name: initData.user.lastName || "Unknown",
          username: initData.user.username || "Unknown",
          referrer_uid: referrerUid,
          is_premium: initData.user.isPremium || false,
          wallet_address: "", // Assuming you want to keep this empty for now
        };

        await authenticateUser(userPayload);
      }
    };

    registerUser();
  }, [initData]);

  // useEffect(() => {
  //   if (loadingStage < 3) {
  //     const interval = setInterval(() => {
  //       setProgress((prevProgress) => {
  //         if (prevProgress < 100) {
  //           return prevProgress + 1;
  //         } else {
  //           clearInterval(interval);
  //           setLoadingStage((prevStage) => prevStage + 1);
  //           setProgress(0);
  //           return 0;
  //         }
  //       });
  //     }, 20);
  //     return () => clearInterval(interval);
  //   }
  // }, [loadingStage]);

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
      id: "wallet",
      text: "Wallet",
      Icon: () => (
        <div className='w-7'>
          <Image src='/wallet.png' alt='' width={100} height={100} priority />
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
      case "wallet":
        return <WalletPage user={user} />;
      default:
        return null;
    }
  };

  const handleTabChange = (tabId: string) => {
    setCurrentTab(tabId);
  };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <div className='tab-content bg-[#232e3c] text-white'>
        {renderTabContent()}
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
      </div>
    </QueryClientProvider>
  );
};

export default Home;
