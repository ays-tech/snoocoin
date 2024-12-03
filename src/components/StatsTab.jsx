"use client";
import React from "react";

export default function StatsTab({ user }) {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <h2 className="text-4xl font-bold mb-8">Stats Tab 📊</h2>

      <div className="w-full max-w-lg bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-2xl font-bold mb-6 text-center">User Details 🚀</h3>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between py-3">
            <span className="font-semibold">First Name:</span>
            <span className="text-green-500">{user?.firstName}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="font-semibold">Last Name:</span>
            <span className="text-green-500">{user?.lastName}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="font-semibold">Telegram ID:</span>
            <span className="text-green-500">{user?.id}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="font-semibold">Username:</span>
            <span className="text-green-500">@{user?.username}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
