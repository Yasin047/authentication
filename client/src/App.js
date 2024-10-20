import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import "./App.css";
import Error from "./components/Error";
import FileDownload from "./components/FileDownload";
import FileUpload from "./components/FileUpload";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Login from "./components/Login";
import Protected from "./components/Protected";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import VerifyEmail from "./components/VerifyEmail";

function App() {
  const Navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState("");

  const logoutUser = () => {
    setUser(null);
    setIsLoggedIn(false);
    Navigate("/login");
    localStorage.removeItem("auth_token");
  };

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("auth_token"));
    console.log(token);
    if (token) {
      const decodedToken = jwt_decode(token);
      console.log(decodedToken);
      if (decodedToken.exp * 1000 < Date.now()) {
        setUser(null);
        setIsLoggedIn(null);
        localStorage.removeItem("auth_token");
        Navigate("/login");
      } else {
        setUser(decodedToken);
        setIsLoggedIn(true);
      }
    }
  }, [Navigate]);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={
            <Home isLoggedIn={isLoggedIn} user={user} logoutUser={logoutUser} />
          }
        />
        <Route
          path="/login"
          element={<Login setIsLoggedIn={setIsLoggedIn} setUser={setUser} />}
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/protected"
          element={user ? <Protected /> : <Navigate to="/" />}
        />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
        <Route path="/fileupload" element={<FileUpload />} />
        <Route path="/filedownload" element={<FileDownload />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </div>
  );
}

export default App;
