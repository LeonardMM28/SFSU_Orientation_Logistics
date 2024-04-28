import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const goToAddEditOLUniforms = () => {
    navigate("/add-edit-ol-uniforms");
  };

  const goToAddEditOrientationResources = () => {
    navigate("/add-edit-orientation-resources");
  };

  const goToAddEditPlanner = () => {
    navigate("/add-edit-planner");
  };

  const goToOther = () => {
    navigate("/other");
  };

  return (
    <div className="dashboard">
      <h1>Logistics Dashboard</h1>
      <div className="button-container">
        <button className="button" onClick={goToAddEditOLUniforms}>OL Uniforms</button>
        <button className="button" onClick={goToAddEditOrientationResources}>Orientation Resources</button>
        <button className="button" onClick={goToAddEditPlanner}>Planner</button>
        <button className="button" onClick={goToOther}>Other</button>
      </div>
    </div>
  );
}

export default Dashboard;


