const PORT = process.env.PORT || 8800;
let USERS = [];


const express = require('express');
const app = express();
const http = require('http')
const socketio = require('socket.io')


app.use(express.static('client/public'));

app.get('/',(req,res)=>{
  res.send('Not found what you want')
})

const server = http.createServer(app);
//const WebSocketServer = require("ws");
//const websocketserver = new WebSocketServer.Server({ noServer:true });
const websocketserver = socketio(server);


server.listen(PORT, ()=>console.log('Server is running at port '+ PORT));

app.on("upgrade", (req, res, head) => {
  websocketserver.handleUpgrade(req, res, head, (socket) => {
    websocketserver.emit("connection", socket, req);
  });
});


websocketserver.on("connection", (socketclient) => {
  const search = (username) => {
    for (let i = 0; i < USERS.length; i++) {
      if (USERS[i].username == username) {
        return USERS[i];
      }
    }
    return false;
  };
  let currentuser;
  const newuserjoined = (username, socket) => {
    let userslist = USERS.map((user) => {
      return user.username;
    });
    // add user to list
    currentuser = { username: username, client: socket };
    USERS.push(currentuser);
    // send userlist to new user
    let userlistmsg = { event: "userslist", userslist: userslist };
    socket.send(JSON.stringify(userlistmsg));
    // broadcast to all that the user is joined
    let broadcastmsg = { event: "newuserjoined", username: username };
    USERS.forEach((user) => {
      if (user.username !== username) {
        user.client.send(JSON.stringify(broadcastmsg));
      }
    });
  };

  socketclient.on("message", (data) => {
    try {
      message = data.toString();
      message = JSON.parse(message);
      console.log(message);
      if (message.event == "userwanttojoin" && message.username !== "") {
        let join = true;
        for (let i in USERS) {
          if (USERS[i].username == message.username.trim()) {
            join = false;
            break;
          }
        }
        if (join) {
          newuserjoined(message.username.trim(), socketclient);
          message = { event: "userjoined" };
          socketclient.send(JSON.stringify(message));
        } else {
          console.log("User already exists...");
          message = { event: "alreadyexist" };
          socketclient.send(JSON.stringify(message));
        }
      } else if (message.event == "iwanttoplay") {
        for (let i = 0; i < USERS.length; i++) {
          if (message.username === USERS[i].username) {
            let requestmsg = {
              event: "userwanttoplay",
              username: currentuser.username,
            };
            USERS[i].client.send(JSON.stringify(requestmsg));
            break;
          }
        }
      } else if (
        message.event == "yesiwanttoplay" ||
        message.event == "noidontwanttoplay"
      ) {
        let replymsg = { event: message.event, username: currentuser.username };
        search(message.username).client.send(JSON.stringify(replymsg));
      } else if (message.event == "move") {
        let replymsg = {
          event: "move",
          username: currentuser.username,
          move: message.move,
        };
        search(message.username).client.send(JSON.stringify(replymsg));
      } else if (message.event == "quit") {
        let replymsg = { event: "quit", username: currentuser.username };
        search(message.username).client.send(JSON.stringify(replymsg));
      }
    } catch (e) {}
  });

  socketclient.on("disconnect", () => {
    //remove from users list
    try {
      USERS.splice(USERS.indexOf(currentuser), 1);

      //broadcast all
      if (currentuser != undefined && currentuser.username !== undefined) {
        let broadcastmsg = {
          event: "userleft",
          username: currentuser.username,
        };
        USERS.forEach((user) => {
          user.client.send(JSON.stringify(broadcastmsg));
        });
      }
    } catch (e) {}
  });
});

console.log("The WebSocket Server is active and running at " + PORT);
