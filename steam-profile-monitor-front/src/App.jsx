import React, { useState, useEffect  } from 'react';
import axios from 'axios';

function App() {
  const [steamId, setSteamId] = useState('');
  const [steamIds, setSteamIds] = useState(() => {
    const storedSteamIds = localStorage.getItem('steamIds');
    return storedSteamIds ? JSON.parse(storedSteamIds) : [];
  });
  const [profilesData, setProfilesData] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setSteamId(e.target.value);
  };

  const isSteamIdValid = (steamId) => {
    const steamIdRegex = /^\d{17}$/;
    return steamIdRegex.test(steamId);
  };

  const handleAddProfile = () => {
    if (isSteamIdValid(steamId)) {
      // Check if the Steam ID already exists in the list
      if (steamIds.includes(steamId)) {
        setError('Profile already added');
      } else {
        setSteamIds((prevIds) => {
          const newIds = [...prevIds, steamId];
          localStorage.setItem('steamIds', JSON.stringify(newIds));
          return newIds;
        });
        setSteamId('');
        setError(null);
      }
    } else {
      setError('Invalid Steam ID format');
    }
  };

  const handleClearProfiles = () => {
    localStorage.removeItem('steamIds');
    setSteamIds([]);
    setProfilesData([]);
  };

  useEffect(() => {
    const fetchData = async () => {
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
  
    fetchData();
  }, [steamIds]); // This useEffect will re-run whenever steamIds change
  
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
      <button onClick={handleClearProfiles}>Clear All Profiles</button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {profilesData.length > 0 && (
        <div>
          <h2>Profiles Data</h2>
          {profilesData.map((profileData, index) => (
            <div key={index}>
              <img src={profileData.avatar} alt={`Avatar for ${profileData.personaname}`} />
              <p>{profileData.personaname}</p>
              <p>{profileData.onlineStatus}</p>
              {profileData.onlineStatus === 'Online' && profileData.gameId && (
                <div>
                  <p>Playing: {profileData.gamePlaying}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;