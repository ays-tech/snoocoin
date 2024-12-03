"use client";
import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";
import axios from "axios";
import { Connection } from "@solana/web3.js";
import { useWallet, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton, WalletDisconnectButton } from "@solana/wallet-adapter-react-ui";
import { CopyToClipboard } from "react-copy-to-clipboard";

// Set up the connection to the Solana blockchain
const connection = new Connection("https://api.mainnet-beta.solana.com");

// Dummy data for testing
const dummyUser = {
  balance: 10000, // Will be updated with real balance
  coins: [
    {
      name: "Bibi",
      amount: 150,
      value: 3000,
      change: -2.5,
      iconUrl: "/bibi_image.webp", // Placeholder URL
    },
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
    sol: { price: 0, change: 0, iconUrl: "" },
    usdt: { price: 0, change: 0, iconUrl: "" },
    bibi: { price: 0, change: 0, iconUrl: "" },
  });
  const [solBalance, setSolBalance] = useState(0);
  const [copied, setCopied] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [error, setError] = useState(null);

  const { publicKey, connected, connect, disconnect } = useWallet();

  useEffect(() => {
    async function fetchPrices() {
      try {
        const { data: solData } = await axios.get(
          "https://api.coingecko.com/api/v3/coins/solana?localization=false"
        );
        const { data: usdtData } = await axios.get(
          "https://api.coingecko.com/api/v3/coins/tether?localization=false"
        );
        const { data: bibiData } = await axios.get(
          "https://api.dexscreener.com/latest/dex/tokens/HPywjr3AchS3Z7JGJRJ4oqxhpDAw7CgmUffCXsZHbq9G"
        );
        
        setLiveData({
          sol: {
            price: solData.market_data.current_price.usd,
            change: solData.market_data.price_change_percentage_24h,
            iconUrl: solData.image.large,
          },
          usdt: {
            price: usdtData.market_data.current_price.usd,
            change: usdtData.market_data.price_change_percentage_24h,
            iconUrl: usdtData.image.large,
          },
          bibi: {
            price: bibiData.pairs[0].priceUsd,
            change: bibiData.pairs[0].priceChange.h24,
            iconUrl: bibiData.pairs[0].info.imageUrl,
          },
        });
      } catch (error) {
        console.error("Error fetching prices", error);
      }
    }
    fetchPrices();
  }, []);

  useEffect(() => {
    async function fetchSolBalance() {
      if (publicKey) {
        try {
          const balance = await connection.getBalance(publicKey);
          setSolBalance(balance / 1e9); // Convert lamports to SOL
        } catch (error) {
          console.error("Error fetching SOL balance", error);
        }
      }
    }
    fetchSolBalance();
  }, [publicKey]);

  const { balance, coins } = dummyUser;

  const handleConnect = async () => {
    if (selectedWallet) {
      try {
        await connect(selectedWallet);
        setModalIsOpen(false);
      } catch (error) {
        console.error("Error connecting wallet", error);
        setError("Error connecting wallet. Please try again.");
      }
    }
  };

  return (
    <div className="bg-gray-900 p-4 pb-24 max-w-4xl mx-auto space-y-6">
      {/* Modal for Wallet Selection */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Connect Wallet"
        className="bg-gray-800 p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <h2 className="text-xl font-bold text-white mb-4">Connect Your Wallet</h2>
        <div className="space-y-2">
          <button 
            onClick={() => setSelectedWallet("phantom")} 
            className={`bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 ${selectedWallet === "phantom" ? "border border-white" : ""}`}
          >
            Phantom
          </button>
          <button 
            onClick={() => setSelectedWallet("sollet")} 
            className={`bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 ${selectedWallet === "sollet" ? "border border-white" : ""}`}
          >
            Sollet
          </button>
          {/* Add more wallet options as needed */}
        </div>
        <button 
          onClick={handleConnect} 
          className="bg-gradient-to-r from-blue-400 to-purple-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105 mt-4"
        >
          Connect
        </button>
        <button 
          onClick={() => setSelectedWallet(null)} 
          className="text-gray-400 mt-2"
        >
          Reselect Wallet
        </button>
      </Modal>

      {/* Wallet Overview */}
      <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
        <p className='text-slate-300 mb-1.5'>Hi, {user?.firstName}</p>
        <div className='flex items-center mb-4'>
          <FaWallet className='text-2xl text-green-500 mr-2 mt-1' />
          <p className='text-2xl font-semibold text-green-500'>
            $
            {connected ? (solBalance * liveData.sol.price).toFixed(2) : balance}
          </p>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="flex justify-between items-center bg-gray-800 p-6 rounded-lg shadow-md">
        <div>
          <h3 className="text-xl font-bold text-white">
            {connected ? "Wallet Connected" : "Not Connected"}
          </h3>
          {connected && (
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-gray-400">
                {publicKey.toString().slice(0, 5)}...{publicKey.toString().slice(-5)}
              </span>
              <CopyToClipboard
                text={publicKey.toString()}
                onCopy={() => setCopied(true)}
              >
                <button className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600 transition">
                  {copied ? "Copied!" : "Copy"}
                </button>
              </CopyToClipboard>
            </div>
          )}
        </div>
        <div>
          {!connected ? (
            <button onClick={() => setModalIsOpen(true)} className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105">
              Connect Wallet
            </button>
          ) : (
            <WalletDisconnectButton className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105" />
          )}
        </div>
      </div>

      {/* Coins Section */}
      <div className='flex flex-col gap-2'>
        {coins.map((coin) => {
          const isSolana = coin.name === "Solana";
          const isUsdt = coin.name === "USDT";
          const isBibi = coin.name === "Bibi";
          const iconUrl = isSolana
            ? liveData.sol.iconUrl
            : isUsdt
            ? liveData.usdt.iconUrl
            : isBibi
            ? liveData.bibi.iconUrl
            : coin.iconUrl;
          const price = isSolana
            ? liveData.sol.price
            : isUsdt
            ? liveData.usdt.price
            : isBibi
            ? liveData.bibi.price
            : coin.value;
          const change = isSolana
            ? liveData.sol.change
            : isUsdt
            ? liveData.usdt.change
            : isBibi
            ? liveData.bibi.change
            : coin.change;

          return (
            <div
              key={coin.name}
              className='bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between'>
              <div className='flex items-center space-x-4'>
                <img src={iconUrl} alt={coin.name} className='w-8 h-8' />
                <div>
                  <h3 className='text-xl font-bold'>{coin.name}</h3>
                  {(isSolana || isUsdt || isBibi) && (
                    <p className='text-sm text-gray-400'>
                      {change.toFixed(2)}%
                    </p>
                  )}
                </div>
              </div>
              <div className='text-right'>
                <p className='text-2xl font-semibold text-green-500'>
                  ${price.toFixed(2)}
                </p>
                {(isSolana || isUsdt || isBibi) && (
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
