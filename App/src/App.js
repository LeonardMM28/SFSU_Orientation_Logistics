import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Add_OL_Uniforms from "./Add_OL_Uniforms";
import Edit_OL_Uniforms from "./Edit_OL_Uniforms";
import Add_Orientation_Supplies from "./Add_Orientation_Supplies";
import Edit_Orientation_Supplies from "./Edit_Orientation_Supplies";
import Add_Session from "./Add_Session";
import "./App.css";
import CreateUser from "./CreateUser";
import Dashboard from "./Dashboard";
import Edit_Session from "./Edit_Session";
import History from "./History";
import Login from "./Login";
import ChangePass from "./ChangePass";
import OLUniformsInventory from "./OL_Uniforms_Inventory";
import OrientationResourcesInventory from "./Orientation_Supplies_Inventory";
import PlannerInventory from "./Planner_Inventory";
import Message from "./OL_MESSAGE";
import Mission_board from "./OL_MESSAGE_BOARD";
// import Registration from "./Registration";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-ol-uniforms" element={<Add_OL_Uniforms />} />
        <Route path="/edit-ol-uniforms/:itemId" element={<Edit_OL_Uniforms />} />
        <Route path="/add-orientation-supplies" element={<Add_Orientation_Supplies />} />
        <Route path="/edit-orientation-supplies/:itemId" element={<Edit_Orientation_Supplies />} />
        <Route path="/add-session" element={<Add_Session />} />
        <Route path="/edit-session/:sessionId" element={<Edit_Session />} />
        <Route path="/planner-inventory" element={<PlannerInventory />} />
        <Route
          path="/ol-uniforms-inventory"
          element={<OLUniformsInventory />}
        />
        <Route
          path="/orientation-supplies-inventory"
          element={<OrientationResourcesInventory />}
        />
        <Route path="/create-user" element={<CreateUser />} />
        <Route path="/history" element={<History />} />
        <Route path="/change-pass" element={<ChangePass />} />
        <Route path="/message" element={<Message />} />
        <Route path="/mission-board" element={<Mission_board />} />

        {/* <Route path="/register" element={<Registration />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
