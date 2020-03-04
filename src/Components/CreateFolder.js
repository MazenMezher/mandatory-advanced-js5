import React, {PureComponent} from "react";
import ReactDom from 'react-dom'
import ClickedOutsideRemover from './ClickedOutsideRemover'
import  '../Css/filefolder.css'

class CreateFolder extends PureComponent{
  constructor(props){
    super(props)
    this.state = {
      folderName: '',
    }
  }
  onNameChange=(e)=>{
    this.setState({folderName:e.target.value})
  }
  onCreate = () =>{
    this.props.createFolder(this.state.folderName)
    this.props.onCloseCreateFolder()
  }

  onCloseFolderWindow = () =>{
    this.props.onCloseCreateFolder()
  }


  render(){
  const{show} = this.state
  return ReactDom.createPortal(
    <>
    <div className="CreateFolderWindow">
    <p className="question">What's would you like to name the map?</p>
    <hr/>
    <input onChange={this.onNameChange} className="namingMap" type ="text"/>
    <button id="create" className="knapp" onClick={this.onCreate}>
    Create
    </button>
    <button id="cancel" className="knapp" onClick={this.onCloseFolderWindow}>
    Cancel
    </button>
    </div>
    : null}
    </>
    ,document.querySelector('#createFolder')
  )
}
}

export default CreateFolder;
