import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const Navigate = useNavigate();
  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [phoneNo, setphoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (confirmPassword === password) {
      const data = {
        firstName,
        lastName,
        phoneNo,
        email,
        password,
      };
      await axios
        .post("http://localhost:4000/register", data)
        .then((res) => {
          console.log(res);
          setfirstName("");
          setlastName("");
          setphoneNo("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      window.alert("Password not Match!");
    }
  };
  return (
    <div>
      <h1>Register Here</h1>
      <form action="POST" onSubmit={handleSubmit}>
        <input
          type="text"
          value={firstName}
          name="firstName"
          required
          placeholder="Enter your firstName"
          onChange={(e) => setfirstName(e.target.value)}
        />
        <br />
        <input
          type="text"
          value={lastName}
          name="lastName"
          required
          placeholder="Enter your lastName"
          onChange={(e) => setlastName(e.target.value)}
        />
        <br />
        <input
          type="Number"
          value={phoneNo}
          name="phoneNo"
          required
          placeholder="Enter your phoneNo"
          onChange={(e) => setphoneNo(e.target.value)}
        />
        <br />
        <input
          type="email"
          value={email}
          name="email"
          required
          placeholder="Enter your Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          value={password}
          name="password"
          required
          placeholder="Enter your Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <input
          type="password"
          value={confirmPassword}
          name="confirmPassword"
          required
          placeholder="Re-type your Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <br />
        <button type="submit">Register</button>
        <div>
          Are you already a member?
          <button onClick={() => Navigate("/login")}>Login</button>
        </div>
      </form>
    </div>
  );
};

export default Register;
