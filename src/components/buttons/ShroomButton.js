import React from "react";
import "./ShroomButton.css";
import Shroom from "../../images/Mushroom_Logo.png";
import ETH from "../../images/polygonlogo.png";

function ShroomButton({ label, onClick }) {
  return (
    <button className="lottery-button" onClick={onClick}>
      {/*<img src={Shroom} alt="Shroom-Logo" className="Shroom-icon" />*/}
      {label}
      <img src={ETH} alt="ETH-Logo" className="ETH-icon" />
    </button>
  );
}

export default ShroomButton;
