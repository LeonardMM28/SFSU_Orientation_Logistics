import axios from "axios";
import React, { useEffect, useState } from "react"; // Import React hooks
import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./CreateUser.css";

function CreateUser() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [userTier, setUserTier] = useState("");
  const [isAuthorized, setIsAuthorized] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuthorization = async () => {
      try {
        const response = await fetch(
          // "http://localhost:3000/auth-check",
          "https://sfsulogistics.online:3000/auth-check",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.status === 401 && isMounted) {
          // Invalid or expired token, show unauthorized message and delete session
          alert("Your session has expired, please log in again.");

          const token = localStorage.getItem("token");
          if (token) {
            localStorage.removeItem("token");
            // await axios.post("http://localhost:3000/logout", null, {
            await axios.post("https://sfsulogistics.online:3000/logout", null, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
          }

          navigate("/");
        } else if (response.status === 200 && isMounted) {
          const decodedToken = JSON.parse(
            atob(localStorage.getItem("token").split(".")[1])
          );
          setUsername(decodedToken.username);
          setUserId(decodedToken.userId);

          const userResponse = await axios.get(
            // `http://localhost:3000/getUser/${decodedToken.userId}`
            `https://sfsulogistics.online:3000/getUser/${decodedToken.userId}`
          );
          setUserTier(userResponse.data.tier);

          if (userResponse.data.tier === "2") {
            setIsAuthorized(true);
          } else {
            // User does not have the required tier, show unauthorized message and delete session
            const token = localStorage.getItem("token");
            if (token) {
              localStorage.removeItem("token");
              await axios.post(
                // "http://localhost:3000/logout",
                "https://sfsulogistics.online:3000/logout",
                null,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
            }
            navigate("/");
            alert("You are not authorized to access this page.");
          }
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
      // const response = await axios.post("http://localhost:3000/newUser", {
      const response = await axios.post(
        "https://sfsulogistics.online:3000/newUser",
        {
          username,
          password,
        }
      );
      if (response.status === 200) {
        alert("User created successfully!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const goBack = () => {
    navigate("/dashboard");
  };

  if (!isAuthorized) {
    return null; // Render nothing if not authorized
  }

  return (
    <div className="create-user-page">
      <FiArrowLeftCircle onClick={goBack} className="back-icon" />
      <div className="create-user-form-container">
        <img src="/NSFPlogo.png" alt="NSFP logo" />
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
