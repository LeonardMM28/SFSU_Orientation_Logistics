import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./Login";
import AddEditOLUniforms from "./Add_Edit_OL_Uniforms";
import AddEditOrientationResources from "./Add_Edit_Orientation_Resources";
import AddEditPlanner from "./Add_Edit_Planner";
import PlannerInventory from "./Planner_Inventory";
import OLUniformsInventory from "./OL_Uniforms_Inventory";
import OrientationResourcesInventory from "./Orientation_Resources_Inventory";
import Dashboard from "./Dashboard";
import CreateUser from "./CreateUser";
import History from "./History";
// import Registration from "./Registration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-edit-ol-uniforms" element={<AddEditOLUniforms />} />
        <Route path="/add-edit-orientation-resources" element={<AddEditOrientationResources />} />
        <Route path="/add-edit-planner" element={<AddEditPlanner />} />
        <Route path="/planner-inventory" element={<PlannerInventory />} />
        <Route path="/ol-uniforms-inventory" element={<OLUniformsInventory />} />
        <Route path="/orientation-resources-inventory" element={<OrientationResourcesInventory />} />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/history" element={<History />} />
        
        {/* <Route path="/register" element={<Registration />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
