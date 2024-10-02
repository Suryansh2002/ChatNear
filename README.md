# Nearby Chat
A simple express js chat website where you can send messages and people accessing website near your location could see messages.

## Running the app locally
> Make sure npm is installed on your system.

> Clone/Download the GitHub Repo.

Run the following commands in your terminal.
```
npm install
```

```
npm start
```

Open http://localhost on your broswer to access the site.

## Working

 -  `Navigator Geolocation Api is used to send the user's location to the backend`
 
 -  `Whenever a user sends a message, Backend calculates the nearest distance of users`  
 
 -  `Nearby Online users recieve message using websockets`
