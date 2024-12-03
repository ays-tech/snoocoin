"use client";
import React, { useEffect, useState } from "react";
import { FaArrowUp, FaArrowDown, FaWallet } from "react-icons/fa";
import axios from "axios";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletMultiButton,
  WalletDisconnectButton,
} from "@solana/wallet-adapter-react-ui";
import { CopyToClipboard } from "react-copy-to-clipboard";

// Set up the connection to the Solana blockchain
const connection = new Connection("https://api.mainnet-beta.solana.com");

// Bibi Token Mint Address
const BIBI_MINT_ADDRESS = "HPywjr3AchS3Z7JGJRJ4oqxhpDAw7CgmUffCXsZHbq9G";

export default function WalletPage({ user }) {
  const [liveData, setLiveData] = useState({
    sol: { price: 0, change: 0, iconUrl: "" },
    usdt: { price: 0, change: 0, iconUrl: "" },
    bibi: { price: 0, change: 0, iconUrl: "" },
  });
  const [solBalance, setSolBalance] = useState(0);
  const [bibiBalance, setBibiBalance] = useState(0); // New state for Bibi balance
  const [copied, setCopied] = useState(false);
  const [walletChange, setWalletChange] = useState(false);
  const { publicKey, connected, disconnect, connecting, disconnecting } =
    useWallet();

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

  useEffect(() => {
    async function fetchBibiBalance() {
      if (publicKey) {
        try {
          // Fetch Bibi token balance using the mint address
          const tokenAccounts = await connection.getTokenAccountsByOwner(
            publicKey,
            {
              mint: new PublicKey(BIBI_MINT_ADDRESS),
            }
          );

          if (tokenAccounts.value.length > 0) {
            const accountInfo = tokenAccounts.value[0].account.data;
            const parsedAccountInfo = await connection.getParsedAccountInfo(
              new PublicKey(tokenAccounts.value[0].pubkey)
            );
            const bibiAmount =
              parsedAccountInfo.value.data.parsed.info.tokenAmount.uiAmount;
            setBibiBalance(bibiAmount);
          } else {
            setBibiBalance(0); // No Bibi token found in the wallet
          }
        } catch (error) {
          console.error("Error fetching Bibi token balance", error);
        }
      }
    }
    fetchBibiBalance();
  }, [publicKey, connection]);

  return (
    <div className="bg-gray-900 p-4 pb-24 max-w-4xl mx-auto space-y-6">
      {/* Wallet Overview */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <p className="text-slate-300 mb-1.5">Hi, {user?.firstName}</p>
        <div className="flex items-center mb-4">
          <FaWallet className="text-2xl text-green-500 mr-2 mt-1" />
          <p className="text-2xl font-semibold text-green-500">
            $
            {connected ? (solBalance * liveData.sol.price).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center ">
          <div>
            <h3 className="text-xl font-bold text-white">
              {connected ? "Wallet Connected" : "Not Connected"}
            </h3>
            {connected && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-400">
                  {publicKey.toString().slice(0, 5)}...
                  {publicKey.toString().slice(-5)}
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
          <div onClick={() => setWalletChange(true)}>
            {!connected ? (
              <WalletMultiButton className="bg-gradient-to-r from-green-400 to-blue-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105" />
            ) : (
              <WalletDisconnectButton className="bg-gradient-to-r from-red-400 to-pink-500 text-white font-bold py-2 px-4 rounded-lg shadow hover:shadow-lg transition transform hover:scale-105" />
            )}
          </div>
        </div>
        <div className="mt-4">
          {walletChange && !connected && (
            <WalletDisconnectButton>
              Choose another wallet
            </WalletDisconnectButton>
          )}
        </div>
      </div>

      {/* Coins Section */}
      <div className="flex flex-col gap-2">
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
            amount: 1000, // Static value; update as needed
            value: liveData.usdt.price,
            change: liveData.usdt.change,
            iconUrl: liveData.usdt.iconUrl,
          },
        ].map((coin) => {
          return (
            <div
              key={coin.name}
              className="bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between"
            >
              <div className="flex items-center">
                <img src={coin.iconUrl} alt={coin.name} className="h-8 w-8 mr-2" />
                <div>
                  <p className="text-white font-semibold">{coin.name}</p>
                  <p className="text-slate-300 text-sm">
                    ${coin.value.toFixed(2)} • {coin.amount} {coin.name}
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center text-sm ${
                  coin.change > 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {coin.change > 0 ? <FaArrowUp /> : <FaArrowDown />}
                <p className="ml-1">
                  {`${coin.change.toFixed(2)}%`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
