"use client";
import React, { useState, useEffect } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Spinner from "./Spinner";
import Image from "next/image";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { Divider } from "@mui/material";
import { useStoreWallet } from "@/hooks/api";

const SOLANA_RPC_ENDPOINT =
  "https://solana-mainnet.g.alchemy.com/v2/Ezf44rp49UO6_D7pUfYjaXHFXwbIqRlc";

const APY_RATES = {
  30: 0.0125, // 1.25% APY for 30 days
};

const calculateDailyEarnings = (balance, apy, days) => {
  const totalRewards = balance * apy; // Total rewards for the period
  return totalRewards / days; // Daily earnings
};

const calculateTotalRewards = (balance, apy) => {
  return balance * apy; // Total rewards for the period
};

const RankingBadge = ({ rankingLevel }) => {
  const badges = {
    Gold: "🥇",
    Silver: "🥈",
    Bronze: "🥉",
    Diamond: "💎",
    Platinum: "🏆",
    Satoshi: "🌟",
  };
  return (
    <span className='font-bold text-green-400'>
      {badges[rankingLevel] || "❓"} {rankingLevel}
    </span>
  );
};

export default function InvestorTab({ user }) {
  const [address, setAddress] = useState(
    localStorage.getItem("solanaAddress") || ""
  );
  const [balance, setBalance] = useState(null);
  const [rankingLevel, setRankingLevel] = useState("Unknown");
  const [loading, setLoading] = useState(true);
  const [walletFetched, setWalletFetched] = useState(false);
  const { data, mutate } = useStoreWallet();

  console.log(data);

  useEffect(() => {
    const savedAddress = localStorage.getItem("solanaAddress");
    if (savedAddress) {
      setAddress(savedAddress);
      handleSubmit(); // Automatically fetch balance if an address is already saved
    } else setLoading(false);
  }, []);

  useEffect(() => {
    if (walletFetched) {
      localStorage.setItem("solanaAddress", address);
    }
  }, [walletFetched, address]);

  const isValidSolanaAddress = (address) => {
    try {
      new PublicKey(address);
      return true;
    } catch (err) {
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!address) {
      enqueueSnackbar("Please enter a Solana address.", {
        variant: "error",
      });
      return;
    }

    if (!isValidSolanaAddress(address)) {
      enqueueSnackbar("Invalid Solana address. Please check and try again.", {
        variant: "error",
      });
      return;
    }

    setLoading(true);

    try {
      const connection = new Connection(SOLANA_RPC_ENDPOINT);
      const publicKey = new PublicKey(address);
      const bibiTokenMintAddress =
        "HPywjr3AchS3Z7JGJRJ4oqxhpDAw7CgmUffCXsZHbq9G";
      const bibiTokenBalance = await getTokenBalance(
        connection,
        publicKey,
        bibiTokenMintAddress
      );

      mutate({ id: user?.id, address: address });
      setBalance(bibiTokenBalance);
      setRankingLevel(getRankingLevel(bibiTokenBalance));
      setWalletFetched(true);
      toast.success("Balance fetched successfully!");
    } catch (err) {
      console.error("Error fetching balance:", err);
      toast.error("Error fetching balance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getTokenBalance = async (connection, publicKey, tokenMintAddress) => {
    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        {
          mint: new PublicKey(tokenMintAddress),
        }
      );
      const balanceInfo =
        tokenAccounts.value[0]?.account?.data?.parsed?.info?.tokenAmount
          ?.uiAmount;
      return balanceInfo || 0;
    } catch (err) {
      console.error("Error fetching token balance:", err);
      return 0;
    }
  };

  const getRankingLevel = (balance) => {
    if (balance === null || balance === undefined) return "Unknown";
    if (balance > 5000000) return "Satoshi";
    if (balance > 1000000) return "Platinum";
    if (balance > 500000) return "Diamond";
    if (balance > 100000) return "Gold";
    if (balance > 50000) return "Silver";
    return "Bronze";
  };

  const maskAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-6)}`;
  };

  // APY and days settings
  const apy = APY_RATES[30]; // 10% APY
  const days = 30;

  const dailyEarnings =
    balance !== null ? calculateDailyEarnings(balance, apy, days) : 0;
  const totalEarnings =
    balance !== null ? calculateTotalRewards(balance, apy) : 0;

  const getBackgroundColor = (rankingLevel) => {
    switch (rankingLevel) {
      case "Gold":
        return "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600";
      case "Silver":
        return "bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500";
      case "Bronze":
        return "bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600";
      case "Diamond":
        return "bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600";
      case "Platinum":
        return "bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600";
      case "Satoshi":
        return "bg-gradient-to-r from-green-400 via-green-500 to-green-600";
      default:
        return "bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900";
    }
  };

  const handleChangeWallet = () => {
    setWalletFetched(false);
    setAddress("");
    setBalance(null);
    setRankingLevel("Unknown");
    localStorage.removeItem("solanaAddress");
  };

  return (
    <SnackbarProvider
      maxSnack={3}
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}>
      <div
        className={`w-full mx-auto mt-5 px-6 pb-6 pt-2 mb-20 rounded-lg shadow-lg`}>
        <div
          className={`flex items-center ${walletFetched && "justify-between"}`}>
          <div className='flex items-center'>
            <Image src='/cats.png' width={70} height={70} alt='Bibi' />
            <h1 className='text-yellow-400 font-bold text-center'>
              Bibi <span className='text-green-400'>Investor</span>
            </h1>
          </div>
          {walletFetched && (
            <div className='font-semibold'>@{user.username}</div>
          )}
        </div>

        {!walletFetched && (
          <p className='mt-2 text-lg mb-6'>
            Welcome, {user ? `@${user.username}` : "Guest"}! Please enter your
            Solana address to view your Bibi token balance and ranking level.
          </p>
        )}

        {!walletFetched && (
          <div className='mb-6'>
            <input
              type='text'
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder='Enter your Solana address'
              className='w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white focus:outline-none focus:border-blue-500'
            />
            <button
              onClick={handleSubmit}
              className='mt-4 w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors'>
              Fetch Balance
            </button>
          </div>
        )}

        {balance !== null && walletFetched && (
          <div className='my-2'>
            <div className='flex flex-wrap gap-2 mb-5'>
              <div className='bg-white px-3 font-semibold py-2 w-fit rounded-md shadow-xl'>
                <p className='text-slate-500 text-sm'>Bibi Balance</p>
                <div className='text-green-400 font-semibold pt-1 text-lg'>
                  {new Intl.NumberFormat().format(balance)}{" "}
                </div>
              </div>
              <div className='bg-white px-3 font-semibold py-2 w-fit rounded-md'>
                <p className='text-slate-500 text-sm'>Bibi Daily Earnings</p>
                <div className='text-green-400 font-semibold pt-1 text-lg'>
                  {new Intl.NumberFormat().format(dailyEarnings)}{" "}
                </div>
              </div>
              <div className='bg-white px-2.5 font-semibold py-2 w-fit rounded-md'>
                <p className='text-slate-500 text-sm'>
                  Total Rewards (30 days)
                </p>
                <div className='text-green-400 font-semibold pt-1 text-lg'>
                  {new Intl.NumberFormat().format(totalEarnings)}{" "}
                  <span className='text-slate-400'>Bibi</span>
                </div>
              </div>
              <div
                className={`${getBackgroundColor(
                  rankingLevel
                )} px-2.5 font-semibold py-2 w-fit rounded-md`}>
                <p className='text-slate-100 text-sm'>Ranking Level</p>
                <div className='text-green-400 font-semibold pt-1 text-lg'>
                  <RankingBadge rankingLevel={rankingLevel} />
                </div>
              </div>
              <div className='bg-white pl-3 pr-5 font-semibold py-2 w-fit rounded-md'>
                <p className='text-slate-500 text-sm'>Wallet Address</p>
                <div className='text-green-400 font-semibold pt-1 text-lg'>
                  {maskAddress(address)}
                </div>
              </div>
            </div>

            <p className='text-md my-5'>
              Your current earnings are based on the annual percentage yield
              (APY) and the duration for which your tokens have been staked. The
              APY and daily earnings can vary based on the duration of staking.
            </p>

            <Divider />

            <button
              onClick={handleChangeWallet}
              className='mt-4 w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors'>
              Change Wallet
            </button>
          </div>
        )}
        {!walletFetched && (
          <div className='text-sm mt-5'>
            ⓘ Your wallet address is secured and used solely to fetch your
            balance.
          </div>
        )}
        {loading && (
          <div className='absolute left-0 top-0 bg-slate-400 opacity-90 w-full'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}>
              <Spinner />
            </motion.div>
          </div>
        )}
      </div>
    </SnackbarProvider>
  );
}
