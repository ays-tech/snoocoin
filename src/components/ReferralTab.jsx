import { useEffect, useState } from 'react';

const User = () => {
  const [points, setPoints] = useState(0);



  return (
    <div>
      <h1>Your XP: {points}</h1>
    </div>
  );
};


export default User;