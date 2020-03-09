import React, { Component } from 'react'
import DropdownOptions from "./DropdownOptions"
import {Link} from 'react-router-dom'
import folderImg from '../Img/folder-img.png';

class Folders extends Component {
  constructor(props){
    super(props)
    this.state = {
      URL: null,
      starArray: [],
      starArrayFolders: [],
    }
  }
  
downloadFile = (file) => {
     this.props.dbx.filesGetThumbnail({"path": file})
      .then(res => {
        console.log(file)
        let objURL = window.URL.createObjectURL(res.fileBlob);
        this.setState({ URL: objURL });
      });
  }

starFile = (file) => {
    let newStarArray;
    const { starArray } = this.state;
    
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

componentDidMount() {
  this.setState({
    starArray: JSON.parse(window.localStorage.getItem("favorites") || "[]"),
    starArrayFolders: JSON.parse(window.localStorage.getItem("favoritesFolders") || "[]"),
  });  
}
    render() {
        const{files,folders,onDelete} = this.props
        const{URL} = this.state

        console.log(this.state.starArrayFolders);

        let minaFiler = files.map(file => {
            let image = `data:image/jpeg;base64,${file.thumbnail}`;
            let fileName
            let date_input
            let datum
            let size
            let newSize
            let i
            
            const starredFiles = this.state.starArray
            .find(x => file[".tag"] !== "failure" ?  x.metadata.id === file.metadata.id : null)
            
            if(file[".tag"] === "failure"){
              return null
            }
            else {
              fileName = file.metadata.name;
              date_input = new Date((file.metadata.client_modified));
              datum = new Date(date_input).toDateString();
              size = file.metadata.size;
              i = Math.floor(Math.log(size) / Math.log(1024));
              newSize = (size / Math.pow(1024, i)).toFixed(2) * 1 + ""+['B', 'kB', 'MB', 'GB', 'TB'][i];
            }
            return (
              <tr>
                <td>
                <div style={{ display: 'flex' }}>
                  <img src={image} style={{ height: '42px', width: '42px' }} alt=""/>
                  <a onClick={() => this.downloadFile(file.metadata.path_display)} href={URL} download={fileName}>{fileName}</a>
                  <span>{" Latest change: " + datum}</span>
                  <span>{" Filesize: " + newSize}</span>
                  {/* <input className="checkboxFiles" type="checkbox"  id={file.id} onClick={this.starFile.bind(this, file)} /> */}
                  {/* <input className="tdInput" type="text" onChange={this.props.updateFileName}/> */}
                  {/* <button className="tdButton" onClick={() => this.props.renameFiles(file.metadata.path_display, file.metadata.id)}>Rename</button> */}
                  <td className="dropdownList">
                    <DropdownOptions
                      onDelete={onDelete}
                      tag={file['.tag']}
                      path={file.metadata.path_display}
                      name={file.metadata.name}
                      id={file.metadata.id}
                      updateFileName={this.props.updateFileName}
                      renameFiles={this.props.renameFiles}
                    />
                  </td>
                </div>
                <div className="tdInputDiv" style={{display: 'flex'}}>
                <input className="tdInput" type="text" onChange={this.props.updateFileName}/>
                <button className="tdButton" onClick={() => this.props.renameFiles(file.metadata.path_display, file.metadata.id)}>Rename</button>
                <input  checked={!!starredFiles} className="checkboxFiles" type="checkbox"  id={file.id} onClick={this.starFile.bind(this, file)} />
                </div>
                </td>
              </tr>
            )
          })
        let minaFolders = folders.map(folder => {
            // render img icons to folders !
            const type = folder['.tag'];
            let folderThumbnail

            const starredFolders = this.state.starArrayFolders
              .find(x => x.id === folder.id);

            console.log("HEJ", starredFolders, folder, this.state.starArrayFolders);

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
                        onDelete={onDelete}
                        tag={folder['.tag']}
                        path={folder.path_display}
                        name={folder.name}
                        id={folder.id}
                        updateFolderName={this.props.updateFolderName}
                        renameFolders={this.props.renameFolders}
                      />
                    </td>
                </div>
                <div className="tdInputDiv" style={{display: 'flex'}}>
                    <input checked={!!starredFolders} className="checkbox" type="checkbox"  id={folder.id} onClick={this.starFolder.bind(this, folder)} />
                    </div>
                </td>
              </tr>
            )
          }
          }) 
      let favFiles = this.state.starArray.map(favfile => {
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
        let image = `data:image/jpeg;base64,${favfile.thumbnail}`;
          return (
            <tr>
              <td>
                <div style={{ display: 'flex' }}>
                  <img src={image} style={{ height: '42px', width: '42px' }} alt=""/>
                  <a onClick={() => this.downloadFile(favfile.path_display)} href={this.state.URL} download={fileName} className="favfile" key={favfile.metadata.id}> <br /> {favfile.metadata.name} {" Latest change: " + datum} { " Filesize: " + newSize} </a>
            </div>
            </td>
            </tr>
          )
        });
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
                  <a onClick={() => this.downloadFile(favfolder.path_display)} href={this.state.URL} download={folderName} className="favfile" key={favfolder.id}> <br /> {favfolder.name} </a>
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