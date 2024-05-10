import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://rotaractsfsu.online:3000/login",
        formData
      );
      localStorage.setItem("token", response.data.token);
      navigate("/main-page");
    } catch (error) {
      console.error("Error logging in:", error);
      // Handle login error, e.g., display error message to the user
    }
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <img src="/NSFPlogo.png" alt="Rotaract at SFSU Logo" />
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
          <button type="submit" onClick={goToDashboard}>Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
