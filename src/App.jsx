import React, { createContext, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import Header from "./Header.jsx";
import ActivityFeed from "./ActivityFeed.jsx";
import Footer from "./Footer.jsx";

export const baseURL = "https://charming-bat-singlet.cyclic.app/https://cerulean-marlin-wig.cyclic.app/";

export const GeneralContext = createContext();

export const INBOUND_UNARCHIVED = ["inbound", false];
export const ALL_UNARCHIVED = ["all", false];
export const ALL_ARCHIVED = ["archived", true];



const App = () => {

  const [callType, setCallType] = useState(INBOUND_UNARCHIVED)
  const [callCount, setCallCount] = useState(0)
  
  return (
    <GeneralContext.Provider value={{callType, setCallType, callCount, setCallCount}}>
    <div className="container">
      <Header />
      <div className="container-view">
        <ActivityFeed />
        <Footer />
      </div>
    </div>
    </GeneralContext.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
