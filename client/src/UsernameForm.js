import React from 'react'
import Socket from './socket'

class UsernameForm extends React.Component{
    constructor(props){
        super(props);
    }
    submitform(event){
        let usernameinput = document.getElementById('getusernameinput').value
        event.preventDefault()
        Socket.getusername(usernameinput)
    }
    
    componentDidMount(){
        let connectingDiv = document.getElementById('connecting-div')
        let connectingsubdiv= document.querySelector('#connecting-div>div')
        let warning = document.getElementById('warning')
        let formdiv = document.getElementById('form-div')
        let stone = document.querySelector('.stone')
        Socket.onopencallback = ()=>{
            setTimeout(() => {
                connectingDiv.classList.add('hide')
            }, 700);
        }
        
        Socket.alreadyexistcallback = ()=>{
            warning.classList.add('vibrate')
            setTimeout(()=>{
                warning.classList.remove('vibrate')
            },700)
            warning.classList.add('show')
        }

        Socket.userjoinedcallback = ()=>{
            warning.classList.remove('show')
            formdiv.classList.add('slide-out')
            setTimeout(()=>{
                formdiv.classList.add('hide')
                this.props.showwelcome()
            },500)
            Socket.username = document.getElementById('getusernameinput').value
            stone.classList.remove('bounce')
        }
    }

    render(){
        return(
            <div id='form-div'> 
                <form id='getusernameform' className='papers' onSubmit={this.submitform}>
                    <img className='stone bounce' src='./images/stone.png'/>
                    <div  id="connecting-div">
                        <div><p>Connecting</p><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>
                    </div>
                    <p id="warning">This username is occupied... Enter a different username.</p>
                    <label >Tell us your username...</label>
                    <input id='getusernameinput' type='text' minLength={1} maxLength={20} autoComplete='off' autoFocus required />
                    <button className="submit-button" type='submit'><span className="material-icons">forward</span></button>
                </form>
            </div>
        )
    }
}

export default UsernameForm 