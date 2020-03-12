import React, { Component } from 'react'
import { Dropbox } from "dropbox";
import { Redirect } from 'react-router-dom';
import '../Css/Login.css'
import LoginImg from '../LoginAvatarImg.png'

// denna component låter oss logga in!
class LogIn extends Component {
    constructor(props) {
        super(props)

        this.state = {
            LoginDropBox: '',
            accessToken: false,
            tokenAvailable: false
        }
    }

    componentDidMount() {
        // hämtar token från localStorage
        let token = localStorage.getItem('token');
        console.log(token);

        // ifall token finns så vill vi uppdatera tokenAvailable så vi kan senare redirecta till /main
        if (token) {
            this.setState({ tokenAvailable: true });
            console.log('Token is available');
        }
        else {
            this.setState({ tokenAvailable: false });
            console.log('Token is unavailable');
        }
    }

    // Denna funktionen låter oss logga in
    LogIn = () => {


        let CLIENT_ID = 'lkpumaokfkbkx9k';

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
                <div className = 'base-container'>
                  <div className='container'>
                        <div className='image'>
                            <img src={LoginImg} />
                        </div>
                        <button className='LoginButton'><a className='LoginBtn' onClick={this.LogIn} href={LoginDropBox}>Login</a></button>
                  </div>
                </div>
            </div>
        )
    }
}

export default LogIn