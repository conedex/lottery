import React from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";
import "./LandingPage.css";
import bitconewinlogo from "../images/bitconewinlogolargenew.png";
import bannerImage from "../images/CG_Banner.jpg";

// LandingPage component
const LandingPage = () => {
  return (
    <div>
      <div className="banner">
        <a
          className="banner-link"
          href="https://rccmarketcap.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="banner-image" src={bannerImage} alt="Banner" />
        </a>
      </div>
      <div className="vanta-hero">
        <img
          src={bitconewinlogo}
          alt="Bitconwin Logo"
          style={{ margin: "auto" }}
        />
      </div>
      <div className="content-section">
        <div className="donut-lottery-section">
          <h2>Dash into the daring Donut Dance: Our Donut Lottery</h2>
          <p>
            Dive into our new and improved lottery uniquely crafted for the
            Donut community. Bet with DONUT tokens and watch your fortune
            unfold. A slice of every jackpot enriches the Donut ecosystem,
            fostering community growth and shared success.
          </p>
          <Link to="/donutlottery">
            <Button type="default" size="large">
              Enter Donut Lottery
            </Button>
          </Link>
        </div>
        <div className="lottery-section">
          <h2>Join the Coneheads Craze: Our Premier Bitcone Lottery</h2>
          <p>
            Dive into our pioneering lottery specifically crafted for the
            Coneheads community. Bet with Bitcone tokens and watch your fortune
            unfold. A slice of every jackpot enriches the Coneheads ecosystem,
            fostering community growth and shared success.
          </p>
          <Link to="/lottery">
            <Button type="default" size="large">
              Enter Bitcone Lottery
            </Button>
          </Link>
        </div>
        <div className="lottery-section">
          <h2>GODL: Our Premier Sponsored Lottery</h2>
          <p>We proudly present our GODL lottery. 3 Weekly GODL Winners!</p>
          <Link to="/godllottery">
            <Button type="default" size="large">
              Enter GODL Lottery
            </Button>
          </Link>
        </div>
        <div className="lottery-section">
          <h2>Documentation</h2>
          <p>
            Learn more about the lottery, any future plans and how to contact
            us.
          </p>
          <Link to="https://conedex.gitbook.io/bitcone.win/">
            <Button type="default" size="large">
              Enter Documentation
            </Button>
          </Link>
        </div>
        <div className="lottery-section">
          <h2>High-Scores</h2>
          <p>
            How high was the highest win? Who won the most? Who won when? Check
            it out under our HighScore Page!
          </p>
          <Link to="/highscore">
            <Button type="default" size="large">
              Enter High-Scores
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
