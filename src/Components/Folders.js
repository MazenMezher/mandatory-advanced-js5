import React, { Component } from 'react'
import DropdownOptions from "./DropdownOptions"
import {Link} from 'react-router-dom'
import folderImg from '../Img/folder-img.png';
import fileImg from '../Img/file-img.png'

class Folders extends Component {
  constructor(props){
    super(props)
    this.state = {
      URL: null,
      starArray: [],
      starArrayFolders: [],
      folderRename: '',
      fileRename: '',
    }
  }

  // denna funktionen laddar ner filer
  downloadFile = (file) => {
    this.props.dbx.filesDownload({path: file})
    .then(res => {
      console.log(res)
      let objURL = window.URL.createObjectURL(res.fileBlob);
      this.setState({ URL: objURL });
    });
  }

  // denna funktion har koppling med rename, de vi skriver vi sparar de i state
  updateFolderName = e => {
    this.setState({ folderRename: e.target.value });
  }

  // denna funktion har koppling med rename, de vi skriver vi sparar de i state
  updateFileName = e => {
    this.setState({ fileRename: e.target.value });
  }

  // tar bort filer och stänger delete window
  onDelete = (path_delete, tag) =>{
    if(tag === 'folder'){
    const{folders} = this.props
    this.props.dbx.filesDelete({path: path_delete})
    .then(response =>{
      let favoritesFolders = JSON.parse(localStorage.getItem('favoritesFolders'));
      let newFavouriteFolders = favoritesFolders.filter( favouriteFolder => favouriteFolder.id !== response.id)
      localStorage.setItem('favoritesFolders', JSON.stringify(newFavouriteFolders))
      let newFolder = folders.filter( folder => folder.name !== response.name)
      this.props.setFolderState(newFolder)
      this.setState({starArrayFolders: newFavouriteFolders})
    })
  } else {
    const{files} = this.props
    let newfavoritesFiles
    this.props.dbx.filesDelete({path: path_delete})
    .then(response =>{
      let newFiles = files.filter( files => {
        if (files['.tag'] === 'failure') {
          return null;
        }
        else {
          let favoritesFiles = JSON.parse(localStorage.getItem('favorites'));
          newfavoritesFiles = favoritesFiles.filter( favoritesFile => favoritesFile.metadata.id !== response.id)
          localStorage.setItem('favorites', JSON.stringify(newfavoritesFiles))
          return files.metadata.name !== response.name;
        }
      })
      this.props.setFileState(newFiles)
      this.setState({starArray: newfavoritesFiles})
    })
  }
  }

  // funktionen renama för foldern
  renameFolders = (path, id) => {
    const newName = this.state.folderRename;
    let newfavoritesFolders = []
    let newPath = path.split('/')
    newPath[newPath.length-1] = newName
    newPath = newPath.filter(path => path !== "")
    newPath = newPath.reduce((acc,currentpath) => (acc + `/${currentpath}`),"")
    this.props.dbx.filesMoveV2({
      from_path: path,
      to_path: newPath,
    })
    .then(res => {
      let favoritesFolders = JSON.parse(localStorage.getItem('favoritesFolders') || "[]");
      newfavoritesFolders = favoritesFolders.map(favoritesFolder => favoritesFolder.id === res.metadata.id ? {...favoritesFolder, ...res.metadata} : favoritesFolder)
      window.localStorage.setItem('favoritesFolders', JSON.stringify(newfavoritesFolders))
      const newFolders = [...this.props.folders];
      const idx = newFolders.findIndex(x => x.id === id);
      newFolders[idx] = res.metadata;

      this.props.setFolderState(newFolders)
      this.setState({starArrayFolders: newfavoritesFolders})
    })
  }

  // funktionen renama för files
  renameFiles = (path, id) => {
    const newName = this.state.fileRename;
    let newfavoritesFiles = []
    let fileType = path.split(".")
    fileType = fileType[fileType.length-1]
    let newPath = path.split('/')
    newPath[newPath.length-1] = newName
    newPath = newPath.filter(path => path !== "")
    newPath = newPath.reduce((acc,currentpath) => (acc + `/${currentpath}`),"") + "." + fileType

    this.props.dbx.filesMoveV2({
      from_path: path,
      to_path: newPath,
    })
    .then(res => {
      const newFiles = [...this.props.files];
      const idx = newFiles.findIndex(x => {
        if (x['.tag'] === 'failure') {
          return null
        }
        else {
          let favoritesFiles = JSON.parse(localStorage.getItem('favorites'));
          if(favoritesFiles !== null){
          newfavoritesFiles = favoritesFiles.map(favoritesFile => favoritesFile.metadata.id === res.metadata.id ? {...favoritesFile, ...res} : favoritesFile)
          window.localStorage.setItem('favorites', JSON.stringify(newfavoritesFiles))
        }
          return x.metadata.id === id;
        }
      })
      newFiles[idx] = res.metadata;

      this.props.setFileState(newFiles);
      this.setState({starArray: newfavoritesFiles})
    })
  }

  // funktionen sparar alla markerade filer med stjärna i localStorage
  starFile = (file) => {
    let newStarArray;
    const { starArray } = this.state;
    console.log("file", file)
    if(starArray.find(x => x.metadata.id === file.metadata.id)) {
      newStarArray = starArray.filter(x => x.metadata.id !== file.metadata.id)
    }else {
      newStarArray = [...this.state.starArray, file];
    }

    let favorites = JSON.parse(localStorage.getItem('favorites'));
    localStorage.setItem('favorites', JSON.stringify(newStarArray));
      this.setState({
        starArray: newStarArray
      })
}

// funktionen sparar alla markerade folders med stjärna i localStorage
  starFolder = (folder) => {
    let newstarArrayFolders;
    const { starArrayFolders } = this.state;

    if(starArrayFolders.find(y => y.id === folder.id)) {
      newstarArrayFolders = starArrayFolders.filter(y => y.id !== folder.id)
    }else {
      newstarArrayFolders = [...this.state.starArrayFolders, folder];
    }

    let favoritesFolders = JSON.parse(localStorage.getItem('favoritesFolders'));
    localStorage.setItem('favoritesFolders', JSON.stringify(newstarArrayFolders));
      this.setState({
        starArrayFolders: newstarArrayFolders
      })
  }

  // ifall de finns något i localStorage så sparar vi de i state --> starArray och starArrayFolders!
  componentDidMount() {
  this.setState({
    starArray: JSON.parse(window.localStorage.getItem("favorites") || "[]"),
    starArrayFolders: JSON.parse(window.localStorage.getItem("favoritesFolders") || "[]"),
  });
}

  // här renderar vi ut alla våra filer och folders, samt favorit filer och favorit folders!
  render() {
      const{ files, folders } = this.props
      const{ URL } = this.state

      // denna variabel renderar ut våra filer!
      let minaFiler = files.map(file => {
          let image = `data:image/jpeg;base64,${file.thumbnail}`;
          let fileName
          let date_input
          let datum
          let size
          let newSize
          let i
          let id
          let path
          let starredFiles = []

          if(file[".tag"] === "failure"){
            return null
          }
          else {
            if (file.metadata) {
              starredFiles = this.state.starArray
              .find(x => file[".tag"] !== "failure" ?  x.metadata.id === file.metadata.id : null)

              fileName = file.metadata.name;
              date_input = new Date((file.metadata.client_modified));
              datum = new Date(date_input).toDateString();

              size = file.metadata.size;
              i = Math.floor(Math.log(size) / Math.log(1024));
              newSize = (size / Math.pow(1024, i)).toFixed(2) * 1 + ""+['B', 'kB', 'MB', 'GB', 'TB'][i];

              id = file.metadata.id;
              path = file.metadata.path_display;
            }
            else {
              starredFiles = this.state.starArray
              .find(x => file[".tag"] !== "failure" ?  x.id === file.metadata.id : null)

              fileName = file.name;
              date_input = new Date((file.client_modified));
              datum = new Date(date_input).toDateString();

              size = file.size;
              i = Math.floor(Math.log(size) / Math.log(1024));
              newSize = (size / Math.pow(1024, i)).toFixed(2) * 1 + ""+['B', 'kB', 'MB', 'GB', 'TB'][i];

              id = file.id;
              path = file.path_display;
            }
          }

          return (
            <tr>
              <td>
              <div style={{ display: 'flex' }}>
                <img src={file.thumbnail !== null ? image : fileImg } style={{ height: '42px', width: '42px' }} alt=""/>
                <a onClick={() => this.downloadFile(path)} href={URL} download={fileName}>{fileName}</a>

                <span>{" Latest change: " + datum}</span>
                <span>{" Filesize: " + newSize}</span>

                <td className="dropdownList">
                  <DropdownOptions
                    onDelete={this.onDelete}
                    tag={file['.tag']}
                    path={path}
                    name={fileName}
                    id={id}
                    path_display={file.metadata.path_display}
                    updateFileName={this.updateFileName}
                    renameFiles={this.renameFiles}
                    copy={this.props.copy}
                  />
                </td>

              </div>
              <div className="tdInputDivv" style={{display: 'flex'}}>
              <input  checked={!!starredFiles} className="checkboxFiles" type="checkbox"  id={file.id} onClick={this.starFile.bind(this, file)} />
              </div>
              </td>
            </tr>
          )
      })

      // denna variabel renderar ut våra folders!
      let minaFolders = folders.map(folder => {
          // render img icons to folders !
          const type = folder['.tag'];
          let folderThumbnail

          const starredFolders = this.state.starArrayFolders
            .find(x => x.id === folder.id);

          if (type === 'folder') {
            folderThumbnail = folderImg;
          return (
            <tr>
              <td>
              <div style={{ display: 'flex'}}>
              <input checked={!!starredFolders} className="checkbox" type="checkbox"  id={folder.id} onClick={this.starFolder.bind(this, folder)} />
              <img src={folderThumbnail} style={{ height: '42px', width: '42px' }} alt=""/>

              <Link to={`/main${folder.path_display}`}>
                {folder.name}
              </Link>
                  <td className="dropdownList">
                    <DropdownOptions
                      onDelete={this.onDelete}
                      tag={folder['.tag']}
                      path={folder.path_display}
                      name={folder.name}
                      id={folder.id}
                      path_display={folder.path_display}
                      updateFolderName={this.updateFolderName}
                      renameFolders={this.renameFolders}
                      copy={this.props.copy}
                    />
                  </td>
              </div>
              </td>
            </tr>
          )
        }
      })

      // denna variabel renderar ut våra favorit filer!
      let favFiles = this.state.starArray.map(favfile => {
        let image = `data:image/jpeg;base64,${favfile.thumbnail}`;

        let fileName
        let datum
        let date_input
        let size
        let newSize
        let i

        fileName = favfile.metadata.name;
        size = favfile.metadata.size;
        i = Math.floor(Math.log(size) / Math.log(1024));
        newSize = (size / Math.pow(1024, i)).toFixed(2) * 1 + ""+['B', 'kB', 'MB', 'GB', 'TB'][i];
        date_input = new Date((favfile.metadata.client_modified));
        datum = new Date(date_input).toDateString();
          return (
            <tr>
              <td>
                <div style={{ display: 'flex' }}>
                <img src={favfile.thumbnail !== null ? image : fileImg} style={{ height: '42px', width: '42px' }} alt=""/>
                  <a onClick={() => this.downloadFile(favfile.metadata.path_display)} href={this.state.URL} download={favfile.metadata.name} className="favfile" key={favfile.metadata.id}> {favfile.metadata.name} </a>
                  <span>{" Latest change: " + datum}</span>
                  <span>{ " Filesize: " + newSize}</span>
            </div>
            </td>
            </tr>
          )
      });

      // denna variabel renderar ut våra favorit folders!
        let favFolders = this.state.starArrayFolders.map(favfolder => {
          let folderName;
          const type = favfolder['.tag'];
          let folderThumbnail

          if (type === 'folder') {
            folderThumbnail = folderImg;
          folderName = favfolder.name;
            return (
              <tr>
                <td>
                  <div style={{ display: 'flex' }}>
                    <img src={folderThumbnail} style={{ height: '42px', width: '42px' }} alt=""/>
                    <Link to={`/main${favfolder.path_display}`}>
                      {favfolder.name}
                    </Link>
                  </div>
                </td>
              </tr>
              )
            }
          })

          return(
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

              <h2 style={{ marginTop: '10%' }} >Favorite Folders!</h2>
                {favFolders}

              <h2 style={{ marginTop: '10%' }} >Favorite Files!</h2>
                {favFiles}
            </tbody>
            </table>
        </div>
      )
  }
}

export default Folders