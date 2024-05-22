import axios from "axios";
import React, { useEffect, useState } from "react"; // Import React hooks
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import { BrowserBarcodeReader } from "@zxing/library";

import "./Dashboard.css";

function Dashboard() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [userTier, setUserTier] = useState(""); // State to store user's tier
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleExtractBarcode = async () => {
    if (selectedFile) {
      try {
        const reader = new BrowserBarcodeReader();
        const result = await reader.decodeFromImageUrl(
          URL.createObjectURL(selectedFile)
        );
        setScanResult(result.text);
        alert("Barcode extracted successfully!");
      } catch (error) {
        console.error(error);
        alert(
          "Error occurred while extracting barcode. Please ensure the selected file contains a valid barcode."
        );
      }
    } else {
      alert("Please select a file first.");
    }
  };

  useEffect(() => {
    // Function to authenticate token on component mount
    const authenticateToken = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/auth-check",
          // "https://thelockerroom.world:3000/auth-check",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 401) {
          // Unauthorized, clear token and redirect to login page
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Error authenticating token:", error);
      }
    };

    authenticateToken(); // Call the authentication function on component mount
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
          setUserTier(response.data.tier); // Assuming your backend sends back user's tier
        } catch (error) {
          console.error("Error fetching user information:", error);
        }
      }
    };

    getUsernameAndTierFromToken();
  }, []);

  useEffect(() => {
    // Function to retrieve the user information from the backend
    const getUserInfo = async () => {
      try {
        // Make a GET request to fetch user information based on user ID

        const response = await axios.get(
          `http://localhost:3000/getUser/${userId}`
        );
        // const response = await axios.get(
        //   `https://thelockerroom.world:3000/getUser/${userId}`
        // );
      } catch (error) {
        console.error("Error fetching user information:", error);
      }
    };

    getUserInfo(); // Call the function to fetch user information
  }, [userId]);

  const goToOLUniformsInventory = () => {
    navigate("/ol-uniforms-inventory");
  };

  const goToOrientaitonResourcesInventory = () => {
    navigate("/orientation-resources-inventory");
  };

  const goToPlannerInventory = () => {
    navigate("/planner-inventory");
  };

  const goToCreateUser = () => {
    navigate("/create-user");
  };

  const goToOther = () => {
    navigate("/other");
  };
  const goToHistory = () => {
    navigate("/history");
  };

  return (
    <div className="dashboard">
      <h1>Welcome Back, {username}! We missed you.</h1>
      <h1>NSFP Orientation 2024</h1>
      <h1>Logistics Dashboard</h1>
      <div className="button-container">
        <button className="button" onClick={goToOLUniformsInventory}>
          OL Uniforms
        </button>
        <button className="button" onClick={goToOrientaitonResourcesInventory}>
          Orientation Supplies
        </button>
        <button className="button" onClick={goToPlannerInventory}>
          Session Planner
        </button>
        {userTier === "2" && ( // Show the "Create User" button only if user's tier is 1}
          <button className="button" onClick={goToCreateUser}>
            Create User
          </button>
        )}
        {userTier === "2" && ( // Show the "History" button only if user's tier is 2
          <button className="button" onClick={goToHistory}>
            History
          </button>
        )}
        <button className="button" onClick={goToOther}>
          Other
        </button>
      </div>
      <div className="barcode-scanner">
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button className="button" onClick={handleExtractBarcode}>
          Extract Barcode
        </button>
        <input
          type="text"
          value={scanResult}
          readOnly
          placeholder="Extracted Barcode"
        />
        <button className="button" onClick={() => setScanResult("")}>
          Clear
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
