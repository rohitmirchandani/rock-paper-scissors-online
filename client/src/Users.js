import React from 'react'
import Socket from './socket';



class Users extends React.Component {
    constructor(props){
        super(props);
    }
    render(){
        
        return (
            <div id='userslist' >
                <h3>Active players!</h3>
                <ul>
                    {this.props.users.map(user=>{
                        return <li key={user}>
                            {user}
                            <abbr title='send request'>
                                <button key={user} className='sendrequestbutton' onClick={this.props.onadd}><span className='add-button-text' button-key={user}>+</span></button>
                            </abbr>
                            </li>
                    })}
                </ul>   
            </div>
        )   
    }
}

export default Users