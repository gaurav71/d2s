import React, {Component} from 'react';
import axios from "axios";

class Navbar extends Component{
    constructor(props){
        super(props);
    }


    render(){
        var logoutButton = "";
        if(this.props.authenticated)
            logoutButton = <button id="logout-button" onClick={this.props.handleLogout}>Logout</button>

        return(
            <div className="navbar">
                <button id="nav-title">D2S</button>
                {logoutButton}
            </div>
        )
    }

}

export default Navbar