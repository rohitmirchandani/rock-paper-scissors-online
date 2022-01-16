import React from 'react'
import Socket from './socket';
// import './style.scss';

class Message extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            request : true,
            message: ""
        }
    }
    setupgame(){
        let versusscreen = document.getElementById('versus-screen')
        let welcomescreen = document.getElementById('welcome-screen')
        let gamescreen = document.getElementById('game-screen')
        versusscreen.classList.add('bounce-in')
        welcomescreen.classList.add('hide')
        gamescreen.classList.remove('hide')     
        setTimeout(()=>{
            versusscreen.className = 'scale-out'
        },2000)
        setTimeout(()=>{
            versusscreen.className = ''
        },3000)
        let userslist = document.getElementById('userslist')
        userslist.classList.add('nosendbutton')
    }
    componentDidMount(){
        let messagediv = document.getElementById('message-div');
        let closemessagebutton = document.getElementById('closebutton')
        let acceptbutton = document.getElementById('accept-button')
        let declinebutton = document.getElementById('decline-button')
        let currentusername;
        
        Socket.userwanttoplaycallback = (username)=>{
            currentusername = username
            this.setState({
                request:true,
                message: `${username} wants to play`
            })
            messagediv.className = ''
            messagediv.classList.add('yellow')
            messagediv.classList.add('show-message')
        }
        
        Socket.yesiwanttoplaycallback = (username)=>{
            this.setState({
                request:false,
                message: `${username} agreed to play with you.`
            })
            messagediv.className = ''
            messagediv.classList.add('green')
            messagediv.classList.add('show-message')
            this.setupgame()
        }
        Socket.noidontwanttoplaycallback = (username)=>{
            this.setState({
                request:false,
                message:`${username} rejected your request to play.`
            })
            messagediv.className = ''
            messagediv.classList.add('red')
            messagediv.classList.add('show-message')
        }
        closemessagebutton.addEventListener('click',()=>{
            messagediv.className= '';
        })

        if(acceptbutton){
            acceptbutton.addEventListener('click',()=>{
                Socket.replytorequest(1,currentusername);
                messagediv.className = ''
                this.setupgame()
            })
        }
        if(declinebutton){
            declinebutton.addEventListener('click',()=>{
                Socket.replytorequest(0,currentusername);
                messagediv.className = ''
            })
        }
    }
    render(){
        
            return (
                <div id='message-div'>
                    <button id='closebutton'>X</button>
                    <p>{this.state.message}</p>
                    {this.state.request && 
                        <div>
                            <button  id='accept-button'>
                                <span className="material-icons">
                                    thumb_up
                                </span></button>
                            <button  id='decline-button'>
                                <span className="material-icons">
                                    thumb_down
                                </span></button>
                        </div>
                    }
                </div>
            )
        
        
    }
}

export default Message 