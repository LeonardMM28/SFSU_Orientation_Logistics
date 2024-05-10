import { FiArrowLeftCircle } from "react-icons/fi";
import "./Orientation_Resources_Inventory.css";

function Orientation_Resources_Inventory() {
  return (
    <div className="inventory">
      <div className="back-icon-container">
        <FiArrowLeftCircle
          onClick={() => window.history.back()}
          className="back-icon"
        />
        <h1 className="title">ORIENTATION RESOURCES</h1>
      </div>
      <div className="search-container">
        <input type="text" className="search-input" placeholder="Search..." />
        <button className="button">ADD ITEM</button>
      </div>
    </div>
  );
}

export default Orientation_Resources_Inventory;
