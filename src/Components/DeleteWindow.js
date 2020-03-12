import React from 'react'
import '../Css/Options.css'
import ReactDom from 'react-dom'

// Renderar ut varningsfönster om man vill radera fil/folder

function DeleteWindow({ name, onCloseDeleteWindow, path, tag, onDelete, closeOnDelete }){

  function deleteOnClick( path_display, tag_name ){
    onDelete( path_display, tag_name )
    closeOnDelete()
  }

  return ReactDom.createPortal(
  <div className="darkenOutArea">
  <div className="confirmDeleteWindow">
  <p className="deleteText">Remove item ?</p>
  <p className="deleteText">Do you want to remove {name}?</p>
  <div className="deleteButton">
  <div className="delete" onClick={()=>deleteOnClick(path,tag)}>Delete</div>
  <div className="delete" onClick={onCloseDeleteWindow}>Cancel</div>
  </div>
  </div>
  </div>,
  document.querySelector('#deletewindow')
  )
}

export default React.memo(DeleteWindow)