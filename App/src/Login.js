import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuthorization = async () => {
      try {
        const response = await fetch("http://localhost:3000/auth-check", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (response.status === 200 && isMounted) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Error checking authorization:", error);
      }
    };

    checkAuthorization();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/login", {
        username: formData.username,
        password: formData.password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token);
      setTokenExpiryHandler(token);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      if (error.response && error.response.status === 401) {
        setErrorMessage("Incorrect username or password. Please try again.");
        alert("Incorrect username or password. Please try again.");
      } else {
        setErrorMessage("An error occurred. Please try again later.");
        alert("An error occurred. Please try again later.");
      }
    }
  };

  const setTokenExpiryHandler = (token) => {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiry = payload.exp * 1000 - Date.now();
    setTimeout(() => {
      localStorage.removeItem("token");
      alert("Session expired. Please log in again.");
      navigate("/login");
    }, expiry);
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <img src="/NSFPlogo.png" alt="NSFP logo" />
        <h2>Please enter your credentials</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
