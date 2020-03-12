import React from 'react'
import '../Css/Options.css'
import ReactDom from 'react-dom'

function DeleteWindow({ name, onCloseDeleteWindow, path, tag, onDelete, closeOnDelete }){

  function deleteOnClick( path_display, tag_name ){
    onDelete( path_display, tag_name )
    closeOnDelete()
  }

  return ReactDom.createPortal(
  <div className="darkenOutArea">
  <div className="confirmDeleteWindow">
  <p className="deleteText">Ta bort fil?</p>
  <p className="deleteText">Vill du radera {name}?</p>
  <div className="deleteButton">
  <div className="delete" onClick={()=>deleteOnClick(path,tag)}>Radera</div>
  <div className="delete" onClick={onCloseDeleteWindow}>avbryt</div>
  </div>
  </div>
  </div>,
  document.querySelector('#deletewindow')
  )
}

export default React.memo(DeleteWindow)