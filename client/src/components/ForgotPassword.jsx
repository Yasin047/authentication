import axios from "axios";
import React, { useState } from "react";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      return window.alert("Please provide a valid Email!");
    }
    axios
      .post("http://localhost:4000/forgotpassword", { email })
      .then((res) => {
        console.log(res.data);
        setEmail("");
        window.alert("Check your Email");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <h1>Forgot Password</h1>
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
        <button type="submit">ENTER</button>
      </form>
    </div>
  );
};

export default ForgotPassword;
