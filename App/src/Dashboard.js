import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./Dashboard.css";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [userTier, setUserTier] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [captureClicked, setCaptureClicked] = useState(false);
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

  useEffect(() => {
    const getUsernameAndTierFromToken = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = JSON.parse(atob(token.split(".")[1]));
          setUsername(decodedToken.username);
          setUserId(decodedToken.userId);
          const response = await axios.get(
            `http://localhost:3000/getUser/${decodedToken.userId}`
          );
          setUserTier(response.data.tier);
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      }
    };

    getUsernameAndTierFromToken();
  }, []);

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/getUser/${userId}`
        );
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    if (userId) {
      getUserInfo();
    }
  }, [userId]);

  if (!isAuthorized) {
    return null; // Render a loading state while authorization check is in progress
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        localStorage.removeItem("token");
        navigate("/");
      } else {
        console.error("Error logging out");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="dashboard">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h1>Welcome Back, {username}.</h1>
      <h1>Summer Orientation 2024</h1>
      <h1>Logistics Dashboard</h1>
      <div className="button-container">
        {userTier === "2" && (
          <button
            className="button"
            onClick={() => navigate("/ol-uniforms-inventory")}
          >
            OL Uniforms
          </button>
        )}
        <button
          className="button"
          onClick={() => navigate("/orientation-supplies-inventory")}
        >
          Orientation Supplies
        </button>
        <button
          className="button"
          onClick={() => navigate("/planner-inventory")}
        >
          Session Planner
        </button>
        {userTier === "2" && (
          <button className="button" onClick={() => navigate("/create-user")}>
            Create User
          </button>
        )}
        <button className="button" onClick={() => navigate("/history")}>
          History
        </button>
        <button className="button" onClick={() => navigate("/change-pass")}>
          Change Password
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
