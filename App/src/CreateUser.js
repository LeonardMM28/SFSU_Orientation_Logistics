import React, { useEffect, useState } from "react"; // Import React hooks
import "./CreateUser.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateUser() {
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [userTier, setUserTier] = useState("");
  const navigate = useNavigate();

useEffect(() => {
  const checkAuthorization = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth-check", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.status === 401) {
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
      } else {
        // Token is valid, check user tier
        const decodedToken = JSON.parse(
          atob(localStorage.getItem("token").split(".")[1])
        );
        const response = await axios.get(
          `http://localhost:3000/getUser/${decodedToken.userId}`
        );
        const userTier = response.data.tier;
        if (userTier !== "2") {
          // User does not have the required tier, show unauthorized message and delete session
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
          alert("You are not authorized to access this page.");
        } else {
          // Both token and user tier are valid, continue with the component
          const decodedToken = JSON.parse(
            atob(localStorage.getItem("token").split(".")[1])
          );
          setUsername(decodedToken.username);
          setUserId(decodedToken.userId);
          setUserTier(userTier);
        }
      }
    } catch (error) {
      console.error("Error checking authorization:", error);
    }
  };

  checkAuthorization();
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

    // useEffect(() => {
    //   if (userTier !== "2") {
    //     //SHOW A UNAUTHORIZED BROWSER MESSAGE
    //     localStorage.removeItem("token");
    //     navigate("/");
    //     alert("You are not authorized to access this page.");
    //   }
    // }, [userTier, navigate]);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
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
    const { username, password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/newUser", {
        username,
        password,
      });
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  return (
    <div className="create-user-page">
      <div className="create-user-form-container">
        <img src="/NSFPlogo.png" alt="Rotaract at SFSU Logo" />
        <h2>Create a new account</h2>
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
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default CreateUser;
