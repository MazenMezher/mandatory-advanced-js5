import React, { Component } from 'react'
import { Dropbox } from "dropbox";
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
          starArray: [],

          changes: false,
          searchQuery: ""
        }
        this.renameRef = React.createRef();
    }

    // vi skickar den som props till Folders.js som sedan hämtar data och vi sparar den data här i state
    setFolderState = (newFolder) =>{
      this.setState({folder: newFolder})
    }

    // vi skickar den som props till Folders.js som sedan hämtar data och vi sparar den data här i state
    setFileState = (newFile) =>{
      this.setState({file: newFile})
    }

    // funktionen kopierar filer och folders!
    copy = (original_path, your_path) =>{
      let real_path = original_path.split('/')
      real_path = `/${real_path[real_path.length-1]}`
      console.log(your_path)
      console.log(real_path)
      this.dbx.filesCopy({
        from_path: original_path,
        to_path: `${your_path}${real_path}`,
        autorename: true,
      })
    }

    // Den renderar ut våra filer och folders
    componentDidMount() {
      this.setState({
        starArray: JSON.parse(window.localStorage.getItem("favorites") || "[]")
      });

      this.dbx = new Dropbox({ accessToken: localStorage.getItem("token") });
      let path = ""

      if(this.props.match.params.path){
        path = `/${this.props.match.params.path}`
      }

      this.dbx.filesListFolder({ path: path })
      .then((resFolder) => {
        this.dbx.filesListFolderLongpoll({cursor: resFolder.cursor})
        .then(response => {
          this.setState({changes: response.changes})
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

    // den renderar våra filer och folders. Om vår url, dropbox innehåll och search funktion ändras
    componentDidUpdate(prevProps, prevState) {
      if (this.state.changes || this.props.match.params.path !== prevProps.match.params.path || (this.state.searchQuery === "" && (prevState.searchQuery !== this.state.searchQuery))) {

        let path = ""
        if(this.props.match.params.path){
          path = `/${this.props.match.params.path}`
        }
        this.dbx.filesListFolder({ path: path })
        .then((resFolder) => {

          this.dbx.filesListFolderLongpoll({cursor: resFolder.cursor})
          .then(response => this.setState({changes: response.changes}))

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
            this.setState({ files: files, folders: resFolder.entries, changes:false });
          })
        })
    }
  }

  // denna funktionen gör så att när vi har sökt något så renderar den ut de vi har sökt, beroende om de är filer eller folders
  search_FOLDERS_FILES = (e) => {
    let resFolder;

    this.setState({ searchQuery: e.target.value });

    if (e.target.value.length === 0) {
      return;
    }

    this.dbx.filesSearch({ path: '' , query: e.target.value})
    .then(res => {

      resFolder = res;
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
        const files = resFolder.matches
        .filter(x => x.metadata[".tag"] !== "folder")
        .map(x => {
          const th = res.entries.find(y => y.metadata && y.metadata.id === x.metadata.id);

          return {
            metadata: x.metadata,
            ".tag": "success",
            thumbnail: th ? th.thumbnail : null,
          }
        });
        this.setState({ files: files });
      });
  }

  // här visas allt innehåll på sidan
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
