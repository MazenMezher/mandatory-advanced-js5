import React, { Component } from 'react'
import {Link} from 'react-router-dom'
import '../Css/UlItems.css'

// denna component gör så att den tar oss ett steg tillbaka i path!

class GoBack extends Component {
  goBackwards = () =>{
    if(!this.props.path){
      return "/main"
    }
    let path = this.props.path.split('/')
    let cutpath = path.slice(0,path.length-1)
    let newPath = cutpath.reduce((acc,currentpath) => (acc + `/${currentpath}`),"")
    return `/main${newPath}`
  }

    render() {
        return (
          <div onClick={this.goBackwards}>
          <Link className="liDiv" to={this.goBackwards}>Go Back</Link>
          </div>
        )
    }
}

export default GoBack