import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const VerifyEmail = () => {
  const token = useLocation()
    .search.slice(0, useLocation().search.length)
    .split("=")
    .pop();
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:4000/verifyemail?token=${token}`)
        .then((res) => {
          setVerified(true);
        })
        .catch((error) => {
          console.log(error);
          setError(true);
        });
    }
  }, [token]);

  if (!token) {
    return <p>Token not Found!</p>;
  }
  return (
    <div>
      <h1>
        {verified && !error
          ? "You are verified"
          : error
          ? error
          : "Verifying please wait..."}
      </h1>
    </div>
  );
};

export default VerifyEmail;
