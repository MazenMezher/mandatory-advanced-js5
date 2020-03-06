import React, { Component } from 'react'
import { Dropbox } from "dropbox";
import { Link } from 'react-router-dom';
import LogOut from './LogOut'
import DropdownOptions from './DropdownOptions'
import CreateFolder from './CreateFolder'
import folderImg from '../Img/folder-img.png';

import '../Css/icons.css'
import '../Css/mainFiles.css'
import '../Css/nav.css'
import '../Css/UlItems.css'



class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
          folders: [],
          show: false,
          files: [],
          URL: null,

          folderRename: '',
          fileRename: '',

          showCreateFolder: false,
        }
        this.inputRef = React.createRef();
        this.renameRef = React.createRef();
    }
    // delets files and closes delete window
    onDelete = (path_delete) =>{
      const{folders} = this.state
      this.dbx.filesDelete({path: path_delete})
      .then(response =>{
        let newFolder = folders.filter( folder => folder.name !== response.name)
        this.setState({folders: newFolder})
      })
    }

    //Create Folder
    createFolder = (name) =>{
      this.dbx.filesCreateFolderV2({path: `/${name}`, autorename:true })
      .then(response =>{
        let folder = {}
        folder[".tag"] = "folder"
        let newFolder = {...folder,...response.metadata}
        let allFolders = [...this.state.folders, newFolder]
        this.setState({folders: allFolders})
      }).catch(response=>{
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

    updateFolderName = e => {
      this.setState({ folderRename: e.target.value });
    }

    updateFileName = e => {
      this.setState({ fileRename: e.target.value });
    }

    // delets files and closes delete window
    onDelete = (path_delete) =>{
      const{folders} = this.state
      const dbx = new Dropbox({ accessToken: localStorage.getItem("token") });
      dbx.filesDelete({path: path_delete})
      .then(response =>{
        let newFolder = folders.filter( folder => folder.name !== response.name)
        this.setState({folders: newFolder })
      })
    }
    createFile = () =>{
      this.inputRef.current.click();
    }
    
    onChangeFile = () =>{
      let file = this.inputRef.current.files[0]
      if(file){
        this.dbx.filesUpload({contents:file, path:`/${file.name}`, autorename: true})
        .then(response=>{
          let file = {}
          file[".tag"] = "success"
          let createFile = {file,metadata: response}
          let uniteFiles = [...this.state.files, createFile]
          this.setState({uniteFiles})
        }).catch(response=>{
        })
      }
    }

    componentDidMount() {
      this.dbx = new Dropbox({ accessToken: localStorage.getItem("token") });
      this.dbx.filesListFolder({ path: "" })
        .then((res) => {
          this.setState({ folders: res.entries });

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
      if (prevState.folders === this.state.folders && prevState.files === this.state.files) {
      this.dbx = new Dropbox({ accessToken: localStorage.getItem("token") });

      let path = this.props.location.pathname;
      path = path.slice(5);
      this.dbx.filesListFolder({ path: path })
      .then((res) => {
        this.setState({ folders: res.entries })

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

  search_FOLDERS_FILES = (e) => {
    this.dbx.filesSearch({ path: '' ,query: e.target.value})
    .then(res => {
      let entries = res.matches.map(x => x.metadata);

      this.setState({ folders: entries });

      entries = entries
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

  downloadFile = (file) => {
    this.dbx.filesGetThumbnail({"path": file})
      .then(res => {
        let objURL = window.URL.createObjectURL(res.fileBlob);
        this.setState({ URL: objURL });
      });
  }
  
  renameFolders = (path, id) => {
    const newName = this.state.folderRename;

    this.dbx.filesMoveV2({
      "from_path": path,
      "to_path": `/${newName}`,
    })
    .then(res => {
      console.log('rename', id);
      console.log('rename', res);
      console.log('rename', window.location.pathname);

      const newFolders = [...this.state.folders];
      const idx = newFolders.findIndex(x => x.id === id);
      console.log('rename', idx);
      newFolders[idx] = res.metadata;

      this.setState({ folders: newFolders });
    })
  }

  renameFiles = (path, id) => {
    const newName = this.state.fileRename;
    console.log('success', id);

    let splitPath = path.split(".")
    let fileType = splitPath[1];

    this.dbx.filesMoveV2({
      "from_path": path,
      "to_path": `/${newName}.${fileType}`,
    })
    .then(res => {
      console.log('rename', id);
      console.log('rename', res.metadata.id);
      console.log('rename', window.location.pathname);
      
      const newFiles = [...this.state.files];
      const idx = newFiles.findIndex(x => {
        if (x['.tag'] === 'failure') {
          return null
        }
        else {
          console.log('rename', x)
          return x.metadata.id === id;
        }
      })

      console.log('rename', res.metadata);
      console.log('rename', idx);

      newFiles[idx] = res.metadata;

      this.setState({ files: newFiles });
      console.log('rename', newFiles)
    })
  }


    render() {
      const { folders, files, URL, showCreateFolder } = this.state;

      console.log(files, folders);

      let minaFiler = files.map(file => {
        let image = `data:image/jpeg;base64,${file.thumbnail}`;

        

        let fileName
        let date_input
        let datum
        let size
        let newSize
        let i
        let idx
        let path

        if(file[".tag"] === "failure"){
          return null
        }
        else {
          if (file.metadata) {
            fileName = file.metadata.name;
            date_input = new Date((file.metadata.client_modified));
            datum = new Date(date_input).toDateString();
  
            size = file.metadata.size;
            i = Math.floor(Math.log(size) / Math.log(1024));
            newSize = (size / Math.pow(1024, i)).toFixed(2) * 1 + ""+['B', 'kB', 'MB', 'GB', 'TB'][i];

            idx = file.metadata.id;
            path = file.metadata.path_display;
          }
          else {
          fileName = file.name;
          date_input = new Date((file.client_modified));
          datum = new Date(date_input).toDateString();

          size = file.size;
          i = Math.floor(Math.log(size) / Math.log(1024));
          newSize = (size / Math.pow(1024, i)).toFixed(2) * 1 + ""+['B', 'kB', 'MB', 'GB', 'TB'][i];

          idx = file.id;
          path = file.path_display;
          }
          console.log('kung2', file);
        }
      
        return (
          <tr>
            <td>
            <div style={{ display: 'flex' }}>
              <img src={image} style={{ height: '42px', width: '42px' }} alt=""/>
              <a onClick={() => this.downloadFile(path)} href={URL} download={fileName}>{fileName}</a>

              <span>{" Latest change: " + datum}</span>
              <span>{" Filesize: " + newSize}</span>
              
              <input className="tdInput" type="text" onChange={this.updateFileName.bind(this)}/>
              <button className="tdButton" onClick={() => this.renameFiles(path, idx)}>Rename</button>
              
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
                    id={folder.id}
                    updateFolderName={this.updateFolderName.bind(this)}
                    renameFolders={this.renameFolders}
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
              <input 
                className="searchField"
                type="text" 
                onChange={this.search_FOLDERS_FILES.bind(this)} 
                placeholder="Search"
              />
              <LogOut/>
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
                <li onClick={this.createFile}>Upload File<input onChange={this.onChangeFile} type="file" hidden="hidden" ref={this.inputRef}/> </li>
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
                <li> New Shared Map </li>
            </ul>
              <p className="sideText">Choose your option</p>
            </div>
          </main>
        </div>
    </div>
      )
    }
  }

export default Main
