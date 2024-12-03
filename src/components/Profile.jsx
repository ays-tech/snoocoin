import React, { useState } from 'react';
import { List, Avatar } from '@telegram-apps/telegram-ui';
import AvatarSelector from './AvatarSelector';
import Modal from './Modal';

// Function to determine level based on points
// Array of all levels
const getLevel = (points) => {
  if (points >= 900) return { name: "Icon", icon: "🔱" };
  if (points >= 800) return { name: "Legend", icon: "🌠" };
  if (points >= 700) return { name: "Hero", icon: "🦸‍♂️" };
  if (points >= 600) return { name: "Master", icon: "🧙‍♂️" };
  if (points >= 500) return { name: "Champion", icon: "🏆" };
  if (points >= 400) return { name: "Ambassador", icon: "🕊️" };
  if (points >= 300) return { name: "Influencer", icon: "🌟" };
  if (points >= 200) return { name: "Contributor", icon: "🛠️" };
  if (points >= 100) return { name: "Explorer", icon: "🌍" };
  return { name: "Novice", icon: "🌱" };
};

const levels = [
  { name: "Novice", icon: "🌱", points: 0 },
  { name: "Explorer", icon: "🌍", points: 100 },
  { name: "Contributor", icon: "🛠️", points: 200 },
  { name: "Influencer", icon: "🌟", points: 300 },
  { name: "Ambassador", icon: "🕊️", points: 400 },
  { name: "Champion", icon: "🏆", points: 500 },
  { name: "Master", icon: "🧙‍♂️", points: 600 },
  { name: "Hero", icon: "🦸‍♂️", points: 700 },
  { name: "Legend", icon: "🌠", points: 800 },
  { name: "Icon", icon: "🔱", points: 900 }
];

const Profile = ({ user }) => {
  const userPoints = 450; // Replace with actual points
  const userStage = getLevel(userPoints);
  const userInvites = 5; // Replace with actual number of invites

  const [selectedAvatar, setSelectedAvatar] = useState(user.photoUrl || '/avatars/default.png');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const handleAvatarSelect = (avatar) => {
    setSelectedAvatar(avatar);
    setIsModalOpen(false); // Close the modal after selecting an avatar
    // Save the selected avatar to the user's profile (e.g., via an API call)
  };

  const handleLevelClick = () => {
    setModalContent(
      <div>
        <div className="font-bold mb-4">All Levels</div>
        <div className="grid gap-2">
          {levels.map((level, index) => (
            <div 
              key={index} 
              className={`p-2 rounded-md flex items-center space-x-2 ${level.name === userStage.name ? 'bg-blue-500 text-white' : 'bg-gray-800 text-white'}`}
            >
              <span>{level.icon}</span>
              <span>{level.name}</span>
              {level.points > userPoints && (
                <span className="ml-auto text-xs text-gray-400">{level.points - userPoints} XP to level up</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
    setIsModalOpen(true);
  };

  const handleCopyInvite = () => {
    const inviteLink = `https://example.com/invite?user=${user.username}`;
    navigator.clipboard.writeText(inviteLink);
    alert("Invite link copied to clipboard!");
  };


  const handleAvatarClick = () => {
    setModalContent(
      <AvatarSelector onSelect={handleAvatarSelect} />
    );
    setIsModalOpen(true);
  };

  return(
  <List className="flex flex-col w-full mt-4 p-4 shadow-md rounded-lg">
  <div className="flex items-center mb-4">
    {/* Profile Avatar */}
    <div className="relative mr-4" onClick={handleAvatarClick}>
      <Avatar
        className="animated-avatar cursor-pointer border-2 border-gray-300 rounded-full"
        fallbackIcon={<span>👤</span>}
        size={96}
        src={selectedAvatar}
      />
      {user.isPremium && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white rounded-full p-1 text-xs">
          ⭐
        </div>
      )}
    </div>

    {/* Follow Information */}
    <div className="flex space-x-8">
      <div className="text-center">
        <div className="font-bold">Followers</div>
        <div className="text-gray-500">18.8M</div> {/* Replace with actual data */}
      </div>
      <div className="text-center">
        <div className="font-bold">Following</div>
        <div className="text-gray-500">350</div> {/* Replace with actual data */}
      </div>
    </div>
  </div>
 {/* User Details */}
      <div className="mb-4">
        <div className="text-lg font-bold mb-1">
          {user.firstName} {user.lastName}
          {user.isPremium && <span className="text-blue-500"> ⭐</span>}
        </div>
        <div className="text-gray-500 mb-2">@{user.username}</div>
        <div className="flex items-center text-lg font-bold text-blue-600 mb-2">
          <span className="text-3xl mr-2" onClick={handleLevelClick}>{userStage.icon}</span> {/* Level Icon */}
          <span onClick={handleLevelClick}>{userStage.name}</span> {/* Level Name */}
        </div>
      </div>



  {/* Achievements */}
  <div className=" rounded-lg shadow-md p-6 mb-6">
  {/* Achievements */}
  <div className="mb-4">
    <div className="font-bold mb-2">Achievements</div>
    <div className="flex items-center mb-2">
      <span className="text-3xl mr-2">🏆</span>
      <strong>Points Earned:</strong> {userPoints}
    </div>
    <div className="flex items-center mb-2">
      <span className="text-3xl mr-2">🥇</span>
      <strong>Top Rank:</strong> #1
    </div>
    <div className="flex items-center mb-2">
      <span className="text-3xl mr-2">🎖️</span>
      <strong>Completed Tasks:</strong> 25 {/* Replace with actual data */}
    </div>
    <div className="flex items-center">
      <span className="text-3xl mr-2">🏅</span>
      <strong>Challenges Won:</strong> 10 {/* Replace with actual data */}
    </div>
  </div>
</div>




  {/* Levels/Avatar Selection Modal */}
  {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          {modalContent}
        </Modal>
      )}
    </List>
  );
};

export default Profile;
