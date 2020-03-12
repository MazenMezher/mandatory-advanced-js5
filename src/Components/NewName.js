import React from 'react'
import ReactDom from 'react-dom'

import '../Css/Options.css'

// Denna komponenten renderar ut ett fönster som tillåter oss att döpa om filer/folder
function NewName({ update, closeRename, hideRename }){
  return ReactDom.createPortal(
    <div className="renameWindow">
      <p>Do you want to rename this?</p>
      <input className="tdInput" type="text" onChange={update}/>
      <br/>
      <div className="renameButtons">
        <button className="tdButton" onClick={closeRename}>Rename</button>
        <button className="tdButton" onClick={hideRename}>Cancel</button>
      </div>
    </div>
    , 
    document.querySelector('#renameWindow')
)}

export default NewName