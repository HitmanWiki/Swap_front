import React, { useEffect } from "react";
import Calculator from "../Calculator";
import classes from "./Home.module.css";
import logo from "../../assets/png/logo.png";
import leftSideCoins from "../../assets/png/home-page-left-side-coins.png";
import rightSideCoins from "../../assets/png/home-page-right-side-coins.png";
import { NetworkTokensHook } from "../../hooks/tokenHooks";
import { ContractUtility } from "../../utility/contractUtility";
import { useMemo } from "react";

const Home = ({
  wallet,
  walletProvider,
  setIsShowWalletModal,
  disconnectWallet,
  userAddress,
  showModal,
  chainId,
  isChain,
  unknownNetwork,
}) => {
  const { getTokens, loading, data, setData, error } = NetworkTokensHook();

  useEffect(() => {
    const get = () => {
      const symbol = ContractUtility.getSymbol(chainId.toString());
      getTokens(symbol);
    };
    isChain ? get() : getTokens("ETH");
  }, [chainId, isChain]);

  const logoUri = useMemo(() => {
    if (data) {
      return data.map((item) => item.logoURI);
    }
  }, [data]);
  return (
    <div className={classes["home-wrapper"]}>
      <div className={classes["home-container"]}>
        <div className={classes["container"]}>
          <header className={classes["header"]}>
            <div>
              <img src={logo} alt="logo" width={80} />
            </div>
            <button
              onClick={userAddress ? disconnectWallet : showModal}
              className={classes["connect-wallet"]}>
              {userAddress
                ? `${userAddress.slice(0, 6)}...
            ${userAddress.slice(-10)}`
                : " Connect Wallet"}
            </button>
          </header>
          <div className={classes["calculater-wrapper"]}>
            {data && (
              <Calculator
                unknownNetwork={unknownNetwork}
                chainId={chainId}
                wallet={wallet}
                walletProvider={walletProvider}
                setIsShowWalletModal={setIsShowWalletModal}
                userAddress={userAddress}
                networkTokens={data}
                setData={setData}
                logoUri={logoUri}
                showModal={showModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
