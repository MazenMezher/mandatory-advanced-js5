import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';

import "./Css/nav.css";

import Main from "./Components/Main";
import LogIn from "./Components/LogIn";
import GetToken from "./Components/GetToken";

function App() {
  return (
    <div className="App">
      <Router basename={process.env.PUBLIC_URL}>
        <Route exact path="mandatory-advanced-js5/" component={LogIn} />
        <Route path="/mandatory-advanced-js5/auth" component={GetToken} />
        <Route exact path="/mandatory-advanced-js5/main" component={Main} />
        <Route exact path="/mandatory-advanced-js5/main/:path+" component={Main} />
      </Router>
    </div>
  );
}

export default App;