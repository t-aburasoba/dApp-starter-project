// App.js
import React, { useEffect, useState } from "react";
import "./App.css";
/* ethers 変数を使えるようにする*/
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";

const App = () => {
  // ユーザーのパブリックウォレットを保存するために使用する状態変数を定義します。
  const [currentAccount, setCurrentAccount] = useState("");

  console.log("currentAccount: ", currentAccount);

  const contractAddress = "0x7A2d435D44BAD00D19B530c82b6dc9462Ea8224a";

  const contractABI = abi.abi

  // window.ethereumにアクセスできることを確認します。
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }
      // ユーザーのウォレットへのアクセスが許可されているかどうかを確認します。
      const accounts = await ethereum.request({ method: "eth_accounts" });
      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // connectWalletメソッドを実装
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  // waveの回数をカウントする関数を実装
  const wave = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
        );
        let count = await wavePortalContract.getTotalWaves();
        console.log("Retrieved total wave count...", count.toNumber());

        const waveTxn = await wavePortalContract.wave()
        await waveTxn.wait()
        count = await wavePortalContract.getTotalWaves()
        console.log("Retrieved total wave count...", count.toNumber())
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  // WEBページがロードされたときに下記の関数を実行します。
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  return (
      <div className="mainContainer">
        <div className="dataContainer">
          <div className="header">
          <span role="img" aria-label="hand-wave">
            👋
          </span>{" "}
            WELCOME!
          </div>
          <div className="bio">
            イーサリアムウォレットを接続して、「
            <span role="img" aria-label="hand-wave">
            👋
          </span>
            (wave)」を送ってください
            <span role="img" aria-label="shine">
            ✨
          </span>
          </div>
          {/* waveボタンにwave関数を連動させる。*/}
          <button className="waveButton" onClick={wave}>
            Wave at Me
          </button>
          {/* ウォレットコネクトのボタンを実装 */}
          {!currentAccount && (
              <button className="waveButton" onClick={connectWallet}>
                Connect Wallet
              </button>
          )}
          {currentAccount && (
              <button className="waveButton" onClick={connectWallet}>
                Wallet Connected
              </button>
          )}
        </div>
      </div>
  );
};
export default App;