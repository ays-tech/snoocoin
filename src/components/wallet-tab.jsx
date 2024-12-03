"use client";
import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import axios from "axios";
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Tooltip } from "@mui/material";
import { useUtils } from "@telegram-apps/sdk-react";

// Utility function to detect mobile devices
const isMobile = () => {
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

// Bibi Token Mint Address
const BIBI_MINT_ADDRESS = "So11111111111111111111111111111111111111112";

export default function WalletPage({ user }) {
  const [liveData, setLiveData] = useState({
    sol: { price: 0, change: 0, iconUrl: "" },
    usdt: { price: 0, change: 0, iconUrl: "" },
    bibi: { price: 0, change: 0, iconUrl: "" },
  });
  const [solBalance, setSolBalance] = useState(0);
  const [bibiBalance, setBibiBalance] = useState(0); // State for Bibi balance
  const [copied, setCopied] = useState(false);
  const [walletChange, setWalletChange] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  const { openLink } = useUtils(); // Destructure openLink from useUtil

  const handleRaydiumClick = () => {
    // Deeplink to open Raydium swap in the Phantom wallet app
    const raydiumLink = "https://raydium.io/swap";
    openLink(raydiumLink); // Use openLink to open it externally
  };

  // Handler to connect wallet using Phantom
  const handleWalletConnect = () => {
    // Deeplink to connect to Phantom wallet
    const connectLink = "https://phantom.app/ul/v1/connect";
    openLink(connectLink); // Use openLink to open it externally
  };

  const connectPhantomWithParams = () => {
    // Replace these with actual values from your app's settings
    const dappEncryptionPublicKey = "5i0500i0560506050605-565i65"; // Ensure this is valid and correctly generated
    const redirectLink = encodeURIComponent("https://t.me/Bibiapp_bot/app"); // Ensure this URL is correct and encoded properly
    const cluster = "mainnet-beta"; // Ensure this value is correct for your environment

    // Construct the deep link URL with parameters
    const deepLinkUrl = `phantom://connect?dapp_encryption_public_key=${dappEncryptionPublicKey}&redirect_link=${redirectLink}&cluster=${cluster}`;

    // Open the deep link in a new window
    window.open(deepLinkUrl, '_blank');
};


const openPhantomAndSwap = () => {
  const raydiumSwapUrl = "https://raydium.io/swap/?input=SOL&output=BIBI";
  
  // Open the deep link
  window.open(raydiumSwapUrl, '_blank');
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
    fetchPrices();
  }, []);

  useEffect(() => {
    if (publicKey) {
      console.log("Public key detected:", publicKey.toString());

      const getBalanceEvery10Seconds = async () => {
        try {
          console.log("Fetching SOL balance...");
          const newBalance = await connection.getBalance(publicKey);
          console.log(
            "Fetched new SOL balance:",
            newBalance / LAMPORTS_PER_SOL
          );
          setSolBalance(newBalance / LAMPORTS_PER_SOL);
        } catch (error) {
          console.error("Error fetching SOL balance:", error);
        }
        setTimeout(getBalanceEvery10Seconds, 10000);
      };
      getBalanceEvery10Seconds();
    } else {
      console.log("No public key, wallet not connected.");
    }
  }, [publicKey, connection]);

  useEffect(() => {
    if (publicKey) {
      console.log(
        "Fetching Bibi token balance for publicKey:",
        publicKey.toString()
      );

      const getBibiBalanceEvery10Seconds = async () => {
        try {
          // Check if mint address is valid
          const mintPublicKey = new PublicKey(BIBI_MINT_ADDRESS);
          if (!PublicKey.isOnCurve(mintPublicKey)) {
            throw new Error("Invalid mint address for Bibi token");
          }

          const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            {
              mint: mintPublicKey,
            }
          );

          if (tokenAccounts.value.length > 0) {
            const bibiAccount = tokenAccounts.value[0];
            const bibiAmount =
              bibiAccount.account.data.parsed.info.tokenAmount.uiAmount;
            console.log("Fetched Bibi balance:", bibiAmount);
            setBibiBalance(bibiAmount);
          } else {
            console.log("No Bibi tokens found in wallet");
            setBibiBalance(0); // No Bibi tokens found
          }
        } catch (error) {
          console.error("Error fetching Bibi token balance:", error);
          if (error.message.includes("could not find mint")) {
            console.error(
              "It seems the provided mint address might be incorrect or invalid."
            );
          }
        }

        // Set a timeout to call this function again after 10 seconds
        setTimeout(getBibiBalanceEvery10Seconds, 10000);
      };
      getBibiBalanceEvery10Seconds();
    }
  }, [publicKey, connection]);

  return (
    <div className='bg-gray-900 p-4 pb-24 max-w-4xl mx-auto space-y-6'>
      {/* Wallet Overview */}
      <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
        <p className='text-slate-300 mb-1.5'>Hi, {user?.firstName}</p>
        <div className='flex items-center mb-4'>
          <FaWallet className='text-2xl text-green-500 mr-2 mt-1' />
          <p className='text-2xl font-semibold text-green-500'>
            ${connected ? (solBalance * liveData.sol.price).toFixed(2) : "0.00"}
          </p>
        </div>
        <div className='flex flex-wrap gap-2'></div>
        <button
          onClick={connectPhantomWithParams} // Directly call the function
          className='bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-lg'>
          Buy
        </button>

        {/* 
    Commenting out the modal logic
    {isModalOpen && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10'>
            <div className='bg-gray-900 py-6 rounded-lg shadow-lg w-3/4 text-gray-300 relative'>
                <button
                    className='absolute top-2 right-4 text-gray-400 hover:text-gray-100 transition text-2xl'
                    onClick={() => setIsModalOpen(false)}>
                    &times;
                </button>
                <h2 className='text-2xl font-bold mb-4 px-6'>
                    Choose an option
                </h2>
                <div className='flex flex-col items-start font-semibold'>
                    <button
                        className='px-6 py-2 w-full text-left hover:bg-slate-700 bg-opacity-25'
                        onClick={handleRaydiumClick} // Corrected
                    >
                        Raydium
                    </button>
                    <button
                        className='px-6 py-2 w-full text-left hover:bg-slate-700 bg-opacity-25'
                        onClick={() => window.open('https://dexscreener.com/solana/boawaq2cdur61tt8prdw5ssqzmyaher1klggu1jsxpl1', '_blank')}
                    >
                        Dexscreener
                    </button>
                    <button
                        className='px-6 py-2 w-full text-left hover:bg-slate-700 bg-opacity-25'
                        onClick={connectPhantomWithParams}
                    >
                        Phantom
                    </button>
                    <button
                        className='px-6 py-2 w-full text-left hover:bg-slate-700 bg-opacity-25'
                        disabled
                    >
                        <Tooltip title='Coming soon'>Telegram</Tooltip>
                    </button>
                </div>
            </div>
        </div>
    )}
    */}

        {/* Swap feature is commented out for now */}
        {/* <Tooltip title='Coming soon'>
        <button className='bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-lg'>
            Swap
        </button>
    </Tooltip> */}
      </div>

      {/* Wallet Connection */}
      {/* <div className='bg-gray-800 p-6 rounded-lg shadow-md'>
        <div className='flex justify-between items-center '>
          <div>
            <h3 className='text-xl font-bold text-white'>
              {connected ? "Wallet Connected" : "Not Connected"}
            </h3>
            {connected && (
              <div className='flex items-center space-x-2 mt-1'>
                <span className='text-sm text-gray-400'>
                  {publicKey.toString().slice(0, 5)}...
                  {publicKey.toString().slice(-5)}
                </span>
                <CopyToClipboard
                  text={publicKey.toString()}
                  onCopy={() => setCopied(true)}>
                  <button className='text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded hover:bg-gray-600 transition'>
                    {copied ? "Copied!" : "Copy"}
                  </button>
                </CopyToClipboard>
              </div>
            )}
          </div>
          <div onClick={() => setWalletChange(true)}>
          {!connected ? (
              <div onClick={handleWalletConnect}>
                <WalletMultiButton />
              </div>
            ) : (
              <WalletDisconnectButton className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105" />
            )}
          </div>
        </div>
        <div className='mt-4'>
          {walletChange && !connected && (
            <WalletDisconnectButton>
              Choose another wallet
            </WalletDisconnectButton>
          )}
        </div>
      </div>  */}

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
                    ${coin.value.toFixed(2)} • {coin.amount} {coin.name}
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
    </div>
  );
}
