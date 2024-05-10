import { FiArrowLeftCircle } from "react-icons/fi";
import "./Planner_Inventory.css";

function Planner_Inventory() {
 return (
   <div className="inventory">
     <div className="back-icon-container">
       <FiArrowLeftCircle
         onClick={() => window.history.back()}
         className="back-icon"
       />
       <h1 className="title">SESSION PLANNER</h1>
     </div>
     <div className="search-container">
       <input type="text" className="search-input" placeholder="Search..." />
       <button className="button">ADD ITEM</button>
     </div>
   </div>
 );
}

export default Planner_Inventory;
