import { FiArrowLeftCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "./Orientation_Resources_Inventory.css";

function Orientation_Resources_Inventory() {
  const navigate = useNavigate();
  
  const goToAddEdit = () => {
    navigate("/add-edit-orientation-resources");
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
        <h1 className="title">ORIENTATION SUPPLIES</h1>
      </div>
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Search..." />
        <button className="button" onClick={goToAddEdit}>ADD ITEM</button>
      </div>
    </div>
  );
}

export default Orientation_Resources_Inventory;
