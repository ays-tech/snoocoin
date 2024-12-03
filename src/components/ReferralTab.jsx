import Image from "next/image";
import { useState } from "react";
import { useFetchReferrals, useGetPoints } from "@/hooks/api";

export default function ReferralTab({ user }) {
  const [copied, setCopied] = useState(false);
  const { data, isFetching, isError, error } = useFetchReferrals(user?.id);
  const { data: points } = useGetPoints(user?.id);

  const referralLink = `https://t.me/Cryptolnk_bot/CRL?startapp=${user?.id}`;
  const shareText = `
    🐾 Meet Bibi, the smallest cat on Solana! 🐾

    Join us now and be among the early users to earn exclusive rewards. 🌟

    Both you and I will get 200 Bibi when you join through this link! 🎉

    Dive into the world of Bibi and unlock amazing bonuses. Don’t miss out on this unique opportunity! 🚀
  `;
  const telegramShareURL = `https://t.me/share/url?url=${encodeURIComponent(
    referralLink
  )}&text=${encodeURIComponent(shareText)}`;

  const handleInviteClick = () => {
    window.open(telegramShareURL, "_blank");
  };

  const handleCopyClick = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className='p-5 mb-24'>
      <div className='flex justify-between items-center rounded-lg bg-[#002247] py-3 px-4'>
        {/* User Information */}
        <div className='flex items-center w-full sm:w-1/4'>
          <div className='w-10'>
            <Image
              width={100}
              height={100}
              src='/coin.png'
              alt='coin'
              priority
            />
          </div>
          <div className='ml-2 truncate max-w-xs'>
            {`@${user?.username}` || "Guest"}
          </div>
        </div>

        {/* Total Coins */}
        <div className='w-full sm:w-1/2 text-center relative before:absolute before:h-full before:bg-slate-400 before:w-0.5 before:left-0'>
          <div className='text-slate-300 text-xs'>Total Points</div>
          <div className='text-yellow-300 font-bold text-xl'>{points}</div>
        </div>
      </div>

      {/* Coineal logo */}
      <div className='w-fit mx-auto my-5'>
        <Image src='/cats.png' height={200} width={200} alt='cats' />
      </div>

      {/* Invite action */}
      <div className='my-5 w-11/12 mx-auto'>
        <div className='text-3xl font-bold text-center'>Invite Friends!!!</div>
        <div className='text-xl font-semibold text-center'>
          Get bonuses with your friends
        </div>
        <div className='flex items-center mt-5'>
          <div className='w-10'>
            <Image src='/gift.svg' alt='gift' height={100} width={100} />
          </div>
          <div className='ml-3'>
            <p>Invite a friend</p>
            <div className='flex items-center mt-1'>
              <div className='w-6 mr-1'>
                <Image width={100} height={100} alt='next' src='/coin.png' />
              </div>
              <p>
                <span className='text-yellow-300'>+10,000 BB</span> for you and
                your friend when you invite 10 active users
              </p>
            </div>
          </div>
        </div>
        <div className='flex items-center mt-4'>
          <div className='w-10'>
            <Image src='/gift.svg' alt='gift' height={100} width={100} />
          </div>
          <div className='ml-3'>
            <p>Invite a friend with Telegram Premium</p>
            <div className='flex items-center mt-1'>
              <div className='w-6 mr-1'>
                <Image width={100} height={100} alt='next' src='/coin.png' />
              </div>
              <p>
                <span className='text-yellow-300'>+20,000 BB</span> for you and
                your friend
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite action link */}
      <div className='flex items-center justify-center gap-2 my-5'>
        <div
          className='h-12 flex items-center px-7 py-2 gap-2 bg-green-400 text-white rounded-full cursor-pointer'
          onClick={handleInviteClick}>
          <p>Invite a friend</p>
          <div className='w-5'>
            <Image src='/people.svg' alt='invite' height={100} width={100} />
          </div>
        </div>
        <div
          className='flex h-12 w-20 px-4 py-2 bg-green-400 rounded-lg cursor-pointer'
          onClick={handleCopyClick}>
          <Image src='/copy.svg' alt='copy' height={100} width={100} />
        </div>
      </div>

      {/* Displaying the referrals */}
      {isFetching ? (
        <div className='text-center text-gray-500'>Loading referrals...</div>
      ) : isError ? (
        <div className='text-center text-red-500'>{error.message}</div>
      ) : data.length === 0 ? (
        <div className='text-center text-gray-500'>No frens yet.</div>
      ) : (
        <div className='mt-5'>
          <h3 className='text-2xl font-bold text-center mb-4'>
            Your Referrals
          </h3>
          <ul className='list-disc list-inside'>
            {data.map((id) => (
              <li key={id} className='text-center'>
                {`User ID: ${id}`}
              </li>
            ))}
          </ul>
        </div>
      )}

      {copied && (
        <div className='fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded'>
          Successfully copied!
        </div>
      )}
    </div>
  );
}
