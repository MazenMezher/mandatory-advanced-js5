import React, { Component } from 'react' 
import { Redirect } from "react-router-dom"
import { updateToken } from './TokenStore';

class GetToken extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            activeToken: false
        }
    }

    componentDidMount() {
        let fullHash = window.location.hash;
        console.log(fullHash)
        let hash = fullHash.match(/[A-Za-z\d\.\-_]{3,}/g);
        this.setState({ activeToken: true });
        updateToken(hash[1]);
    }

    render() {
        const { activeToken } = this.state;

        if (activeToken) return <Redirect to="/main" />

        return (
            <div>
            </div>
        )
    }
}

export default GetToken
