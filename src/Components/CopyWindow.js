import React, { PureComponent } from 'react'
import '../Css/filefolder.css'
import ReactDom from 'react-dom'
import { Dropbox } from "dropbox";
import CopyFolderList from './CopyFolderList'
import RouterForCopyWindow from './RouterForCopyWindow'

// Denna component renderar ut själva fönstret där man kan välja vilka folder man vill kopiera till
class CopyWindow extends PureComponent{
  constructor(props){
    super(props)
    this.state = {
      path: "",
      folders: [],
      routing: [],
    }
  }

  clickAnotherFolder = (path_display) =>{
    this.setState({path:path_display})
  }

  copyIntoCurrentFolder = () =>{
    const{path_display,copy,closeCopyWindow} = this.props
    copy(path_display,path_display)
    closeCopyWindow()
  }

  copyIntoSelectedFolder = () =>{
    const{copy,closeCopyWindow,path_display} = this.props
    const{path} = this.state
    copy(path_display, path)
    closeCopyWindow()
  }

  goBack = () =>{
    let path = this.state.path.split('/').filter(path => path !== "")
    let newPath = path.reduce((acc, current, idx ) =>( idx !== path.length-1 ? acc + `/${current}` : acc + "") , "")
    this.setState({path: newPath})
  }

  onClickRouting = (route) =>{
    this.setState({path:route})
  }

  onStartClick = () =>{
    this.setState({path:""})
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
      let pathArray = []
      let pathSplit = this.state.path.split('/').filter(path => path !== "").reduce((acc, current) =>{
        pathArray.push(acc+`/${current}`)
        return acc+`/${current}`} ,"")
      this.setState({folders: response.entries.filter(object => object[".tag"] ==="folder"),routing: pathArray})
    })
  }
  }

  render(){
  const{folders,path,routing} = this.state
  console.log(path)
  return ReactDom.createPortal(

  <div className="CopyWindow">
  <div>
  which folder do you want to copy it too?
  </div>
  <div className="routeDiv">
  <span className="routing" onClick={this.onStartClick}>start></span>
  {routing.map(route =>(
    <RouterForCopyWindow route={route} onClickRouting={this.onClickRouting}/>
  ))}
  </div>
  <ul className="selectFolder">
  {folders.map(folder => (
    <CopyFolderList folder={folder} clickAnotherFolder={this.clickAnotherFolder} copy={this.props.copy}/>
  ))}
  </ul>
  <div>
    <button onClick={this.copyIntoCurrentFolder}>Copy into current folder</button>
    <button onClick={this.copyIntoSelectedFolder}>Copy into selected folder</button>
    <button onClick={this.goBack}>Go Back</button>
    <button onClick={this.props.closeCopyWindow}>Cancel</button>
  </div>

  </div>
  , document.querySelector('#CopyWindow')

)
}
}

export default CopyWindow