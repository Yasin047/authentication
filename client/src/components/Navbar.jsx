import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ isLoggedIn, user, logoutUser }) => {
  const Navigate = useNavigate();
  return (
    <div>
      {isLoggedIn ? (
        <button onClick={logoutUser}>Logout</button>
      ) : (
        <>
          <button onClick={() => Navigate("/login")}>Login</button>
          <button onClick={() => Navigate("/register")}>Register</button>
        </>
      )}
    </div>
  );
};

export default Navbar;
