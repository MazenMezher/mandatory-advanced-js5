import React, { Component, PureComponent } from 'react'
import '../Css/Options.css'
import ReactDom from 'react-dom'
import { Dropbox } from "dropbox";
import SelectFolder from './SelectFolder'


class MoveWindow extends PureComponent{
  constructor(props){
    super(props)
    this.state = {
      path: "",
      folders: [],
    }
  }
   setPath = (current) =>{
     console.log(current)
     this.setState({path: current })
   }

  
  componentDidMount(){
    this.dbx = new Dropbox({ accessToken: localStorage.getItem("token") });
    this.dbx.filesListFolder({path:""})
    .then(response =>{
      this.setState({folders: response.entries.filter(object => object[".tag"] ==="folder" )})
    })
  }

  componentDidUpdate(prevProps,prevState){
    if(prevState.path !== this.state.path){
    this.dbx.filesListFolder({path: this.state.path})
    .then(response =>{
      this.setState({folders: response.entries.filter(object => object[".tag"] ==="folder" )})
    })
  }
  }
  
  moveToFolder = () =>{
    let path_display = this.props.path_display
    console.log(this.state.path)
      path_display = path_display.split('/')
      path_display = `/${path_display[path_display.length-1]}`
    
    console.log(path_display)

    this.dbx.filesMoveV2({
      from_path: this.props.path_display,
      to_path: `${this.state.path}${path_display}`
    }).then(res => this.props.closeMoveWindow())
  } 


  render(){
    const{folders} = this.state

  return ReactDom.createPortal(
  <div className="moveWindow">
      <p style={{marginBottom: '10px'}}>Where do you want to move?</p>
      <ul className="folderSelect">
        {folders.map(folder =>(
          <li > <SelectFolder folder={folder} setPath={this.setPath}/></li>
        ))}

      </ul>
      <div>
        <button onClick={this.moveToFolder}>move to this folder</button>
        <button onClick={this.props.closeMoveWindow}>cancel</button>

      </div>

  </div>
  ,document.querySelector('#MoveWindow')

)}}



export default MoveWindow
