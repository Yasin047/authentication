import React from "react";
import Navbar from "./Navbar";

const Home = ({ isLoggedIn, user, logoutUser }) => {
  return (
    <div>
      <h1>Welcome To Home Page</h1>
      <Navbar isLoggedIn={isLoggedIn} user={user} logoutUser={logoutUser} />
    </div>
  );
};

export default Home;
