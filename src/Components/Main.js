import React, { Component } from 'react'
import { Dropbox } from "dropbox";
import LogOut from './LogOut'
import LeftNav from "./LeftNav"
import Folders from "./Folders"
import RightNav from "./RightNav"
import Header from './Header'
import {Redirect} from 'react-router-dom'

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

          changes: false,

          starArray: [],

        }
        this.renameRef = React.createRef();
    }
    setFolderState = (newFolder) =>{
      this.setState({folder: newFolder})
    }
    setFileState = (newFile) =>{
      this.setState({file: newFile})
    }



    copy = (original_path, your_path) =>{
     
      this.dbx.filesCopy({
        from_path: original_path,
        to_path: your_path,
        autorename: true,
      })
    }

    componentDidMount() {
      this.setState({
        starArray: JSON.parse(window.localStorage.getItem("favorites") || "[]")
      });
        let log = JSON.parse(window.localStorage.getItem("favorites"));

      this.dbx = new Dropbox({ accessToken: localStorage.getItem("token") });
      let path = ""

      if(this.props.match.params.path){
        path = `/${this.props.match.params.path}`
      }
      this.dbx.filesListFolder({ path: path })
      .then((resFolder) => {
        console.log(resFolder)
        this.dbx.filesListFolderLongpoll({cursor: resFolder.cursor})
        .then(response => {
          console.log('lol')
          this.setState({changes: true})

        })

        const entries = resFolder.entries
          .filter(x => x[".tag"] === "file")
          .map((x) => ({ path: x.path_display }));
        return this.dbx.filesGetThumbnailBatch({
          entries: entries,
        })
        .then((res) => {
          const files = resFolder.entries
            .filter(x => x[".tag"] !== "folder")
            .map(x => {
              const th = res.entries.find(y => y.metadata && y.metadata.id === x.id);

              return {
                metadata: x,
                ".tag": "success",
                thumbnail: th ? th.thumbnail : null,
              }
            });

          this.setState({ files: files, folders: resFolder.entries});
        })
      })

    }

    componentDidUpdate(prevProps, prevState) {
      if (this.state.changes || this.props.match.params.path !== prevProps.match.params.path) {
        console.log('lol')

        let path = ""
        if(this.props.match.params.path){
          path = `/${this.props.match.params.path}`
        }
        this.dbx.filesListFolder({ path: path })
        .then((resFolder) => {

          this.dbx.filesListFolderLongpoll({cursor: resFolder.cursor})
          .then(response => this.setState({changes: true}))

          const entries = resFolder.entries
            .filter(x => x[".tag"] === "file")
            .map((x) => ({ path: x.path_display }));
          return this.dbx.filesGetThumbnailBatch({
            entries: entries,
          })
          .then((res) => {
            const files = res.entries;
            this.setState({ files: files, folders: resFolder.entries, changes:false });
          })
        })
  }

  }

  search_FOLDERS_FILES = (e) => {
    let search
    
    this.dbx.filesSearch({ path: '' , query: "/"})
    .then(res => {
      console.log(res)
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



    render() {


      const { folders, files } = this.state;

        return (
          <div className="App" >

          <LeftNav dbx={this.dbx}/>
        <div className={"bigBox"}>
          <Header search_FOLDERS_FILES={this.search_FOLDERS_FILES} path={this.props.match.params.path}/>
          <main>
            <Folders dbx={this.dbx} files={files} renameFiles={this.renameFiles} updateFileName={this.updateFileName} copy={this.copy}
            renameFolders={this.renameFolders} updateFolderName={this.updateFolderName} folders={folders} onDelete={this.onDelete}  setFileState={this.setFileState} setFolderState={this.setFolderState}/>
            <RightNav path={this.props.match.params.path} files={files} folders={folders} dbx={this.dbx} setFileState={this.setFileState} setFolderState={this.setFolderState} />
          </main>
        </div>
    </div>
      )
    }
  }

export default Main
