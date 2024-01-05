import React, { useState, useEffect  } from 'react';
import axios from 'axios';
import './styles.css';

function App() {
  const [steamId, setSteamId] = useState('');
  const [steamIds, setSteamIds] = useState(() => {
    const storedSteamIds = localStorage.getItem('steamIds');
    return storedSteamIds ? JSON.parse(storedSteamIds) : [];
  });
  
  const [profilesData, setProfilesData] = useState([]);
  const [error, setError] = useState(null);
  const [gameName, setGameName] = useState(() => {
    const storedGameName = localStorage.getItem('gameName');
    return storedGameName || '';
  });

  const [isAlertSet, setIsAlertSet] = useState(false);
  const alertSound = new Audio('./alert.mp3'); // Change the path to your sound file

  const [apiKeyStatus, setApiKeyStatus] = useState(() => {
    const storedApiKeyStatus = localStorage.getItem('apiKeyStatus');
    return storedApiKeyStatus || 'Not Set';
  });

  useEffect(() => {
    const storedApiKeyStatus = localStorage.getItem('apiKeyStatus');
    setApiKeyStatus(storedApiKeyStatus || 'Not Set');
  }, []);

  const handleInputChange = (e) => {
    setSteamId(e.target.value);
  };

  const isSteamIdValid = (steamId) => {
    const steamIdRegex = /^\d{17}$/;
    return steamIdRegex.test(steamId);
  };

  const handleSetApiKey = () => {
    const newApiKey = prompt('Enter your API key:');
    if (newApiKey) {
      axios.post('http://localhost:3000/setApiKey', { newApiKey })
        .then(() => {
          setApiKeyStatus('Set');
          localStorage.setItem('apiKeyStatus', 'Set');
          fetchData();
        })
        .catch((error) => {
          console.error('Error setting API key:', error);
          setApiKeyStatus('Error Setting');
          localStorage.setItem('apiKeyStatus', 'Error Setting');
        });
    }
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


  const handleGameNameChange = (e) => {
    const newGameName = e.target.value;
    setGameName(newGameName);
    localStorage.setItem('gameName', newGameName);
  };

  const handleSetAlert = () => {
    setIsAlertSet(!isAlertSet);
    handleGameNameChange;
  };

  const fetchData = async () => {
    try {
      const profilesResponses = await Promise.all(
        steamIds.map(async (steamId) => await axios.get(`http://localhost:3000/profile/${steamId}`))
      );

      const profilesData = profilesResponses.map((response) => response.data);
      setProfilesData(profilesData);
      setError(null);

      //Notification check
      if (gameName && isAlertSet) {
        const isGameBeingPlayed = profilesData.some(
          (profile) => profile.onlineStatus === 'Online' && profile.gamePlaying === gameName
        );
        console.log(gameName,isAlertSet, isGameBeingPlayed)
          if (isGameBeingPlayed && isAlertSet){
            alertSound.play();
            setIsAlertSet(false);
          }
          
      }

    } catch (error) {
      setProfilesData([]);
      setError('Error fetching profiles');
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 20 * 1000);
  
    return () => clearInterval(intervalId);
  }, [steamIds, gameName]);


  return (
    <div className="app-container">
      <h1>Steam Profile Monitor</h1>
      
      <div className="input-container">
        <label>
          Enter Steam ID:
          <input
            type="text"
            value={steamId}
            onChange={handleInputChange}
            placeholder="e.g., 76561197972495328"
          />
        </label>

        <div className="input-container">
        <label>
          Waiting for Game:
          <input
            type="text"
            value={gameName}
            onChange={handleGameNameChange}
            placeholder="Enter game name"
          />
        </label>
        
        </div>
        <button className="action-button" onClick={handleSetAlert}>
          {isAlertSet ? 'Cancel Alert' : 'Set Alert'}</button>
        <button className="action-button" onClick={handleAddProfile}>Add Profile</button>
        <button className="action-button" onClick={handleClearProfiles}>Clear All Profiles</button>
        <button
          className={`action-button ${apiKeyStatus === 'Set' ? 'set-api-key' : 'unset-api-key'}`}
          onClick={handleSetApiKey}
        >
          Set API Key
        </button>
      </div>
      
      {error && <p className="error-message">{error}</p>}
  
      {profilesData.length > 0 && (
        <div className="profiles-container">
          {profilesData.map((profileData, index) => (
            <div 
              key={index} 
              className="profile-card"
              style={{
                background: profileData.onlineStatus === 'Online'
                  ? (profileData.gameId ? '#90ba3c' : '#57cbde') // In-game or online
                  : '#898989' // Offline
              }}
            >
              <img
                src={profileData.avatar}
                alt={`Avatar for ${profileData.personaname}`}
                className="avatar"
              />
              <p className="username">{profileData.personaname}</p>
              <p className="status" style={{ color: '#4CAF50' }}>{profileData.onlineStatus}</p>
              {profileData.onlineStatus === 'Online' && profileData.gameId && (
                <div>
                  <p className="game-playing" style={{ fontStyle: 'italic' }}>Playing: {profileData.gamePlaying}</p>
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