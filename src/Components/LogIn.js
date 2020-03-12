import React, { Component } from 'react'
import { Dropbox } from "dropbox";
import { Redirect } from 'react-router-dom';

class LogIn extends Component {
    constructor(props) {
        super(props)

        this.state = {
            LoginDropBox: '',
            accessToken: false,

            myToken: null,
            tokenAvailable: false
        }
    }

    componentDidMount() {
        // get the token from localStorage
        let token = localStorage.getItem('token');
        console.log(token);

        if (token) {
            this.setState({ myToken: token, tokenAvailable: true });
            console.log('Token is available');
        }
        else {
            this.setState({ myToken: null, tokenAvailable: false });
            console.log('Token is unavailable');
        }
    }

    LogIn = () => {
        let CLIENT_ID = '1rw2bkl9h8tl2yb';

        let dbx = new Dropbox({ clientId: CLIENT_ID });
        let LocalHost = 'http://localhost:3000/auth';
        let authUrl = dbx.getAuthenticationUrl(LocalHost);

        this.setState({ LoginDropBox: authUrl});
    }

    render() {
        const { LoginDropBox, tokenAvailable } = this.state;

        if (tokenAvailable) return <Redirect to="/main" />

        return (
            <div>
                <a onClick={this.LogIn} href={LoginDropBox}>Logga in</a>
            </div>
        )
    }
}

export default LogIn