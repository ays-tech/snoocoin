import React, { useState } from 'react';

const avatars = [
  '/avatars/avatar1.png',
  '/avatars/avatar2.png',
  '/avatars/avatar3.png',
  '/avatars/avatar4.png',
  // Add more avatar paths here
];

const AvatarSelector = ({ onSelect }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleAvatarClick = (avatar) => {
    setSelectedAvatar(avatar);
    onSelect(avatar); // Call the onSelect function passed via props
  };

  return (
    <div className="avatar-selector flex flex-wrap justify-center">
      {avatars.map((avatar, index) => (
        <img
          key={index}
          src={avatar}
          alt={`Avatar ${index + 1}`}
          className={`avatar ${selectedAvatar === avatar ? 'selected' : ''}`}
          onClick={() => handleAvatarClick(avatar)}
          style={{ width: 96, height: 96, cursor: 'pointer', margin: 10 }}
        />
      ))}
    </div>
  );
};

export default AvatarSelector;
