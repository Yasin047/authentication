import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const token = useLocation()
    .search.slice(0, useLocation().search.length)
    .split("=")
    .pop();
  const Navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isTokenVerified, setIsTokenVerified] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:4000/verifytoken?token=${token}`)
      .then((res) => {
        console.log(res);
        setIsTokenVerified(true);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  }, [token]);

  if (!token && error) {
    return <p>Token not Found!</p>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email } = jwt_decode(token);
    axios
      .post("http://localhost:4000/resetpassword", {
        email,
        newPassword,
        confirmNewPassword,
      })
      .then((res) => {
        console.log(res);
        setNewPassword("");
        setConfirmNewPassword("");
        Navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      {isTokenVerified ? (
        <>
          <h1>Reset Password</h1>
          <form action="POST" onSubmit={handleSubmit}>
            <input
              type="newPassword"
              value={newPassword}
              name="newPassword"
              required
              placeholder="Enter your New Password"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <br />
            <input
              type="confirmNewPassword"
              value={confirmNewPassword}
              name="confirmNewPassword"
              required
              placeholder="Enter your Confirm New Password"
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <br />
            <button type="submit">RESET PASSWORD</button>
          </form>
        </>
      ) : (
        "Token is verifying please wait..."
      )}
    </div>
  );
};

export default ResetPassword;
