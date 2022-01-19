// Socket Implementation

 var Socket  = {
    socket: null,
    onopencallback : ()=>{},
    alreadyexistcallback : ()=>{},
    userjoinedcallback : ()=>{},
    userwanttoplaycallback : ()=>{},
    yesiwanttoplaycallback:()=>{},
    noidontwanttoplaycallback:()=>{},
    opponentmovecallback : ()=>{},
    opponentquitcallback: ()=>{},
    userleftcallback : ()=>{},
    onerrorcallback: ()=>{},
    setopponent : (username)=>{
        Socket.opponent = username;
        Socket.app.setState({'opponent':Socket.opponent}) 
    },
    app:null,
    username : '',
    opponent:'',
    runsocket : (app)=>{
        Socket.app = app;
        Socket.socket = new WebSocket('ws://localhost:8800')
        Socket.socket.onopen = ()=>{
            console.log('connected..')
            Socket.onopencallback()
        }
        Socket.socket.onerror = (event)=>{
            Socket.onerrorcallback();
        }
        Socket.socket.onclose = (event)=>{
            Socket.onerrorcallback();
        }
        Socket.socket.onmessage = (event)=>{
            console.log(event.data)
            let message = JSON.parse(event.data)
            if(message.event == 'userjoined'){
                console.log("Welcome to the game")
                Socket.userjoinedcallback();
                app.setState({'username':Socket.username})
            }else if(message.event == 'alreadyexist'){
                console.log('username already exist')
                Socket.alreadyexistcallback()
            }else if(message.event == 'userslist'){
                app.setState({
                    'users':message.userslist
                })
            }else if(message.event == 'newuserjoined'){
                app.setState({
                    'users':[...app.state.users,message.username]
                })
            }else if(message.event == 'userleft'){
                app.setState({
                    'users':app.state.users.filter(user=>{
                        return user!==message.username
                    })
                })
                Socket.userleftcallback(message.username);
            }else if(message.event == 'userwanttoplay'){
                Socket.userwanttoplaycallback(message.username)
                
            }else if(message.event =='yesiwanttoplay'){
                Socket.yesiwanttoplaycallback(message.username)
                Socket.setopponent(message.username)
            }else if(message.event == 'noidontwanttoplay'){
                Socket.noidontwanttoplaycallback(message.username)
            }else if(message.event == 'move'){
                Socket.opponentmovecallback(message.move);
            }else if(message.event='quit'){
                Socket.opponentquitcallback()
            }
        }
    },
    onadd : (event)=>{
        let message = {'event':'iwanttoplay','username':event.target.getAttribute('button-key')}
        Socket.socket.send(JSON.stringify(message));
    },
    getusername : (username)=>{
        let requestmsg = {'event':'userwanttojoin','username':username}
        Socket.socket.send(JSON.stringify(requestmsg)) 
    },
    replytorequest: (answer,username)=>{
        let remsg
        if(answer==1){
            remsg = {'event':'yesiwanttoplay','username':username}
        }else{
            remsg = {'event':'noidontwanttoplay','username':username}
        }
        Socket.socket.send(JSON.stringify(remsg))
        Socket.setopponent(username);
    },
    move:(move)=>{
        let msg = {'event':'move','username':Socket.opponent,'move':move}
        Socket.socket.send(JSON.stringify(msg));
    },
    quit: ()=>{
        let msg = {'event':'quit','username':Socket.opponent}
        Socket.socket.send(JSON.stringify(msg))
    }
}
export default Socket;