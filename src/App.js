import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Lottery from "./components/Lottery";
import HighScore from "./components/HighScore";
import GodlLottery from "./components/MultipleLottery";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lottery" element={<Lottery />} />
        <Route path="/highscore" element={<HighScore />} />
        <Route path="/godllottery" element={<GodlLottery />} />
      </Routes>
    </Router>
  );
};

export default App;
