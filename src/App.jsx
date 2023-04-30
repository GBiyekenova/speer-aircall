import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import Header from "./Header.jsx";
import ActivityFeed from "./ActivityFeed.jsx";
import Footer from "./Footer.jsx";

const baseURL = "https://cerulean-marlin-wig.cyclic.app/";

const App = () => {
  return (
    <div className="container">
      <Header />
      {/* <ActivityFeed /> */}
      <div className="container-view">
        <ActivityFeed />
        <Footer />
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));

export default App;
