
# Paper Scissor Rocks Online

Enjoy the game of rock paper scissors from anywhere online with your friends and strangers. View the project live **[here](https://paper-scissor-rocks-online.herokuapp.com/)**.


## Features

- **Completely responsive**-Works on any device.
- **Interactive and fun**- with animations and more.
- **Cross browser support**.


## Tech Stack

**Client:** React, Sass

**Server:** Node, Express, WebSocket, Socket.io 


## How it Works


- After getting connected to the socket server, user is asked to enter a username. If the username is unique than the user will be taken to the game else will be asked again for a different username.
![App Screenshot](https://64.media.tumblr.com/2484cba58a926df2c6fb62d5bbdd8390/9fcf453451d89d34-f2/s2048x3072/4c79aaee9d4e5e7f2d778e62dd915ac6d8d80d0d.png)
- Here user can send request to any player from the active players section or can accept/reject the request itself.
![App Screenshot](https://64.media.tumblr.com/09dda44e950997ac346284bbc4bf4398/3500b5e3ee804e51-a5/s2048x3072/ee0d41813ce584e4c991e32521d6806d7d3b3ef3.png)
- when the other user accepts the request, the game get started between them.
![App Screenshot](https://64.media.tumblr.com/b29e887cfe7273e8e5fd4afe83ec8598/3eb82dee16b938df-08/s1280x1920/b332bd836942b3a9f88a9c01f565f1c30469cd5a.png)
- User select his choice b/w rock, paper and scissors and that choice cannot be seen by other player until both player make choices.
![App Screenshot](https://64.media.tumblr.com/735319a48565853cb271cbf3bb18445d/5d101c1d0e7f01de-5c/s2048x3072/4d813764d8c4a59e37e656c7f95ec61fc702c150.png)
- Both player will play 5 rounds of the game and the winner will be declared accordingly.
- If in any case the user quits the game or gets disconnected from the server, the game automatically ends on both sides telling the user of what happened. 


## Branches

There are two branches two this project, one is implemented over WebSocket library of node.js and other uses Socket.io for web socket server client communication.

- **web-socket**
This branch is implemented over the WebSocket library which is completely reliable on socket connections which is why it is difficult for me to deploy it over production as it is not allowed either to connect to ws protocol over https protocol or to create https server myself and run it over internet.
- **main**
This branch is implemented over the Socket.io connection which uses communicates through sockets primarily but if it fails to, then it fallbacks to http polling. currently this project is using ws connection only locally and globally it uses http polling.

## Run Locally

Clone the project

```bash
  git clone https://github.com/rohitmirchandani/rock-paper-scissors-online
```

Go to the project directory

```bash
  cd rock-paper-scissors-online
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node server.js
```

Start the client

```bash
  cd client
  npm run start
```

## Future Scope
- The app should work on web socket protocol in production also and use http polling as a fallback option.
- Although the app is mobile is mobile responsive, It cannot connect to server on cellular networks. This is due to the Socket.io library and might be fixed through updates in future.


## Authors

- [@rohitmirchandani](https://www.github.com/rohitmirchandani)


## Feedback

For feedback, email rohitmirchandani365@gmail.com.

