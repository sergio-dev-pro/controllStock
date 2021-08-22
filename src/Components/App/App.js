import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "../../Routes";
import { UserContextProvider } from "../../Context/User/context";

import "./App.css";

function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <Router>
          <Routes />
        </Router>
      </UserContextProvider>
    </div>
  );
}

export default App;
