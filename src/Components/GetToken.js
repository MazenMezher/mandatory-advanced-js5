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

    // när sidan laddas upp för första gången när vi håller på att logga in, så vill vi spara själva token i vår TokenStore.js
    // Samtidigt så gör vi så att vi redirectar till /main
    componentDidMount() {
        let fullHash = window.location.hash;
        let hash = fullHash.match(/[A-Za-z\d\.\-_]{3,}/g);
        this.setState({ activeToken: true });
        updateToken(hash[1]);
    }

    render() {
        const { activeToken } = this.state;

        if (activeToken) return <Redirect to="/main" />

        return (
            <>
            </>
        )
    }
}

export default GetToken
