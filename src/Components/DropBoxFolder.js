import React, { Component } from 'react'

import { Dropbox } from "dropbox";
import LogOut from './LogOut'
import DropdownOptions from './DropdownOptions'
import CreateFolder from './CreateFolder'


import '../Css/icons.css'
import '../Css/mainFiles.css'
import '../Css/nav.css'
import '../Css/UlItems.css'

import folderImg from '../Img/folder-img.png';
import { Link,Redirect } from 'react-router-dom';

class DropBoxFolder extends Component {
    constructor(props) {
        super(props)

        this.state = {
          folders: [],
          show: false,
          files: [],
          URL: null,
          links: [],
          showCreateFolder: false,
        }
  
        this.inputRef = React.createRef()
        }

    
    // delets files and closes delete window
    onDelete = (path_delete) =>{
      const{folders} = this.state
      const dbx = new Dropbox({ accessToken: localStorage.getItem("token") });
      dbx.filesDelete({path: path_delete})
      .then(response =>{
        let newFolder = folders.filter( folder => folder.name !== response.name)
        this.setState({folders: newFolder, deleteButtonClicked : false})
      })
    }


    createFolder = (name) =>{
      let path = this.props.match.params.path
      this.dbx.filesCreateFolderV2({path: `/${path}/${name}`, autorename:true })
      .then(response =>{
        console.log(response)
        let folder = {}
        folder[".tag"] = "folder"
        let newFolder = {...folder,...response.metadata}
        let allFolders = [...this.state.folders, newFolder]
        this.setState({folders: allFolders})
      }).catch(response=>{
        console.log(response)
      })
    }
    //shows the window when click on create folder
    onShowCreateFolder= () =>{
      this.setState({showCreateFolder: true})
    }
    //closes the window when click on create folder
    onCloseCreateFolder = () =>{
      this.setState({showCreateFolder: false})
    }

    createFile = () =>{
      this.inputRef.current.click();
    }
    onChangeFile = () =>{
      let file = this.inputRef.current.files[0]
      if(file){
        this.dbx.filesUpload({contents:file, path:`/${this.props.match.params.path}/${file.name}`, autorename: true})
        .then(response=>{
          console.log(response)
          let file = {}
          file[".tag"] = "success"
          let createFile = {file,metadata: response}
          let uniteFiles = [...this.state.files, createFile]
          this.setState({uniteFiles})
        }).catch(response=>{
          console.log(response)
        })
      }
    }

    onGoBack = () =>{
      const{links} = this.state
      let newLink = links[links.length-2]
      if(newLink !== undefined){

      return `/main${newLink}`
    }else{
      return `/main`
    }

    }

    componentDidMount() {
      // hämtar folders
      let path = this.props.match.params.path
      let links = path.split("/")
      console.log(links)
      let newLinks = []
      links.reduce(((acc,currentLink)=>{
        let a = acc+"/"+currentLink
        newLinks.push(acc+"/"+currentLink)
        return acc+"/"+currentLink
      }),"")
      console.log(newLinks)

      this.dbx = new Dropbox({ accessToken: localStorage.getItem("token") });
      this.dbx.filesListFolder({ path: `/${path}` })
        .then((res) => {

          this.setState({ folders: res.entries,links: newLinks });

        const entries = res.entries
          .filter(x => x[".tag"] === "file")
          .map((x) => ({ path: x.path_display }));
        return this.dbx.filesGetThumbnailBatch({
          entries: entries,
        });
        })
        .then((res) => {
          this.setState({ files: res.entries });
        });
    }
  


    componentDidUpdate(prevProps, prevState) {
      let path = this.props.match.params.path
      let links = path.split("/")

      let newLinks = []
      links.reduce(((acc,currentLink)=>{
        let a = acc+"/"+currentLink
        newLinks.push(acc+"/"+currentLink)
        return acc+"/"+currentLink
      }),"")

      if (prevState.folders === this.state.folders && prevState.files === this.state.files) {
      this.dbx = new Dropbox({ accessToken: localStorage.getItem("token") });

      this.dbx.filesListFolder({ path: `/${path}` })
      .then((res) => {
        this.setState({ folders: res.entries, links: newLinks })
        const entries = res.entries
        .filter(x => x[".tag"] === "file")
        .map((x) => ({ path: x.path_display }));
      return this.dbx.filesGetThumbnailBatch({ entries });
      })
      .then((res) => {
        this.setState({ files: res.entries });
      });
  }
  }

  downloadFile = (file) => {
    this.dbx.filesGetThumbnail({"path": file})
      .then(res => {
        console.log('HEJ 3', res);
        let objURL = window.URL.createObjectURL(res.fileBlob);
        this.setState({ URL: objURL });
      });
  }

    render() {

      const { folders, files, URL,links, showCreateFolder } = this.state;


      let minaFiler = files.map(file => {

        let image = `data:image/jpeg;base64,${file.thumbnail}`;
        let fileName
        let date_input
        let datum
        let size
        let i
        let newSize

        if(file[".tag"] === "failure"){
          return null
        }
        else {
          fileName = file.metadata.name;
          date_input = new Date((file.metadata.client_modified));
          datum = new Date(date_input).toDateString();



          size = file.metadata.size;
          i = Math.floor(Math.log(size) / Math.log(1024));
          newSize = (size / Math.pow(1024, i)).toFixed(2) * 1 + ""+['B', 'kB', 'MB', 'GB', 'TB'][i]

        }
        return (
          <tr>
            <td>
            <div style={{ display: 'flex' }}>
              <img src={image} style={{ height: '42px', width: '42px' }} alt=""/>
              <a onClick={() => this.downloadFile(file.metadata.path_display)} href={URL} download={fileName}>{fileName}</a>
              <span> {" Latest change: " + datum} </span>
              <span> {" Filesize: " + newSize} </span>

            </div>
            </td>
          </tr>
        )
      })

      let minaFolders = folders.map(folder => {
        // render img icons to folders !

        const type = folder['.tag'];
        let folderThumbnail

        if (type === 'folder') {
          folderThumbnail = folderImg;
        return (
          <tr>
            <td>
            <div style={{ display: 'flex' }}>
            <img src={folderThumbnail} style={{ height: '42px', width: '42px' }} alt=""/>
                <Link to={`/main${folder.path_display}`}>
                  {folder.name}
                </Link>

                <td className="dropdownList">
                <DropdownOptions
                  onDelete={this.onDelete}
                  path={folder.path_display}
                  name={folder.name}
                  />
                  </td>
            </div>
            </td>
          </tr>
        )
      }
      })


        return (
          <div className="App" >
        <div className="sideLeft">
          <div className="Logo">
            Logo
          </div>
          <ul>
            <li> Start </li>
            <br/>
            <li> Filter </li>
            <br/>
            <li> Paper </li>
            <br/>
            <li> Transfer </li>
          </ul>
        </div>

        <div className={"bigBox"}>
          <header>
            <h1>Project X</h1>
              <input placeholder="Search" type="text" />
              <LogOut />

              {links.map(link => {

                return (<span className="pathing"><Link style={{color:'white'}} to={`/main${link}`}>{link}</Link></span>)
              })}

          </header>

          <main>

          <div className="files">
                <table className="table">
                    <thead>
                      <tr>
                        <th>Folder/file name</th>
                      </tr>
                  </thead>

                  <tbody>
                  <h2>Folders!</h2>
                    {minaFolders}

                  <h2 style={{ marginTop: '10%' }}>Files!</h2>
                    {minaFiler}

                </tbody>
                </table>

            </div>

            <div className="sidebarRight">
            <ul>

                <li> New Map </li>
                  <br/>
                <li onClick={this.createFile}>
                Upload File
                <input onChange={this.onChangeFile} type="file" hidden="hidden" ref={this.inputRef}/> </li>
                <br />
                <li> Upload Map </li>
                <br />
                <li onClick={this.onShowCreateFolder}>
                Create Folder
                </li>
                {showCreateFolder === true ?
                <CreateFolder showCreateFolder={showCreateFolder} createFolder={this.createFolder} onCloseCreateFolder={this.onCloseCreateFolder}/>
                : null}

                <br />
                <li> New Shared Map </li>
                <br />
                <Link to={this.onGoBack} onClick={this.onGoBack}> Go Back </Link>
                <br />


            </ul>
            <p className="sideText">Choose your option</p>
            </div>
          </main>
        </div>
    </div>
      )
    }
}

export default DropBoxFolder
