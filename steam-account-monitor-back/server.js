const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const port = 3000;

let apiKey = ''; // Initialize API key

app.use(express.json()); // Parse JSON request bodies

app.use(cors({
  origin: (origin, callback) => {
    // Define the allowed origin(s)
    const allowedOrigin = 'https://geckuss.github.io'; // Replace with your GitHub Pages domain

    // Check if the origin is allowed
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

// Enable pre-flight for all routes
app.options('*', cors());

app.get('/', (req, res) => {
  res.send('Welcome to the backside of Steam Profile Monitor! Remember to set your API key.');
});

app.post('/setApiKey', cors(), (req, res) => {
  // Set the API key from the request body
  const newApiKey = req.body.newApiKey;
  apiKey = newApiKey;
  console.log('API key set:', newApiKey);
  res.json({ success: true, message: 'API key set successfully' });
});

app.get('/profile/:steamId', async (req, res) => {
  // Check if the apiKey is set
  if (!apiKey) {
    return res.status(400).json({ error: 'API key not set. Please set the API key first.' });
  }
  const steamId = req.params.steamId;
  try {
    const response = await axios.get(`http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${apiKey}&steamids=${steamId}`);
    const profileData = response.data.response.players[0];

    // Check if the user is online
    const isOnline = profileData.personastate === 1; // 1 represents online

    // Check if the user is actively playing a game
    const isPlayingGame = isOnline && profileData.gameid !== undefined;

    res.json({
      steamid: profileData.steamid,
      personaname: profileData.personaname,
      avatar: profileData.avatarfull,
      onlineStatus: isOnline ? 'Online' : 'Offline',
      gamePlaying: isPlayingGame ? profileData.gameextrainfo : null,
      gameId: isPlayingGame ? profileData.gameid : null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
