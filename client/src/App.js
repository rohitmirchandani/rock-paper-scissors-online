import React from 'react'
import Socket from './socket'
import Users from './Users';
import UsernameForm from './UsernameForm';
import Message from './Message';
// import './style.scss';

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            'users':[],
            'username':'' ,
            'opponent':'',
            'userscore':0,
            'opponentscore':0,
            'rounds':0,
        }
    }
    opponentmove = null;
    playgame(move1,move2){
        if(move1 == move2){
            return 0;
        }
        if(move1 == 'rock'){
            if(move2 == 'paper'){
                return -1;
            }else if(move2 == 'scissor'){
                return 1
            }
        }else if(move1 == 'paper'){
            if(move2 == 'rock'){
                return 1
            }else if(move2 == 'scissor'){
                return -1
            }
        }else if(move1 == 'scissor'){
            if(move2 == 'rock'){
                return -1
            }else if(move2 == 'paper'){
                return 1;
            }
        }
    }
    declareresults(usermove,opponentmove){
        let usersection = document.getElementById('your-section')
        let opponentsection = document.getElementById('opponent-section')
        let result = this.playgame(usermove,opponentmove)
        let resultdiv = document.querySelector('#result-div p')
        document.querySelector('#opponent-section img').src = './images/'+opponentmove+'.png'
        if(result == 1){
            usersection.classList.add('winner')
            opponentsection.classList.add('looser')
            this.setState({
                userscore: this.state.userscore+1
            })
            resultdiv.innerText = 'Beated!'
        }else if(result == -1){
            usersection.classList.add('looser')
            opponentsection.classList.add('winner')
            this.setState({
                opponentscore: this.state.opponentscore + 1
            })
            resultdiv.innerText = 'Beaten!'
        }else if(result == 0){
            usersection.classList.add('draw')
            opponentsection.classList.add('draw')
            resultdiv.innerText = 'Draw!'
        }
        this.setState({
            rounds:this.state.rounds + 1
        })
        document.getElementById('result-div').classList.add('show')
        setTimeout(() => {
            usersection.className = ''
            opponentsection.className = ''
            document.querySelector('.selected-button').classList.remove('selected-button')
            document.querySelector('#opponent-section img').src = './images/wait.gif'
            document.getElementById('result-div').classList.remove('show');
            if(this.state.rounds >=5){
                this.finishgame()
            }
        }, 2000);
        
    }
    showversus(text){
        let versusscreenstrong = document.querySelector('#versus-screen strong')
        let versusscreen = document.getElementById('versus-screen')
        versusscreenstrong.innerText = text;
        this.setState({'username':''})
        versusscreen.className = ''
        versusscreen.classList.add('bounce-in')
        setTimeout(()=>{
            versusscreen.className = 'scale-out'
        },2000)
        setTimeout(()=>{
            this.setState({'username':Socket.username})
        },2400)
        setTimeout(()=>{
            versusscreen.className = ''
            versusscreenstrong.innerText = 'V/S';
        },3000)
    }
    finishgame(){
        let text = ((this.state.userscore == this.state.opponentscore)?'Game Tie!':(this.state.userscore>this.state.opponentscore)?'You Won!':'You Lose!')
        this.gameout()
        this.showversus(text)
    }

    gameout(){
        Socket.opponent = ''
        this.setState({
            'opponent':'',
            'userscore':0,
            'opponentscore':0,
            'rounds':0,
        })
        let welcomescreen = document.getElementById('welcome-screen')
        let gamescreen = document.getElementById('game-screen')
        welcomescreen.classList.remove('hide')
        gamescreen.classList.add('hide')    
        document.getElementById('userslist').classList.remove('nosendbutton')
    }

    quitgame(){
        Socket.quit()
        this.gameout()
        this.showversus('You quit!');
    }

    componentDidMount(){
        Socket.runsocket(this);
        let movebuttons = document.querySelectorAll('.move-button');
        let yoursection = document.getElementById('your-section');
        let quitbutton = document.getElementById('quit-button');
        let yesbutton = document.getElementById('yes-button')
        let nobutton = document.getElementById('no-button')
        let showuserslistbutton = document.getElementById('showuserslistbutton')

        movebuttons.forEach(button=>{
            button.addEventListener('click',(event)=>{
                let usermove =event.currentTarget.getAttribute('id') 
                Socket.move(usermove);
                yoursection.classList.add('selected')
                event.currentTarget.classList.add('selected-button')
                if(document.getElementById('opponent-section').classList.contains('selected')){
                    this.declareresults(usermove,this.opponentmove)
                }
            })
        })
        Socket.opponentmovecallback = (move)=>{
            this.opponentmove = move
            let opponentsection = document.getElementById('opponent-section');
            opponentsection.classList.add('selected');
            if(document.getElementById('your-section').classList.contains('selected')){
                console.log(document.querySelector('#your-section .selected-button'))
                this.declareresults(document.querySelector('#your-section .selected-button').getAttribute('id'),move)
            }else{
                document.querySelector('#opponent-section img').src = './images/question-mark.png'
            }
        }
        
        quitbutton.addEventListener('click',()=>{
            document.getElementById('confirm-message-div').classList.remove('hide');
        })
        nobutton.addEventListener('click',()=>{
            document.getElementById('confirm-message-div').classList.add('hide');
        })
        yesbutton.addEventListener('click',()=>{
            document.getElementById('confirm-message-div').classList.add('hide');
            this.quitgame();
        })
        Socket.opponentquitcallback = ()=>{
            this.gameout();
            this.showversus('opp. quitted!');
        }
        Socket.userleftcallback = (username)=>{
            if(username == this.state.opponent){
                this.gameout();
                this.showversus('opp. left!')
            }
        }
        Socket.onerrorcallback = ()=>{
            document.getElementById('error-screen').classList.remove('hide')
        }
        showuserslistbutton.addEventListener('click',()=>{
            showuserslistbutton.classList.toggle('active')
            document.getElementById('userslist').classList.toggle('active')
        })
    }
    showwelcome(){
        let welcome = document.getElementById('welcome-screen')
        welcome.classList.remove('hide')
    }
    render(){
        return(
            <div id="app-div">
                <UsernameForm showwelcome = {this.showwelcome}/>
                <div id='game-div'>
                    <Users users = {this.state.users} onadd={Socket.onadd} />
                    <div id="game">
                    <button id='showuserslistbutton'><span className='material-icons'>groups</span></button>
                        <div id='welcome-screen' className='hide'>
                            <h1 id='heading'>PAPER SCISSOR ROCKS...</h1>
                            <img src='./images/logo.png' id='logo'/>
                            <h3 className='bounce-in'>Hey! {this.state.username}</h3>
                            <p>Select your opponent...</p>
                            <img id='arrow' src='./images/arrow.png'/>
                        </div>
                        <div id='versus-screen'>
                            <p><span>{this.state.username}</span><strong>V/S</strong><span>{this.state.opponent}</span></p>
                        </div>
                        <div id='game-screen' className='hide'>
                            <div id='score-div'>
                                    <div className='score'>
                                        <h6>You</h6>
                                        <p>{this.state.userscore}</p>
                                    </div>
                                    <div id='round-div'>
                                    <strong>{this.state.rounds}</strong>/<strong>5</strong>
                                     </div>
                                    <div className='score'>
                                        <h6>{this.state.opponent}</h6>
                                        <p>{this.state.opponentscore}</p>
                                    </div>
                            </div>
                            <div id="section-div">
                                <div id='your-section' >
                                    <button className='move-button' id='rock'><img src='./images/rock.png'/></button>
                                    <button className='move-button' id='paper'><img src='./images/paper.png'/></button>
                                    <button className='move-button' id='scissor'><img src='./images/scissor.png'/></button>
                                </div>
                                <hr/>
                                <div id='opponent-section'>
                                    <img src='./images/wait.gif' alt=''/>
                                    <p>selected</p>
                                </div>
                            </div>
                            <div id='result-div'>
                                <p>Beated!</p>
                            </div>
                            <button id='quit-button'>quit</button>
                            <div id='confirm-message-div' className='hide'>
                                <div id='confirm-message'>
                                    <p>Are you sure you want to quit?</p>
                                    <button id='yes-button'>Yes</button>
                                    <button id='no-button'>No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Message />
                    <div id='error-screen' className='hide' >
                        <span>An error occured!! please <button onClick= {()=>{window.location.reload(true)}}>reload</button> or try again later.</span>
                    </div>
                </div>
            </div>    
        )
    }
}

export default App 