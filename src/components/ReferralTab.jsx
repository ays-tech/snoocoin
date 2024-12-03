import Image from "next/image";

export default function ReferralTab({ user }) {
  return (
    <div className='p-5'>
      <div className='flex justify-between items-center rounded-lg bg-[#002247] py-3 px-4'>
        {/* User Information */}
        <div className='flex items-center w-1/4'>
          <div className='w-10'>
            <Image
              width={100}
              height={100}
              src='/coineal.svg'
              alt='coin'
              priority
            />
          </div>
          <div className='truncate ml-2'>{user?.username || 'Guest'}</div>
        </div>

        {/* Total Coins */}
        <div className='w-1/2 text-center relative before:absolute before:h-full before:bg-slate-400 before:w-0.5 before:left-0'>
          <div className='text-slate-300 text-xs'>Total Points</div>
          <div className='text-yellow-300 font-bold text-xl'>1000</div>
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
            <p>Invite a friend </p>
            <div className='flex items-center mt-1'>
              <div className='w-6 mr-1'>
                <Image width={100} height={100} alt='next' src='/coineal.svg' />
              </div>
              <p>
                <span className='text-yellow-300'>+10,000 BB</span> for you and
                your when yu invite 10 active users
              </p>
            </div>
          </div>
        </div>
        <div className='flex items-center mt-4'>
          <div className='w-10'>
            <Image src='/gift.svg' alt='gift' height={100} width={100} />
          </div>
          <div className='ml-3'>
            <p>Invite a friend with Telegram Premium </p>
            <div className='flex items-center mt-1'>
              <div className='w-6 mr-1'>
                <Image width={100} height={100} alt='next' src='/coineal.svg' />
              </div>
              <p>
                <span className='text-yellow-300'>+20,000BB</span> for you and
                your friend
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Invite action link */}
      <div className='flex items-center justify-center gap-2 mb-20 mt-5'>
        <div className='h-12 flex items-center px-7 py-2 gap-2 bg-green-400 text-white rounded-full'>
          <p>Invite a friend</p>
          <div className='w-5'>
            <Image src='/people.svg' alt='invite' height={100} width={100} />
          </div>
        </div>
        <div className='flex h-12 w-20 px-4 py-2 bg-green-400 rounded-lg'>
          <Image src='/copy.svg' alt='invite' height={100} width={100} />
        </div>
      </div>
    </div>
  );
}
