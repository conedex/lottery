import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import Lottery from "./components/lotteries/Lottery";
import HighScore from "./components/highscore/HighScore";
import GodlLottery from "./components/lotteries/MultipleLottery";
import DonutLottery from "./components/lotteries/DonutLottery";
import ShroomLottery from "./components/lotteries/ShroomLottery";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/lottery" element={<Lottery />} />
        <Route path="/highscore" element={<HighScore />} />
        <Route path="/donutlottery" element={<DonutLottery />} />
        <Route path="/godllottery" element={<GodlLottery />} />
        <Route path="/shroomlottery" element={<ShroomLottery />} />
      </Routes>
    </Router>
  );
};

export default App;
