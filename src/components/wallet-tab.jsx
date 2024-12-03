"use client";
import React from "react";
import {
  FaCoins,
  FaArrowUp,
  FaArrowDown,
  FaWallet,
  FaArrowRight,
} from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";

// Dummy data for testing
const dummyUser = {
  balance: 10000,
  coins: [
    { name: "Bibi", amount: 150, value: 3000, change: -2.5, icon: <FaCoins /> },
    {
      name: "Solana",
      amount: 25,
      value: 1200,
      change: +5.4,
      icon: <FaCoins />,
    },
    {
      name: "Bitcoin",
      amount: 0.05,
      value: 2500,
      change: +1.8,
      icon: <FaCoins />,
    },
    {
      name: "Ethereum",
      amount: 1.2,
      value: 2200,
      change: -0.6,
      icon: <FaCoins />,
    },
  ],
  transactions: [
    {
      id: 1,
      description: " Bibi",
      date: "2024-08-18",
      type: "deposit",
      amount: "$3000",
    },
    {
      id: 2,
      description: "Bitcoin",
      date: "2024-08-17",
      type: "withdrawal",
      amount: "$2500",
    },
    {
      id: 3,
      description: "Ethereum",
      date: "2024-08-16",
      type: "deposit",
      amount: "$2200",
    },
    {
      id: 4,
      description: "Deposit",
      date: "2024-08-15",
      type: "deposit",
      amount: "$5000",
    },
  ],
};

export default function WalletPage({ user }) {
  const { balance, coins, transactions } = dummyUser;

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
          <button className='bg-green-500  text-white font-bold py-2 px-4 rounded-lg flex items-center'>
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
        {coins.map((coin) => (
          <div
            key={coin.name}
            className='bg-gray-800 p-6 rounded-lg shadow-lg flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='text-3xl text-yellow-500'>{coin.icon}</div>
              <div>
                <h3 className='text-xl font-bold'>{coin.name}</h3>
                <p className='text-sm text-gray-400'>
                  {coin.change >= 0 ? "+" : ""}
                  {coin.change}%
                </p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-lg font-semibold text-green-500'>
                {coin.amount}
              </p>
              <p className='text-sm text-gray-400'>${coin.value.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Transaction History Section */}
      <div className='bg-gray-800 px-6 py-4 rounded-lg shadow-lg '>
        <h3 className='text-2xl font-bold mb-4'>Transaction History</h3>
        <div className='space-y-2'>
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={`flex justify-between items-center py-2 border-gray-700 ${
                index !== transactions.length - 1 && "border-b"
              }`}>
              <div>
                <p className='font-semibold'>{transaction.description}</p>
                <p className='text-sm text-gray-400'>{transaction.date}</p>
              </div>
              <p
                className={`text-lg font-bold ${
                  transaction.type === "deposit"
                    ? "text-green-500"
                    : "text-red-500"
                }`}>
                {transaction.type === "deposit" ? "+" : "-"}
                {transaction.amount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
