import React, { Component } from 'react'
import Logo from '../LogoDropbox.png'
import '../Css/icons.css'
import '../Css/mainFiles.css'
import '../Css/nav.css'
import '../Css/UlItems.css'
import { Redirect } from 'react-router-dom'

// denna component visar left nav
class LeftNav extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            mainPage: false
        }
    }

    // när vi klickar på Start så skicakr den oss tillbaka till /main sidan!
    return_To_Main_Page = () => {
        this.setState({ mainPage: true });
    }

    render() {
        const { mainPage } = this.state;

        if (mainPage) return <Redirect to="/mandatory-advanced-js5" />

        return (
            <div className="sideLeft">
                <img src={Logo} />
                <ul>
                    <li onClick={this.return_To_Main_Page}> Start </li>
                    <br/>
                    <li> Filter </li>
                    <br/>
                    <li> Paper </li>
                    <br/>
                    <li> Transfer </li>
                </ul>
                <p className="sideTextLeft">Upcoming features</p>
            </div>
        )
    }
}

export default LeftNav