import React, { Component } from 'react'
import { Dropbox } from "dropbox";
import LogOut from './LogOut'
import LeftNav from "./LeftNav"
import Folders from "./Folders"
import RightNav from "./RightNav"
import Header from './Header'

import '../Css/icons.css'
import '../Css/mainFiles.css'
import '../Css/nav.css'
import '../Css/UlItems.css'

class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
          folders: [],
          files: [],
          folderRename: '',
          fileRename: '',
        }
        this.renameRef = React.createRef();
    }
    setFolderState = (newFolder) =>{
      this.setState({folder: newFolder})
    }
    setFileState = (newFile) =>{
      this.setState({file: newFile})
    }

    updateFolderName = e => {
      this.setState({ folderRename: e.target.value });
    }

    updateFileName = e => {
      this.setState({ fileRename: e.target.value });
    }

    // delets files and closes delete window
    onDelete = (path_delete, tag) =>{
      if(tag === 'folder'){
      const{folders} = this.state
      this.dbx.filesDelete({path: path_delete})
      .then(response =>{
        let newFolder = folders.filter( folder => folder.name !== response.name)
        this.setState({folders: newFolder })
      })
    }else{
      const{files} = this.state
      this.dbx.filesDelete({path: path_delete})
      .then(response =>{
        let newFiles = files.filter( files => files.metadata.name !== response.name)
        this.setState({files: newFiles })
      })
    }
  }

    componentDidMount() {
      this.setState({
        // starArray: JSON.parse(window.localStorage.getItem("favorites") || "[]")
      });
        // let log = JSON.parse(window.localStorage.getItem("favorites"));

      this.dbx = new Dropbox({ accessToken: localStorage.getItem("token") });
      let path = ""
      if(this.props.match.params){
        path = `/${this.props.match.params.path}`
      }
      this.dbx.filesListFolder({ path: path })
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
  renameFolders = (path, id) => {
    const newName = this.state.folderRename;

    this.dbx.filesMoveV2({
      "from_path": path,
      "to_path": `/${newName}`,
    })
    .then(res => {
      const newFolders = [...this.state.folders];
      const idx = newFolders.findIndex(x => x.id === id);
      newFolders[idx] = res.metadata;

      this.setState({ folders: newFolders });

    })
  }

  renameFiles = (path, id) => {
    const newName = this.state.fileRename;

    let splitPath = path.split(".")
    let fileType = splitPath[1];

    this.dbx.filesMoveV2({
      "from_path": path,
      "to_path": `/${newName}.${fileType}`,
    })
    .then(res => {
      let tag = res[".metadata.tag"];
      if(tag === "folder"){
        const newFiles = [...this.state.files];
        const idx = newFiles.findIndex(x => x.id === id);
        newFiles[idx] = res.metadata;
        this.setState({ files: newFiles });return null
      }
      else {
        return null
      }
    })
  }
    render() {
      const { folders, files, } = this.state;
        return (
          <div className="App" >
          <LeftNav dbx={this.dbx}/>
          <div className={"bigBox"}>
          <Header search_FOLDERS_FILES={this.search_FOLDERS_FILES} path={this.props.match.params.path}/>
          <main>
            <Folders dbx={this.dbx} files={files} renameFiles={this.renameFiles} updateFileName={this.updateFileName}
            renameFolders={this.renameFolders} updateFolderName={this.updateFolderName} folders={folders} onDelete={this.onDelete}/>
            <RightNav path={this.props.match.params.path} files={files} folders={folders} dbx={this.dbx} setFileState={this.setFileState} setFolderState={this.setFolderState} />
          </main>
        </div>
    </div>
      )
    }
  }

export default Main
