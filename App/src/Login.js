import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

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
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
