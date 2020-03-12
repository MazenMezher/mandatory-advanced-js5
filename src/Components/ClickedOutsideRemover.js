import React, { PureComponent } from 'react'
import '../Css/Options.css'

// Hela den komponenten gör bara så att när man klickar utanför dropdown så försvinner dropdown
class ClickedOutsideRemover extends PureComponent{
  constructor(props){
    super(props)
    this.wrapper = React.createRef()
    this.state = {
      show: false
    }
  }

  componentDidMount(){
    document.addEventListener('click', this.HandleOnClickOutsideOfElement)
  }

  componentWillUnmount(){
    document.addEventListener('click', this.HandleOnClickOutsideOfElement)
  }

  HandleOnClickOutsideOfElement = (e) =>{
    if(this.wrapper.current === e.target){
      this.setState({show: !this.state.show})
    }else{
      this.setState({show: false})
    }
  }

  render(){
    const{show} = this.state;

  return(
    <>
      <div className="dropMenu" ref={this.wrapper}>{show ? this.props.children : null}</div>
    </>
  )}
}

export default ClickedOutsideRemover