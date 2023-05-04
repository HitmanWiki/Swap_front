import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ConnectWalletModal from "./components/ConnectWalletModal";
import HomePage from "./pages/Home";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from "web3";
import TokenTable from "./pages/admin/tokentable";
import AdminLogin from "./pages/admin/adminLogin";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [userAddress, setUserAddress] = useState("");
  const [chainId, setChainId] = useState(1);
  const [isChain, setIsChain] = useState(false);
  const [wallet, setWallet] = useState("");
  const [walletProvider, setWalletProvider] = useState("");
  const [isShowWalletModal, setIsShowWalletModal] = useState(false);
  const [unknownNetwork, setUnknownNetwork] = useState(false);

  const handleIsShowWalletModal = () => {
    setIsShowWalletModal(!isShowWalletModal);
  };
  const connectWalletConnect = async () => {
    try {
      const provider = new WalletConnectProvider({
        rpc: {
          1: "https://cloudflare-eth.com/",
          25: "https://evm-cronos.crypto.org/",
          56: "https://bsc-dataseed1.ninicoin.io/",
          137: "https://polygon-rpc.com/",
          43114: "https://api.avax.network/ext/bc/C/rpc",
        },
        infuraId: null,
      });

      await provider.enable();
      const web3 = new Web3(provider);
      setWalletProvider(provider);

      const chainId = await web3.eth.getChainId();
      const accounts = await web3.eth.getAccounts();
      setChainId(chainId);
      setIsChain(true);
      setUserAddress(accounts[0]);
      setIsShowWalletModal(false);
      setWallet("WALLET_CONNECT");

      provider.on("accountsChanged", (accounts) => {
        setUserAddress(accounts[0]);
        console.log(accounts);
      });

      // Subscribe to chainId change
      provider.on("chainChanged", (chainId) => {
        setChainId(chainId);
        setIsChain(true);
      });

      // Subscribe to session disconnection
      provider.on("disconnect", (code, reason) => {
        console.log(code, reason);
        setUserAddress("");
      });
    } catch (error) {
      console.log(error);
    }
  };

  const connectMetamask = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setUserAddress(accounts[0]);
      setIsShowWalletModal(false);
      setWallet("METAMASK");

      try {
        window.localStorage.setItem("userAddress", accounts[0]);
      } catch (error) {
        window.localStorage.clear();
        window.localStorage.setItem("userAddress", accounts[0]);
      }

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      let id = parseInt(chainId, 16);

      if (
        Number(chainId) !== 56 &&
        Number(chainId) !== 1 &&
        Number(chainId) !== 137 &&
        Number(chainId) !== 43114 &&
        Number(chainId) !== 25
      ) {
        setUnknownNetwork(true);
      } else {
        setUnknownNetwork(false);
        setChainId(id);
        setIsChain(true);
      }

      window.ethereum.on("accountsChanged", function (accounts) {
        setUserAddress(accounts[0]);
      });

      window.ethereum.on("chainChanged", (_chainId) => {
        let id = parseInt(_chainId, 16);
        setChainId(id);
        setIsChain(true);
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const disconnectWallet = async () => {
    if (wallet === "WALLET_CONNECT") {
      const provider = new WalletConnectProvider({
        rpc: {
          1: "https://cloudflare-eth.com/",
          25: "https://evm-cronos.crypto.org/",
          56: "https://bsc-dataseed1.ninicoin.io/",
          137: "https://polygon-rpc.com/",
          43114: "https://api.avax.network/ext/bc/C/rpc",
        },
        infuraId: null,
      });
      await provider.disconnect();
    }

    setUserAddress("");
  };

  useEffect(() => {
    let user = localStorage.getItem("userAddress");
    if (user) {
      connectMetamask();
    }
  }, []);

  return (
    <BrowserRouter>
      {isShowWalletModal && (
        <ConnectWalletModal
          connectWalletConnect={connectWalletConnect}
          connectMetamask={connectMetamask}
          disconnectWallet={disconnectWallet}
          onClose={handleIsShowWalletModal}
        />
      )}
      <div className="main">
        <Routes>
          <Route
            exact
            path="/"
            element={
              <HomePage
                unknownNetwork={unknownNetwork}
                wallet={wallet}
                walletProvider={walletProvider}
                disconnectWallet={disconnectWallet}
                userAddress={userAddress}
                chainId={chainId}
                isChain={isChain}
                setIsShowWalletModal={setIsShowWalletModal}
                showModal={handleIsShowWalletModal}
              />
            }
          />
          <Route
            exact
            path="/tokens"
            element={
              <TokenTable
                unknownNetwork={unknownNetwork}
                setIsShowWalletModal={setIsShowWalletModal}
                isChain={isChain}
                chainId={chainId}
                userAddress={userAddress}
                walletProvider={walletProvider}
                wallet={wallet}
              />
            }
          />
          <Route exact path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
