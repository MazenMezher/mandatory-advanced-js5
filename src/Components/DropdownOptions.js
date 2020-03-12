import React, { PureComponent } from 'react'
import ClickedOutsideRemover from './ClickedOutsideRemover'
import DeleteWindow from './DeleteWindow'
import NewName from './NewName'
import CopyWindow from './CopyWindow'
import MoveWindow from './MoveWindow'

import '../Css/Options.css'

// Denna component gör så att när jag klickar på sakerna som finns inne i de tre punkterna så kommer fram några options!
// Klickar man på en av dessa options så ändras boolean som finns i this.state till true och då skickar vi props till de andra komponenter!

class DropdownOptions extends PureComponent{
  constructor(props){
    super(props)
    this.state = {
      deleteButtonClicked: false,
      reNameButtonClicked: false,
      copyButtonClicked:false,
      moveButtonClicked:false,
    }
  }

  // Visar fönstret som frågar ifall användaren vill ta bort
  onDeleteButtonClicked = () =>{
    this.setState({deleteButtonClicked: true})
  }

  // Stänger delete fönstret om användaren klickar på avbryt
  onCloseDeleteWindow = () =>{
    this.setState({deleteButtonClicked: false})
  }

  closeOnDelete = () =>{
    this.setState({deleteButtonClicked: false})
  }

  showRename = () =>{
    this.setState({reNameButtonClicked: true})
  }

  closeRenameFolder = () =>{
    this.props.renameFolders(this.props.path,this.props.id)
    this.setState({reNameButtonClicked: false})
  }

  closeRenameFiles = () =>{
    this.props.renameFiles(this.props.path,this.props.id)
    this.setState({reNameButtonClicked: false})
  }

  hideRename = () =>{
    this.setState({reNameButtonClicked: false})
  }

  openCopyWindow = () =>{
    this.setState({copyButtonClicked: true})
  }

  makeCopyInSameFolder = () =>{
    this.props.copy(this.props.path_display)
  }

  closeCopyWindow = () =>{
    this.setState({copyButtonClicked:false})
  }

  openMoveWindow = () =>{
    this.setState({moveButtonClicked: true})
  }

  closeMoveWindow = () =>{
    this.setState({moveButtonClicked: false})
  }

  render(){
  const{ onDelete, path, name, id, renameFolders, renameFiles, tag, updateFolderName, updateFileName, copy, path_display } = this.props
  const{ deleteButtonClicked, reNameButtonClicked, copyButtonClicked, moveButtonClicked } = this.state

  return(
  <>
    <div className="dropdown">
    <span>...</span>
    <ClickedOutsideRemover>
      <div className="dropdown-content">
      <div className="dropdown-list" onClick={this.onDeleteButtonClicked}>delete</div>
      <div className="dropdown-list" onClick={this.showRename}>rename</div>
      <div className="dropdown-list" onClick={this.openCopyWindow}>copy</div>
      <div className="dropdown-list" onClick={this.openMoveWindow}>move</div>
      </div>

    </ClickedOutsideRemover>
    {deleteButtonClicked ?
    <DeleteWindow onCloseDeleteWindow={this.onCloseDeleteWindow} closeOnDelete={this.closeOnDelete} tag={tag} path={path} onDelete={onDelete} name={name}/>
    : null}
    {reNameButtonClicked ? <NewName
      rename={tag === 'folder' ? renameFolders : renameFiles} update={tag === 'folder' ? updateFolderName : updateFileName}
      closeRename={tag === 'folder' ? this.closeRenameFolder : this.closeRenameFiles}
      hideRename = {this.hideRename}
      />

    : null}
    {copyButtonClicked ?
      <CopyWindow closeCopyWindow={this.closeCopyWindow} makeCopyInSameFolder={this.makeCopyInSameFolder} copy={copy} path_display={path_display}/>
      : null}
    {moveButtonClicked ? <MoveWindow closeMoveWindow={this.closeMoveWindow} path_display={path_display}/>:null}
    </div>
  </>
)}}

export default DropdownOptions