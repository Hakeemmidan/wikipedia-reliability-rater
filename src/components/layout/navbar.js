/*
Author: Michael Torres
Filename: navbar.js
Description: This file is the component for the navbar across the website
             and contains the website name, sign up and sign in links and
             a hamburger menu when size desktop size is under 700 pixels
*/

import React from 'react';
import {Link} from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <nav className="navbar bg-dark">
        <h1>
          <Link to="/">WiRR</Link>
        </h1>
      </nav>
    </div>
  );
};

export default Navbar;
