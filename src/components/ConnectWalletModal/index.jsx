import React from "react";
import classes from "./index.module.css";

import metamask from "../../assets/png/metamask.png";
import wallet from "../../assets/png/wallet.png";
import close from "../../assets/png/close.png";

const ConnectWalletModal = (props) => {
  const { connectWalletConnect, connectMetamask, disconnectWallet, onClose } =
    props;

  return (
    <div className={classes.wrapper}>
      <div className={classes.main}>
        <div className={classes.header}>
          <h4>Connect Wallet</h4>
          <button className={classes["close-btn"]} onClick={onClose}>
            <img src={close} alt="close cross icon" />
          </button>
        </div>
        <div className={classes.content}>
          <button onClick={connectMetamask} className={classes.button}>
            <img src={metamask} alt="metamask" />
            <p>Metamask</p>
          </button>
          <button onClick={connectWalletConnect} className={classes.button}>
            <img src={wallet} alt="metamask" />
            <p>WalletConnect</p>
          </button>
        </div>
        {/* <button className={classes.submit}>Connect</button> */}
      </div>
    </div>
  );
};

export default ConnectWalletModal;
