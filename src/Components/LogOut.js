import React, { Component } from 'react'
import { updateToken } from './TokenStore';
import { Redirect } from 'react-router-dom';

// denna component gör så att vi kan logga ut!   Denna komponenten har vi lagt in i Header.js
class LogOut extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            logout: false
        }
    }

    // denna funktionen loggar oss ut och tar bort allt som finns i localStorage!  Den redirectar oss till "/" som är vår login sida!
    logOut = () => {
        this.setState({ logout: true });
        localStorage.clear();
        updateToken(null);
    }

    render() {
        const { logout } = this.state;

        if (logout) return <Redirect to="/" />

        return (
            <>
                <button className="buttonField" onClick={this.logOut}>Log out</button>
            </>
        )
    }
}

export default LogOut