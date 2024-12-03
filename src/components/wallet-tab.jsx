"use client";
import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import axios from "axios";

// Dummy data for testing
const dummyUser = {
  balance: 10000,
  coins: [
    { name: "Bibi", amount: 150, value: 3000, change: -2.5, iconUrl: "https://example.com/bibi-icon.png" }, // Placeholder URL
    {
      name: "Solana",
      amount: 25,
      value: 1200,
      change: 0, // Will be updated with live data
      iconUrl: "https://example.com/solana-icon.png", // Placeholder URL
    },
    {
      name: "USDT",
      amount: 1000,
      value: 1000,
      change: 0, // Will be updated with live data
      iconUrl: "https://example.com/usdt-icon.png", // Placeholder URL
    },
  ],
};

export default function WalletPage({ user }) {
  const [liveData, setLiveData] = useState({
    sol: { price: 0, change: 0, iconUrl: '' },
    usdt: { price: 0, change: 0, iconUrl: '' }
  });

  useEffect(() => {
    async function fetchPrices() {
      try {
        const { data: solData } = await axios.get(
          'https://api.coingecko.com/api/v3/coins/solana?localization=false'
        );
        const { data: usdtData } = await axios.get(
          'https://api.coingecko.com/api/v3/coins/tether?localization=false'
        );
        setLiveData({
          sol: {
            price: solData.market_data.current_price.usd,
            change: solData.market_data.price_change_percentage_24h,
            iconUrl: solData.image.large
          },
          usdt: {
            price: usdtData.market_data.current_price.usd,
            change: usdtData.market_data.price_change_percentage_24h,
            iconUrl: usdtData.image.large
          }
        });
      } catch (error) {
        console.error("Error fetching prices", error);
      }
    }
    fetchPrices();
  }, []);

  const { balance, coins } = dummyUser;

  return (
    <div className='bg-gray-900 p-4 pb-24 max-w-4xl mx-auto space-y-4'>
      {/* Wallet Overview */}
      <div className='bg-gray-800 p-6 rounded-lg'>
        <p className='text-slate-300 mb-1.5'>Hi, {user?.firstName}</p>
        <div className='flex items-center mb-4'>
          <FaWallet className='text-2xl text-green-500 mr-2 mt-1' />
          <p className='text-2xl font-semibold text-green-500'>${balance}</p>
        </div>
        <div className='flex flex-wrap gap-2 gap-y-3'>
          <button className='bg-green-500 text-white font-bold py-2 px-4 rounded-lg flex items-center'>
            <FaArrowDown className='mr-1.5' /> Deposit
          </button>
          <button className='bg-red-500 text-white font-bold py-2 px-4 rounded-lg flex items-center'>
            <FaArrowUp className='mr-1.5' /> Withdraw
          </button>
          <button className='bg-blue-500 text-white font-bold py-2 px-4 rounded-lg flex items-center'>
            <GiMoneyStack className='mr-1.5' /> Stake
          </button>
        </div>
      </div>

      {/* Coins Section */}
      <div className='flex flex-col gap-2'>
        {coins.map((coin) => {
          const isSolana = coin.name === "Solana";
          const isUsdt = coin.name === "USDT";
          const iconUrl = isSolana ? liveData.sol.iconUrl : (isUsdt ? liveData.usdt.iconUrl : coin.iconUrl);
          const price = isSolana ? liveData.sol.price : (isUsdt ? liveData.usdt.price : coin.value);
          const change = isSolana ? liveData.sol.change : (isUsdt ? liveData.usdt.change : coin.change);

          return (
            <div
              key={coin.name}
              className='bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <img src={iconUrl} alt={coin.name} className='w-8 h-8' />
                <div>
                  <h3 className='text-xl font-bold'>{coin.name}</h3>
                  {/* Show percentage change only for SOL and USDT */}
                  {(isSolana || isUsdt) && (
                    <p className='text-sm text-gray-400'>
                      {change.toFixed(2)}%
                    </p>
                  )}
                </div>
              </div>
              <div className='text-right'>
                {/* Display live price for SOL and USDT, and amount for Bibi */}
                <p className='text-2xl font-semibold text-green-500'>
                  ${price.toFixed(2)}
                </p>
                {/* Display live price label and percentage change for SOL and USDT */}
                {(isSolana || isUsdt) && (
                  <p className='text-sm text-gray-400'>
                    {`Change: ${change.toFixed(2)}%`}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
