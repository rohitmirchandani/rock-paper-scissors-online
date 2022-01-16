import React from 'react'

class Header extends React.Component{
    constructor(props){
        super(props);
    }
    render(){   
        return(
            <header>
                <div id='logo-div'>
                    <img id='logo' src='./images/logo.png'/>
                    <h1><span>Paper </span><span>Scissor </span><span>Rocks...</span></h1>
                </div>
                <div id='user-div'>
                    <div id='userlogo'><span>{this.props.username.trim().charAt(0)}r</span></div>
                    <p id='username'>{this.props.username}rohit</p>
                </div>
                <div id='userslist-button-div'><button id='userslist-button' class="material-icons">groups</button></div>
            </header>
        )
    }
}

export default Header