import React, { PureComponent } from 'react'
import '../Css/filefolder.css'
import folderImg from '../Img/folder-img.png';

// Den renderar alla folder som man kan kopiera till 
class CopyFolderList extends PureComponent{
  constructor(props){
    super(props)
  }

  clickAnotherFolderV2 = () =>{
    this.props.clickAnotherFolder(this.props.folder.path_display)
  }

  render(){
  const{folder} = this.props
  return(
      <>
      <li className="listOfFolders" key={folder.id} onClick={this.clickAnotherFolderV2}>
        <img src={folderImg} style={{ height: '42px', width: '42px', marginBottom:'-10px' }} alt=""/>{folder.name}
      </li>
      </>
    )
  }
}

export default CopyFolderList