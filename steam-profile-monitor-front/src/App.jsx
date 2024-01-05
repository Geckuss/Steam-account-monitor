import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [steamId, setSteamId] = useState('');
  const [steamIds, setSteamIds] = useState([]);
  const [profilesData, setProfilesData] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setSteamId(e.target.value);
  };

  const isSteamIdValid = (steamId) => {
    // Add your custom validation logic for Steam IDs
    const steamIdRegex = /^\d{17}$/; // Steam IDs are 17 digits
    return steamIdRegex.test(steamId);
  };

  const handleAddProfile = () => {
    if (isSteamIdValid(steamId)) {
      setSteamIds((prevIds) => [...prevIds, steamId]);
      setSteamId('');
      setError(null);
    } else {
      setError('Invalid Steam ID format');
    }
  };

  const handleSearch = async () => {
    try {
      const profilesResponses = await Promise.all(
        steamIds.map(async (steamId) => await axios.get(`http://localhost:3000/profile/${steamId}`))
      );
      
      const profilesData = profilesResponses.map((response) => response.data);
      setProfilesData(profilesData);
      setError(null);
    } catch (error) {
      setProfilesData([]);
      setError('Error fetching profiles');
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
          onChange={handleInputChange}
        />
      </label>
      <button onClick={handleAddProfile}>Add Profile</button>
      <button onClick={handleSearch}>Search</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {profilesData.length > 0 && (
        <div>
          <h2>Profiles Data</h2>
          {profilesData.map((profileData, index) => (
            <div key={index}>
              <p>Username: {profileData.personaname}</p>
              <p>Status: {profileData.onlineStatus}</p>
              {profileData.onlineStatus === 'Online' && profileData.gamePlaying && (
                <div>
                  <p>Playing: {profileData.gamePlaying}</p>
                </div>
              )}
              <img src={profileData.avatar} alt={`Avatar for ${profileData.personaname}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;