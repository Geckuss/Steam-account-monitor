import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [steamId, setSteamId] = useState('');
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/profile/${steamId}`);
      setProfileData(response.data);
      setError(null);
    } catch (error) {
      setProfileData(null);
      setError('Profile not found');
    }
  };

  return (
    <div>
      <h1>Steam Profile Monitor</h1>
      <label>
        Enter Steam ID:
        <input
          type="text"
          value={steamId}
          onChange={(e) => setSteamId(e.target.value)}
        />
      </label>
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {profileData && (
        <div>
          <h2>Profile Data</h2>
          <p>Steam ID: {profileData.steamid}</p>
          <p>Username: {profileData.personaname}</p>
          <img src={profileData.avatar} alt="Avatar" />
        </div>
      )}
    </div>
  );
}

export default App;
