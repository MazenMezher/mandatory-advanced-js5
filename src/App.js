import React from "react";


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
            <li> Link 20 </li>
            <li> Link 7 </li>
            <li> Link 3 </li>
            <li> Link 1 </li>
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
    </div>
  );
}

export default App;
