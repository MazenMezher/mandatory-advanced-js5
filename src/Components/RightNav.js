import React, { Component } from 'react'
import CreateFolder from './CreateFolder'
import GoBack from './GoBack'

import '../Css/icons.css'
import '../Css/mainFiles.css'
import '../Css/nav.css'
import '../Css/UlItems.css'

class RightNav extends Component {
    constructor(props) {
        super(props)

        this.state = {
            showCreateFolder: false,
        }
        this.inputRef = React.createRef();
    }

    //simulera som om man klickade på input type fil
    createFile = () =>{
      this.inputRef.current.click();
    }

    //shows the window when click on create folder
    onShowCreateFolder= () =>{
      this.setState({showCreateFolder: true})
    }

    //closes the window when click on create folder
    onCloseCreateFolder = () =>{
      this.setState({showCreateFolder: false})
    }

    //Upload file
    onChangeFile = () =>{
      const{files} = this.props
      let file = this.inputRef.current.files[0]
      if(file){
        let path = `/${file.name}`
        if(this.props.path){
          path = `/${this.props.path}/${file.name}`
        }
        this.props.dbx.filesUpload({contents:file, path: path, autorename: true})
        .then(response=>{
          let file = {}
          file[".tag"] = "success"
          let createFile = {file,metadata: response}
          let uniteFiles = [...files, createFile]
          this.props.setFileState(uniteFiles)
        })
      }
    }

    //Create Folder
    createFolder = (name) =>{
      const{folders} = this.props
      let path = `/${name}`
      if(this.props.path){
        path = `/${this.props.path}/${name}`
      }
      this.props.dbx.filesCreateFolderV2({path: path, autorename:true })
      .then(response =>{
        let folder = {}
        folder[".tag"] = "folder"
        let newFolder = {...folder,...response.metadata}
        let allFolders = [...folders, newFolder]
        this.props.setFolderState(allFolders)
      })
      }
      
    render() {
        const{showCreateFolder} = this.state
        return (
            <div className="sidebarRight">
            <ul>
                <li onClick={this.createFile}>Upload File<input accept="jpg, jpeg, png, tiff, tif, gif, bmp" className="input"  onChange={this.onChangeFile} type="file" hidden="hidden" ref={this.inputRef}/> </li>
                <br />
                <li> Upload Map </li>
                <br/>
                <li onClick={this.onShowCreateFolder}>
                Create Folder
                </li>
                {showCreateFolder === true ?
                <CreateFolder showCreateFolder={showCreateFolder} createFolder={this.createFolder} onCloseCreateFolder={this.onCloseCreateFolder}/>
                : null}
                <br />
                <li><GoBack path={this.props.path}/></li>
            </ul>
              <p className="sideText">Choose your option</p>
            </div>
        )
    }
}

export default RightNav