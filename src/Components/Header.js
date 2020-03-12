import React, { PureComponent } from 'react'
import LogOut from './LogOut'
import '../Css/icons.css'
import '../Css/mainFiles.css'
import '../Css/nav.css'
import '../Css/UlItems.css'

import {Link} from 'react-router-dom'

class Header extends PureComponent{
  constructor(props){
    super(props)
    this.state = {
      links: []
    }
  }

  componentDidMount(){
    if(this.props.path !== undefined){
    let path = this.props.path
    let links = path.split("/")

    let newLinks = []
    links.reduce(((acc,currentLink)=>{
      let a = acc+"/"+currentLink
      newLinks.push(acc+"/"+currentLink)
      return acc+"/"+currentLink
    }),"")
    this.setState({links: newLinks})
  }
  }

  componentDidUpdate(prevProps){
    if(prevProps.path !== this.props.path){
      if(this.props.path !== undefined){
      let path = this.props.path
      let links = path.split("/")

      let newLinks = []
      links.reduce(((acc,currentLink)=>{
        let a = acc+"/"+currentLink
        newLinks.push(acc+"/"+currentLink)
        return acc+"/"+currentLink
      }),"")
      this.setState({links: newLinks})
    }
  }
}

  render(){
    const{links} = this.state
    return(
      <header>
        <h1>Project X</h1>
        <span className="pathing"><Link style={{color:'white'}} to={`/main`}>{"main>"}</Link></span>
        {links.map(link => {
          let realLink = link.split('/')

          return (<span className="pathing"><Link style={{color:'white'}}  to={`/main${link}`}>{`${realLink[realLink.length-1]}>`}</Link></span>)
        })}

          <input
            className="searchField"
            type="text"
            onChange={this.props.search_FOLDERS_FILES}
            placeholder="Search"
          />
          <LogOut/>
      </header>
)}}

export default Header