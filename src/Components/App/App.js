import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import Routes from "../../Routes";
import { UserContextProvider } from "../../Context/User/context";
import ErrorContextProvider from "../../Context/Error/context";

import "./App.css";

function App() {
  return (
    <div className="App">
      <UserContextProvider>
        <ErrorContextProvider>
          <Router>
            <Routes />
          </Router>
        </ErrorContextProvider>
      </UserContextProvider>
    </div>
  );
}

export default App;
