import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Planner_Inventory.css";

function Planner_Inventory() {

  const navigate = useNavigate();

  const goToAddEdit = () => {
    navigate("/add-edit-planner");
  };

  const goToDashboard = () => {
    navigate("/dashboard");
  };

 return (
   <div className="inventory">
     <div className="back-icon-container">
       <FiArrowLeftCircle
         onClick={goToDashboard}
         className="back-icon"
       />
       <h1 className="title">SESSION PLANNER</h1>
     </div>
     <div className="search-container">
       <input type="text" className="search-input" placeholder="Search..." />
       <button className="button" onClick={goToAddEdit}>ADD SESSION</button>
     </div>
   </div>
 );
}

export default Planner_Inventory;
