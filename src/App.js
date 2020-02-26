import React from "react";

import { BrowserRouter as Router, Route } from 'react-router-dom';

import "./Css/nav.css";

import Main from "./Components/Main";

function App() {
  return (

    <div className="App">
        <div className="sideLeft">
          <div>
            Logo
          </div>
          <ul>
            <li> Link 1 </li>
            <li> Link 7 </li>
            <li> Link 1ewrwerwer </li>
            <li> Link 1 test rest </li>
          </ul>
        </div>

        <div className={"bigBox"}>
          <header>
            <input placeholder="Search" type="text" />
            <button>Log out</button>
          </header>

          <main>
            <Main />
          </main>
        </div>

    <div clasclassName="App">
      <Router>
        <Route path="/main" component={Main} />
      </Router>

    </div>
  );
}

export default App;
