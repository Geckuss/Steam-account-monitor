# React (Vite) + Node.js

Program utilizes Steam Web API to monitor Steam profiles online status  

Frontend is at https://geckuss.github.io/steam-account-monitor/

![image](https://github.com/Geckuss/steam-account-monitor/assets/58637152/73374557-ec12-4e67-b5bd-4a4202f9163c)

First step is to input your own API key by pressing "Set API Key"

![image](https://github.com/Geckuss/steam-account-monitor/assets/58637152/07b96423-9a00-4ed3-b80c-85058c6b6efd)![image](https://github.com/Geckuss/steam-account-monitor/assets/58637152/72c97ac4-82ef-4f7f-9d20-bd8f80c0e0d2)

If you don't have API key, you can get one from https://steamcommunity.com/dev/apikey

API key gets sent into backend (hosted in Oracle cloud instance) via https, to be used in future API calls

Succesfult API key set should look like this:
![image](https://github.com/Geckuss/steam-account-monitor/assets/58637152/ea9c8758-8f4e-4b9a-b4eb-414d76959379)

Next step is to add profiles to be monitored. Input desired profiles steam id and press "Add Profile" (go to any profile and copy https://steamcommunity.com/profiles/[STEAM_ID] from the address) (If someone is using vanity URL, you need to go to https://www.steamidfinder.com/ to copy the steam id)

![image](https://github.com/Geckuss/steam-account-monitor/assets/58637152/26177f4d-5370-4d9b-ae17-bc6bf5cb5b54)

![image](https://github.com/Geckuss/steam-account-monitor/assets/58637152/25de0be1-ebe4-4823-bf83-b36b36da8343)

![image](https://github.com/Geckuss/steam-account-monitor/assets/58637152/71c9e3bc-c466-4c4e-86fb-15e4f2d3d145)

It is virtually possible to add endless amount of steam profiles
![image](https://github.com/Geckuss/steam-account-monitor/assets/58637152/28777419-d545-413d-921d-91e2172fb6c5)

There are three different states for the profiles: Online (Playing a game), Online, and Offline.
If Waiting for Game: contains text, website will check every 20 seconds is someone playing that game. 
If someone is playing, website will play alarm sound.

![image](https://github.com/Geckuss/steam-account-monitor/assets/58637152/3358eba9-885d-4920-bc40-2afc48403b3c)

Clear all button clears the list of steam id's to be monitored
![image](https://github.com/Geckuss/steam-account-monitor/assets/58637152/24109db2-7c2d-4c46-b386-e48230001aa3)


