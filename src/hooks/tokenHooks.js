import { useEffect, useState } from "react";
import { TokenService } from "../services/tokenInfo";
import { providers, ethers } from "ethers";
import ABI from "../common/abi/erc20Abi.json";
import { CommonHook } from "./commonHook";
import { ToastMessage } from "../components/toastMessage";
import { BrowserUtility } from "../utility/browserUtility";

export const TokenInfoHook = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getTokenInfo = async (wallet, walletProvider, address) => {
    try {
      setLoading(true);
      let web3Provider;
      if (wallet === "WALLET_CONNECT") {
        web3Provider = new providers.Web3Provider(walletProvider);
      } else {
        web3Provider = new providers.Web3Provider(window.ethereum);
      }

      let signer = web3Provider.getSigner(0);

      let newInstance = new ethers.Contract(address, ABI, signer);

      // const contract = new web3Provider.eth.Contract(ABI, address);
      const name = await newInstance.name();
      const symbol = await newInstance.symbol();
      const decimals = await newInstance.decimals();
      const result = await TokenService.getLogo({ tokenAddress: address });
      const data = {
        address,
        name,
        symbol,
        decimals,
        logoUri: result.data,
      };
      setData(data);
    } catch (error) {
      console.log(error, "error getting token info");
      setError("Invalid address");
      ToastMessage("Not Found", "Invalid Address", "warning");
    } finally {
      setLoading(false);
    }
  };

  return {
    getTokenInfo,
    data,
    setData,
    error,
    loading,
  };
};

export const GetTokensHook = () => {
  const { data, setData, setError, loading, setLoading, error } = CommonHook();
  const token = BrowserUtility.get("token");

  const getTokens = async () => {
    try {
      setError(null);
      setLoading(true);
      const tokens = await TokenService.getTokens();
      setError(null);
      setData(tokens.data);
    } catch (error) {
      console.log(error, "error getting token ");
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    token && getTokens();
  }, [token]);

  return {
    data,
    error,
    loading,
    getTokens,
  };
};

export const AddTokenHook = () => {
  const { data, setData, setError, loading, setLoading, error } = CommonHook();

  const saveTokens = async (data) => {
    try {
      setLoading(true);
      const tokens = await TokenService.saveToken(data);
      setData(tokens);
    } catch (error) {
      console.log(error, "error getting token ");
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  return {
    saveTokens,
    data,
    error,
    loading,
  };
};

export const DeleteTokenHook = () => {
  const { data, setData, setError, loading, setLoading, error } = CommonHook();

  const deleteToken = async (id) => {
    try {
      setLoading(true);
      const tokens = await TokenService.deleteToken(id);
      setData(tokens);
    } catch (error) {
      console.log(error, "error getting token ");
      setError("error");
    } finally {
      setLoading(false);
    }
  };

  return {
    deleteToken,
    data,
    error,
    loading,
  };
};

export const NetworkTokensHook = () => {
  const { data, setData, setError, loading, setLoading, error } = CommonHook();

  const getTokens = async (network) => {
    try {
      setLoading(true);
      console.log(network, "network");
      const tokens = await TokenService.networkTokens(network);
      console.log("is tokens working", tokens);
      setData(tokens.data);
    } catch (error) {
      console.log(error, "error getting token ");
      setError("error");
    } finally {
      setLoading(false);
    }
  };

  return {
    getTokens,
    setData,
    data,
    error,
    loading,
  };
};
