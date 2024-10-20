import axios from "axios";
import jwt_decode from "jwt-decode";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn, setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      email,
      password,
    };
    axios
      .post("http://localhost:4000/login", data)
      .then((res) => {
        console.log(res);
        setEmail("");
        setPassword("");
        const token = res.data.token;
        localStorage.setItem("auth_token", JSON.stringify(token));
        const decodedToken = jwt_decode(token);
        setUser(decodedToken);
        setIsLoggedIn(true);
        window.alert("Successfully Logged In!");
        Navigate("/protected");
      })
      .catch((error) => {
        console.log(error);
        window.alert("Invalid Credentials!");
        Navigate("/login");
      });
  };
  return (
    <div>
      <h1>Login Here</h1>
      <form action="POST" onSubmit={handleSubmit}>
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
        <button type="submit">Login</button>
      </form>
      <br />
      <div>
        Forgot Password?
        <button onClick={() => Navigate("/forgotpassword")}>Click Here</button>
      </div>
      <br />
      <div>
        Are you not a member?
        <button onClick={() => Navigate("/register")}>Click Here</button>
      </div>
    </div>
  );
};

export default Login;
