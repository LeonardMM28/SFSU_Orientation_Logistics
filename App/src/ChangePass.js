import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./ChangePass.css";

function ChangePass() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
        if (response.status === 401 && isMounted) {
          // Invalid or expired token, show unauthorized message and delete session
          alert("Your session has expired, please log in again.");

          const token = localStorage.getItem("token");
          if (token) {
            localStorage.removeItem("token");
            await axios.post("http://localhost:3000/logout", null, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }

          navigate("/");
        } else if (response.status === 200 && isMounted) {
          setIsAuthorized(true);
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

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  const { oldPassword, newPassword, confirmPassword } = formData;

  if (newPassword !== confirmPassword) {
    setErrorMessage("Passwords do not match!");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      "http://localhost:3000/changePassword",
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.status === 200) {
      alert("Password changed successfully!");
      navigate("/");
    }
  } catch (error) {
    console.error("Error changing password:", error);
    if (error.response && error.response.status === 401) {
      setErrorMessage("Unauthorized. Please log in again.");
    } else {
      setErrorMessage(
        "An error occurred while changing the password. Please try again."
      );
    }
  }
};


  const goBack = () => {
    navigate("/dashboard");
  };

  if (!isAuthorized) {
    return null; // Render a loading state while authorization check is in progress
  }

  return (
    <div className="change-pass-page">
      <FiArrowLeftCircle onClick={goBack} className="back-icon" />
      <div className="change-pass-form-container">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="oldPassword">Old Password:</label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              value={formData.oldPassword}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password:</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Change Password</button>
        </form>
      </div>
    </div>
  );
}

export default ChangePass;
