import React, { PureComponent } from 'react'
import '../Css/Options.css'
import '../Css/filefolder.css'
import ReactDom from 'react-dom'
import { Dropbox } from "dropbox";
import SelectFolder from './SelectFolder'
import RouterForMoveWindow from './RouterForMoveWindow'

class MoveWindow extends PureComponent{
  constructor(props){
    super(props)
    this.state = {
      path: "",
      folders: [],
      routing: [],
    }
  }

  setPath = (current) =>{
    console.log(current)
    this.setState({path: current })
  }

  onClickRouting = (route) =>{
    this.setState({path:route})
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
      this.setState({folders: response.entries.filter(object => object[".tag"] ==="folder" ), routing: pathArray})
    })
  }
  }

  moveToFolder = () =>{
    let path_display = this.props.path_display
    console.log(this.state.path)
      path_display = path_display.split('/')
      path_display = `/${path_display[path_display.length-1]}`

    this.dbx.filesMoveV2({
      from_path: this.props.path_display,
      to_path: `${this.state.path}${path_display}`
    }).then(res => this.props.closeMoveWindow())
  }

  goBack = () =>{
    let path = this.state.path.split('/').filter(path => path !== "")
    let newPath = path.reduce((acc, current, idx ) =>( idx !== path.length-1 ? acc + `/${current}` : acc + "") , "")
    this.setState({path: newPath})
  }

  toStart = () =>{
    this.setState({path:""})
  }

  render(){
    const{folders,routing} = this.state

    return ReactDom.createPortal(
    <div className="moveWindow">
        <p style={{marginBottom: '10px'}}>Where do you want to move?</p>
        <div>
        <span className="routing" onClick={this.toStart}>start></span>
        {routing.map(route =>(
          <RouterForMoveWindow route={route} onClickRouting={this.onClickRouting}/>
        ))}
        </div>

        <ul className="folderSelect">
          {folders.map(folder =>(
            <li > <SelectFolder folder={folder} setPath={this.setPath}/></li>
          ))}

        </ul>
        <div>
          <button onClick={this.moveToFolder}>move to this folder</button>
          <button onClick={this.goBack}>Go Back</button>
          <button onClick={this.props.closeMoveWindow}>cancel</button>
        </div>
    </div>
    ,document.querySelector('#MoveWindow')
)}}

export default MoveWindow