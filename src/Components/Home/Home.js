import React from "react";

import Apod from "./Apod/Apod";
import "./Home.css";

const Home = () => {
  return (
    <>
      <h1 className="welcome-title">Welcome to the NASA APIS page</h1>
      <Apod />
    </>
  );
};

export default Home;
