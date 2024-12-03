"use client";
import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import axios from "axios";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { fetchBal } from "@/hooks/displayBalance";

export default function WalletPage({ user }) {
  const [liveData, setLiveData] = useState({
    sol: { price: 0, change: 0, iconUrl: "" },
    usdt: { price: 0, change: 0, iconUrl: "" },
    bibi: { price: 0, change: 0, iconUrl: "" },
  });
  const [solBalance, setSolBalance] = useState(0);
  const [bibiBalance, setBibiBalance] = useState(0); // State for Bibi balance
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();

  const connectPhantomWithParams = () => {
    const dappEncryptionPublicKey = "5i0500i0560506050605-565i65"; // Replace with valid key
    const redirectLink = encodeURIComponent("https://t.me/Bibiapp_bot/app");
    const cluster = "mainnet-beta";

    const deepLinkUrl = `phantom://connect?dapp_encryption_public_key=${dappEncryptionPublicKey}&redirect_link=${redirectLink}&cluster=${cluster}`;
    window.open(deepLinkUrl, "_blank");
  };

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
        const bibiToken = bibiData.pairs[0];

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
            price: parseFloat(bibiToken.priceUsd),
            change: bibiToken.priceChange.h24,
            iconUrl: bibiToken.info.imageUrl,
          },
        });
      } catch (error) {
        console.error("Error fetching prices", error);
      }
    }

    const getBalance = async () => {
      try {
        const balance = await fetchBal();
        setBibiBalance(balance); // No need to format here, it's used in calculations
      } catch (err) {
        console.error("Failed to fetch Bibi balance:", err);
      }
    };

    fetchPrices();
    getBalance();
  }, []);

  useEffect(() => {
    if (publicKey) {
      const getBalanceEvery10Seconds = async () => {
        try {
          const newBalance = await connection.getBalance(publicKey);
          setSolBalance(newBalance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Error fetching SOL balance:", error);
        }
        setTimeout(getBalanceEvery10Seconds, 10000);
      };
      getBalanceEvery10Seconds();
    }
  }, [publicKey, connection]);

  const modifyBibiValue = (value) => {
    if (value < 0.001) {
      return "<$0.01";
    } else return `$${value}`;
  };

  return (
    <div className='bg-gray-900 p-4 pb-12 max-w-4xl mx-auto space-y-6'>
      {/* Wallet Overview */}
      <div className='bg-gray-800 text-center p-6 rounded-lg shadow-md'>
        <p className='text-5xl font-semibold'>
          $
          {bibiBalance && liveData.bibi.price
            ? (bibiBalance * liveData.bibi.price).toFixed(2)
            : "0.00"}
        </p>
        <div className='flex justify-center items-center gap-2 mt-2'>
          <p className='text-green-400 text-lg font-semibold'>
            {modifyBibiValue(liveData.bibi.price)}
          </p>
          <p
            className={`font-semibold  px-2 py-0.5 bg-opacity-60 rounded-sm ${
              liveData.bibi.change > 0
                ? "text-green-600 bg-green-900"
                : "text-red-600 bg-red-900"
            }`}>
            {`${
              liveData.bibi.change > 0 ? "+" : ""
            }${liveData.bibi.change.toFixed(2)}`}
          </p>
        </div>
      </div>

      {/* Coins action */}
      <div className='flex items-center gap-2'>
        <button
          onClick={connectPhantomWithParams}
          className='bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-lg'>
          Buy
        </button>
        <div className='text-slate-400 text-xs'>
          Scroll down to see Bibi Chart
        </div>
      </div>

      {/* Coins Section */}
      <div className='flex flex-col gap-2'>
        {[
          {
            name: "Bibi",
            amount: bibiBalance,
            value: liveData.bibi.price,
            change: liveData.bibi.change,
            iconUrl: liveData.bibi.iconUrl,
          },
          {
            name: "Solana",
            amount: solBalance,
            value: liveData.sol.price,
            change: liveData.sol.change,
            iconUrl: liveData.sol.iconUrl,
          },
          {
            name: "USDT",
            amount: 0, // Static value; update as needed
            value: liveData.usdt.price,
            change: liveData.usdt.change,
            iconUrl: liveData.usdt.iconUrl,
          },
        ].map((coin) => {
          return (
            <div
              key={coin.name}
              className='bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between'>
              <div className='flex items-center'>
                <img
                  src={coin.iconUrl}
                  alt={coin.name}
                  className='h-8 w-8 mr-2'
                />
                <div>
                  <p className='text-white font-semibold'>{coin.name}</p>
                  <p className='text-slate-300 text-sm'>
                    {modifyBibiValue(coin.value.toFixed(2))} • {coin.amount}{" "}
                    {coin.name}
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center text-sm ${
                  coin.change > 0 ? "text-green-500" : "text-red-500"
                }`}>
                {coin.change > 0 ? <FaArrowUp /> : <FaArrowDown />}
                <span className='ml-1'>{coin.change.toFixed(2)}%</span>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <iframe
          className='w-full h-[90vh]'
          src='https://dexscreener.com/solana/BoAwAQ2cduR61tt8prdw5SsqZMYAher1KLggu1jsxPL1?embed=1&theme=dark&trades=0&info=0'></iframe>
      </div>
    </div>
  );
}
