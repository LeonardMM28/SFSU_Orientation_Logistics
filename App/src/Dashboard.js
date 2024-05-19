import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

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
      <h1>NSFP Orientation 2024</h1>
      <h1>Logistics Dashboard</h1>
      <div className="button-container">
        <button className="button" onClick={goToOLUniformsInventory}>
          OL Uniforms
        </button>
        <button className="button" onClick={goToOrientaitonResourcesInventory}>
          Orientation Resources
        </button>
        <button className="button" onClick={goToPlannerInventory}>
          Session Planner
        </button>
        <button className="button" onClick={goToCreateUser}>
          Create User
        </button>
        <button className="button" onClick={goToHistory}>
          History
        </button>
        <button className="button" onClick={goToOther}>
          Other
        </button>
      </div>
    </div>
  );
}

export default Dashboard;


