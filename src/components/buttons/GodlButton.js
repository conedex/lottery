import React from "react";
import "./LotteryButton.css";
import GODL from "../../images/godlnobg.png";
import Polygon from "../../images/polygonlogo.png";

function LotteryButton({ label, onClick }) {
  return (
    <button className="lottery-button" onClick={onClick}>
      {/*<img src={GODL} alt="GODL-Logo" className="GODL-icon" />*/}
      {label}
      <img src={Polygon} alt="Polygon-Logo" className="Polygon-icon" />
    </button>
  );
}

export default LotteryButton;
