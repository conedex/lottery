import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Collapse, Modal, message, Alert, InputNumber } from "antd";
import { LeftCircleOutlined } from "@ant-design/icons";
import polygonLogo from "../../images/polygonlogo.png";
import bitconeLogo from "../../images/Mushroom_Logo.png";
import LOTTERY_ABI from "../../abis/ShroomLottery.json";
import TOKEN_ABI from "../../abis/ShroomToken.json";
import NFT_ABI from "../../abis/Nft.json";
import "./ShroomLottery.css";

const { ethers } = require("ethers");
const RPC_PROVIDER_URL = process.env.REACT_APP_RPC_URL_MATIC;
const { Panel } = Collapse;

const CONTRACT_ADDRESS = "0x6F6C00Ee161e848495446b490723c24EB09ACDAF";
const TOKEN_CONTRACT_ADDRESS = "0xF3ABaa9eA255d38763A5D0Ae6286d6df53154dDC";
const NFT_CONTRACT_ADDRESS = "0x6Bd3a2F6b91830E964a5b3906E0DBF92a5A5Cc53";
const lastWinnerHardcodeAmount = "16.960.000";
const lastWinnerHardcodeAddress = "0x89B3fdf5cd302D012f92a81341017252B7b9515a";
const coneTreasuryAmountHardcodedOverall = "...";
const coneTreasuryAmountHardcoded = "...";

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenContract, setTokenContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [currentPool, setCurrentPool] = useState(0);
  const [lastWinner, setLastWinner] = useState("");
  const [lastPrize, setLastPrize] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const [countdown, setCountdown] = useState("");
  const [transactionHash, setTransactionHash] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lotteryVersion, setLotteryVersion] = useState(0);
  const [numEntries, setNumEntries] = useState(10);
  const [userEntries, setUserEntries] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [newAllowance, setNewAllowance] = useState(6874);
  const [nftContract, setNftContract] = useState(null);
  const [isContractPaused, setIsContractPaused] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const fetchContractPausedState = async () => {
    try {
      // Assuming your contract has a function called 'isPaused' that returns a boolean
      const paused = await contract.isPaused();
      setIsContractPaused(paused);
    } catch (error) {
      console.error("Error fetching contract paused state:", error);
    }
  };

  useEffect(() => {
    if (contract) {
      fetchContractPausedState();
    }
  }, [contract]); // Dependency array ensures this effect runs whenever the contract instance changes

  useEffect(() => {
    const rpcProvider = new ethers.providers.JsonRpcProvider(RPC_PROVIDER_URL);

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      LOTTERY_ABI,
      rpcProvider
    );
    const tokenContract = new ethers.Contract(
      TOKEN_CONTRACT_ADDRESS,
      TOKEN_ABI,
      rpcProvider
    );
    const nftContract = new ethers.Contract(
      NFT_CONTRACT_ADDRESS,
      NFT_ABI,
      rpcProvider
    );

    setProvider(rpcProvider);
    setContract(contract);
    setTokenContract(tokenContract);
    setNftContract(nftContract);

    if (window.ethereum) {
      window.ethereum.request({ method: "net_version" }).then((networkId) => {
        if (networkId === "137") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            LOTTERY_ABI,
            provider
          );
          const tokenContract = new ethers.Contract(
            TOKEN_CONTRACT_ADDRESS,
            TOKEN_ABI,
            provider
          );
          const nftContract = new ethers.Contract(
            NFT_CONTRACT_ADDRESS,
            NFT_ABI,
            provider
          );
          setProvider(provider);
          setContract(contract);
          setTokenContract(tokenContract);
          setNftContract(nftContract);
          setWrongNetwork(false);
        } else {
          setWrongNetwork(true);
        }
      });

      window.ethereum.on("chainChanged", async () => {
        const networkId = await window.ethereum.request({
          method: "net_version",
        });
        if (networkId === "137") {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const contract = new ethers.Contract(
            CONTRACT_ADDRESS,
            LOTTERY_ABI,
            provider
          );
          const tokenContract = new ethers.Contract(
            TOKEN_CONTRACT_ADDRESS,
            TOKEN_ABI,
            provider
          );
          const nftContract = new ethers.Contract(
            NFT_CONTRACT_ADDRESS,
            NFT_ABI,
            provider
          );
          setProvider(provider);
          setContract(contract);
          setTokenContract(tokenContract);
          setNftContract(nftContract);
          setWrongNetwork(false);
        } else {
          setWrongNetwork(true);
          setErrorMessage("Please switch to the Sepolia Testnet.");
        }
      });
    }
  }, []);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();

      let year = now.getUTCFullYear();
      let month = now.getUTCMonth() + 1; // Months are 0-indexed (0 = January, 11 = December)

      if (month > 11) {
        month = 0;
        year += 1;
      }

      // First day of the next month at 00:05 UTC
      const nextMonthFirst = new Date(Date.UTC(year, month, 1, 0, 5, 0, 0));

      const difference = nextMonthFirst - now;

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / (1000 * 60)) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();

    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (contract && account) {
      const fetchUserEntries = async () => {
        const entries = await contract.getUserEntries(account);
        setUserEntries(entries.toString()); // Convert the BigNumber to a string
      };

      fetchUserEntries();
    }
  }, [contract, account]);

  const connectWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const networkId = await window.ethereum.request({
      method: "net_version",
    });
    if (networkId !== "137") {
      setWrongNetwork(true);
    } else {
      setAccount(accounts[0]);
      setWrongNetwork(false);
    }
  };

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x89" }],
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchLotteryInfo = async () => {
    const pool = await contract.getCurrentPool();
    const winner = await contract.getLastWinner();
    const prize = await contract.getLastPrize();
    const version = await contract.currentLotteryVersion();
    setCurrentPool(ethers.utils.formatEther(pool));
    setLastWinner(winner);
    setLastPrize(ethers.utils.formatEther(prize));
    setLotteryVersion(version.toString());
  };

  const enterLottery = async () => {
    try {
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      const tokenContractWithSigner = tokenContract.connect(signer);

      // Check allowance
      const requiredAllowance = ethers.utils.parseUnits(
        (6875 * numEntries + 1).toString(),
        18
      ); // Multiply the required allowance by the number of entries
      const allowance = await tokenContractWithSigner.allowance(
        account,
        CONTRACT_ADDRESS
      );

      if (allowance.lt(requiredAllowance)) {
        // If allowance is less than required, ask for approval
        const allowanceMessageKey = "allowanceMessage";
        message.loading({
          content: "Processing Allowance for Contract...",
          key: allowanceMessageKey,
          duration: 30,
        });
        const tx = await tokenContractWithSigner.approve(
          CONTRACT_ADDRESS,
          requiredAllowance
        );
        await tx.wait();
        message.success({
          content: "Successfully granted Allowance",
          key: allowanceMessageKey,
          duration: 30,
        });

        // Check allowance again after approval
        const newAllowance = await tokenContractWithSigner.allowance(
          account,
          CONTRACT_ADDRESS
        );
        if (newAllowance.lt(requiredAllowance)) {
          // If allowance is still less than required, stop execution
          setErrorMessage("Please Approve Contract");
          return;
        }
      }

      // If allowance is sufficient, enter lottery
      const loadingMessageKey = "loadingMessage";
      message.loading({
        content: "Processing transaction...",
        key: loadingMessageKey,
      });
      const tx = await contractWithSigner.enterLottery(numEntries);
      await tx.wait();
      message.success({
        content: (
          <>
            Successfully entered the Lottery.
            <a
              href={`https://polygonscan.com/tx/${tx.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginLeft: "10px" }}
            >
              Transaction Receipt
            </a>
          </>
        ),
        key: loadingMessageKey,
        duration: 30,
      });
      setTransactionHash(tx.hash);
      fetchLotteryInfo(); // Refresh lottery info
      setErrorMessage(null); // clear any previous error messages
    } catch (error) {
      console.error(error); // Log the error object to the console
      if (error.code === 4001) {
        // error code for user rejected transaction
        setErrorMessage("Transaction was not approved.");
      } else {
        setErrorMessage("An error occurred.");
      }
    }
  };

  const increaseAllowance = async () => {
    const newAllowanceInWei = ethers.utils.parseEther(newAllowance.toString());

    const signer = provider.getSigner();
    const tokenContractWithSigner = tokenContract.connect(signer);

    const tx = await tokenContractWithSigner.approve(
      CONTRACT_ADDRESS,
      newAllowanceInWei
    );
    await tx.wait();

    // Refresh allowance
    const updatedAllowance = await tokenContractWithSigner.allowance(
      account,
      CONTRACT_ADDRESS
    );
    setAllowance(ethers.utils.formatEther(updatedAllowance));
  };

  useEffect(() => {
    if (contract) {
      fetchLotteryInfo();
    }
  }, [contract]);

  useEffect(() => {
    if (contract && account) {
      const fetchUserEntriesAndAllowance = async () => {
        const entries = await contract.getUserEntries(account);
        setUserEntries(entries.toString()); // Convert the BigNumber to a string

        const allowance = await tokenContract.allowance(
          account,
          CONTRACT_ADDRESS
        );
        setAllowance(ethers.utils.formatEther(allowance));
      };

      fetchUserEntriesAndAllowance();
    }
  }, [contract, account]);

  function formatNumber(num) {
    return new Intl.NumberFormat().format(Math.floor(num));
  }

  return (
    <div className="lottery-app">
      <div className="App">
        <header className="App-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div>
              <Link to="/">
                <LeftCircleOutlined
                  style={{
                    fontSize: "2rem",
                    color: "black",
                    marginRight: "90%",
                    marginLeft: "25%",
                  }}
                />
              </Link>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {wrongNetwork ? (
                <button onClick={switchNetwork}>Wrong Network</button>
              ) : account ? (
                <>
                  <div className="header-right">
                    <div className="wallet-info" onClick={showModal}>
                      <img
                        src={polygonLogo}
                        alt="Polygon Image"
                        className="wallet-image"
                        style={{ marginRight: "10px" }}
                      />
                      {account.substring(0, 5) +
                        "..." +
                        account.substring(account.length - 3)}
                    </div>
                  </div>
                  <div style={{ width: 0 }}>
                    <Modal
                      title="Profile"
                      open={isModalVisible}
                      onOk={handleOk}
                      onCancel={handleOk}
                      footer={null}
                    >
                      <p className="modal-wallet-info">
                        Account Wallet:{" "}
                        <a
                          href={`https://polygonscan.com/address/${account}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {account}
                        </a>
                      </p>
                      <p className="modal-wallet-info">
                        Entries in current Lottery:{" "}
                        <strong>{userEntries}</strong>
                      </p>
                      <p>
                        SHROOM in current Lottery:{" "}
                        <strong>{formatNumber(userEntries * 6874)}</strong>
                      </p>
                      <p className="modal-wallet-info">
                        Allowance given: <strong>{allowance}</strong>
                      </p>
                      <InputNumber
                        min={1}
                        defaultValue={68740}
                        onChange={(value) => setNewAllowance(value)}
                      />
                      <button onClick={increaseAllowance}>
                        Change Allowance
                      </button>
                    </Modal>
                  </div>
                </>
              ) : (
                <button onClick={connectWallet}>Connect Wallet</button>
              )}
            </div>
          </div>
        </header>
        <main>
          <h1>
            <img
              src={bitconeLogo}
              alt="Bitcone Logo Left"
              className="bitcone-header"
              style={{ marginRight: "1%", marginLeft: "1%" }}
            />
            Shroom Lottery
            <img
              src={bitconeLogo}
              alt="Bitcone Logo Left"
              className="bitcone-header"
              style={{ marginRight: "1%", marginLeft: "1%" }}
            />
          </h1>
          {/*<Alert
            type="warning"
            description="For the best experience access our Lottery with a Browser on a Desktop."
            showIcon={true}
            className="alert"
              />*/}
          <div className="lottery-info">
            <p>Next pull in: {countdown}</p>
            <p>Current Lottery Version: {lotteryVersion}</p>
            <p>
              Amount in current Lottery:{" "}
              <strong>{formatNumber(currentPool)}</strong> SHROOM
            </p>
            <p>Entry Amount: {formatNumber(numEntries * 6874)} SHROOM</p>
            <p>Number of entries: {numEntries}</p>
            <InputNumber
              min={1}
              defaultValue={10}
              onChange={(value) => setNumEntries(value)}
              style={{ marginBottom: "10px" }}
            />
            {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
            <button
              onClick={enterLottery}
              disabled={!account || isContractPaused}
            >
              Enter Lottery
            </button>
          </div>
          <div className="lastWinner">
            <p>
              Last Winner:<br></br>
              <strong>
                {lastWinner.substring(0, 5) +
                  "..." +
                  lastWinner.substring(lastWinner.length - 5)}
              </strong>
            </p>
            <p>
              Last amount won: <br></br>
              <strong>{formatNumber(lastPrize)}</strong> SHROOM
            </p>
            <p>
              Amount sent to SHROOM Treasury: <br></br>
              <strong>{coneTreasuryAmountHardcoded}</strong> SHROOM
            </p>
            <p>
              Amount sent to SHROOM Treasuy overall: <br></br>
              <strong>{coneTreasuryAmountHardcodedOverall}</strong> SHROOM
            </p>
          </div>
          {/*<div className="lastWinner">
            <p>
              Last Winner: <br></br>
              <strong>
                {lastWinnerHardcodeAddress.substring(0, 8) +
                  "..." +
                  lastWinnerHardcodeAddress.substring(
                    lastWinnerHardcodeAddress.length - 3
                  )}
              </strong>
            </p>
            <p>
              Last amount won: <br></br>
              <strong>{lastWinnerHardcodeAmount}</strong> CONE
            </p>
            <p>
              Amount sent to CONE Treasuy: <br></br>
              <strong>{coneTreasuryAmountHardcoded}</strong> CONE
            </p>
                  </div>*/}
          <div className="faq-section">
            <h2>FAQs</h2>
            <Collapse defaultActiveKey={["0"]} className="faq-collapse">
              <Panel header="How does this Lottery work?" key="1">
                <p>
                  Users can purchase Lottery Tickets for a fixed price in SHROOM
                  per Ticket. At the end of each Lottery round a winning ticket
                  is randomly selected to win the Prize Pot!
                </p>
              </Panel>
              <Panel header="How often is a winner selected?" key="2">
                <p>
                  A winner is selected at the end of each Lottery round. Each
                  round lasts for 7 days, you may view the next Winner pull date
                  at the top of the website!
                </p>
              </Panel>
              <Panel header="How are winners selected?" key="3">
                <p>
                  Our Lottery Smart Contract uses Chainlink VRF2.5 to guarantee
                  100% unpredictable randomness when selecting a winning ticket.
                  We also utilize Chainlink Upkeeps to keep the contract running
                  automatically.
                </p>
              </Panel>
              <Panel header="How many tickets can I buy?" key="4">
                <p>
                  The current price for an entry ticket is 6,874 SHROOM. Each
                  user can purchase an unlimited amount of tickets.
                </p>
              </Panel>
              <Panel header="Is there any kind of fee to play?" key="5">
                <p>
                  There is a 1% fee to purchase Lottery Tickets which get saved
                  in the Lottery to cover the Tax which Shroom has in addition
                  to a 20% fee on the Prize Pool. 5% of which goes to the SHROOM
                  Treasury Wallet, along with a 15% which goes to the Creator to
                  cover Chainlink utilization costs on every transaction, as
                  well as operational and hosting costs.
                </p>
              </Panel>
              <Panel
                header="What are the benefits of using this Lottery?"
                key="6"
              >
                <p>
                  The Lottery Smart contract is immutable, this means the owner
                  can not influnce the outcome of the Lottery. Using this smart
                  contract ensures that each Ticket gets an equal chance to win!
                </p>
              </Panel>
            </Collapse>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
