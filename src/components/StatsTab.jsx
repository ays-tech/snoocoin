// components/StatsTab.jsx
"use client";
import React from 'react';

export default function StatsTab() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <h2 className="text-4xl font-bold mb-8">Stats Tab 📊</h2>

      <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 text-center">User Metrics 🚀</h3>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between py-3">
            <span className="font-semibold">Total Users 🌍:</span>
            <span className="text-green-500">60,000 📈</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="font-semibold">Active Users Today 🌟:</span>
            <span className="text-green-500">2,500 📅</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="font-semibold">Total Rewards Distributed 💰:</span>
            <span className="text-green-500">5,000 💎</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="font-semibold">Top Referrers 🌟:</span>
            <ul className="text-green-500">
              
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}