import React, { useEffect, useState } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Dashboard.css";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [userTier, setUserTier] = useState("");
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

  const handleScan = (result) => {
    if (result) {
      setScanResult(result.text);
    }
  };

  const handleError = (error) => {
    console.error("Error scanning barcode:", error);
  };

  const handleOpenCamera = () => {
    setShowCamera(true);
  };

  const handleCloseCamera = () => {
    setShowCamera(false);
    setScanResult("");
  };

  const handleCapture = () => {
    setCaptureClicked(true);
  };

  return (
    <div className="dashboard">
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
      <h1>Welcome Back, {username}! We missed you.</h1>
      <h1>NSFP Orientation 2024</h1>
      <h1>Logistics Dashboard</h1>
      <div className="button-container">
        <button
          className="button"
          onClick={() => navigate("/ol-uniforms-inventory")}
        >
          OL Uniforms
        </button>
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
        {userTier === "2" && (
          <button className="button" onClick={() => navigate("/history")}>
            History
          </button>
        )}
        <button className="button" onClick={() => navigate("/other")}>
          Other
        </button>
        {showCamera ? (
          <div>
            <button className="button" onClick={handleCloseCamera}>
              Close Camera
            </button>
            <button className="button" onClick={handleCapture}>
              Capture
            </button>
          </div>
        ) : (
          <button className="button" onClick={handleOpenCamera}>
            Open Camera
          </button>
        )}
      </div>
      <div className="barcode-scanner">
        {showCamera && (
          <QrReader
            delay={300}
            onResult={handleScan}
            onError={handleError}
            style={{ width: "100%" }}
          />
        )}
        {scanResult && <p>Scanned barcode: {scanResult}</p>}
        {captureClicked && !scanResult && <p>No barcode captured.</p>}
      </div>
    </div>
  );
}

export default Dashboard;