import React from "react";

import { NavLink } from "react-router-dom";

import "./Navbar.css";

const Navbar = () => {
  return (
    <nav className="navbar">
      <NavLink exact to="/" activeClassName="active" className="navbar-link">
        Home
      </NavLink>
      <NavLink to="/eonet" activeClassName="active" className="navbar-link">
        Eonet
      </NavLink>
    </nav>
  );
};

export default Navbar;
