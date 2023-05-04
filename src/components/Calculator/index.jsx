import React, { useState, useEffect } from "react";
import Contract from "web3-eth-contract";
import classes from "./index.module.css";
import ethIcon from "../../assets/png/ehtIcon.png";
import inchIcon from "../../assets/png/inchIcon.png";
import binanceIcon from "../../assets/png/binanceIcon.png";
import CalculatorConvertationItem from "./CalculatorConvertationItem";
import Dropdown from "../Dropdown";
import { ethers, providers } from "ethers";
import { router, factory, providerRpc } from "../../common/addresses";
import { factoryAbi, routerAbi, ercAbi } from "../../common/abis";
import { toast } from "react-toastify";

const Calculator = ({
  unknownNetwork,
  chainId,
  wallet,
  walletProvider,
  setIsShowWalletModal,
  userAddress,
  networkTokens,
  setData,
  showModal,
}) => {
  const [options, setOptions] = useState(networkTokens[0]);

  const [isInputsReverted, setIsInputsReverted] = useState(false);
  const [firstInputValue, setFirstInputValue] = useState(0);
  const [secondInputValue, setSecondInputValue] = useState(0);
  const [dropdownOneImg, setDropdownOneImg] = useState(
    networkTokens[0].logoURI
  );
  const [dropdownTwoImg, setDropdownTwoImg] = useState(
    networkTokens[1].logoURI
  );
  const [addressIn, setAddressIn] = useState(networkTokens[0].address);
  const [symbolIn, setSymbolIn] = useState(networkTokens[0].symbol);
  const [decimalsOut, setDecimalsOut] = useState(networkTokens[0].decimals);
  const [addressOut, setAddressOut] = useState(networkTokens[1].address);
  const [symbolOut, setSymbolOut] = useState(networkTokens[1].symbol);
  const [decimalsIn, setDecimalsIn] = useState(networkTokens[1].decimals);
  const [tokenIn, setTokenIn] = useState({
    balance: "0",
    isAllowed: false,
  });
  const [tokenOut, setTokenOut] = useState({
    balance: "0",
    isAllowed: false,
  });
  const [slippage, setSlippage] = useState(20);
  const [slippageEdit, setSlippageEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enoughAllowance, setEnoughAllowance] = useState(true);
  const [trade, setTrade] = useState({
    amountIn: "",
    amountOut: "",
    amountOutMin: "",
    slippage: "30",
  });
  const [exchangeRate, setExchangeRate] = useState("");
  const [gasPrice, setGasPrice] = useState("");

  useEffect(() => {
    setDropdownOneImg(networkTokens[0].logoURI);
    setAddressIn(networkTokens[0].address);
    setDecimalsIn(networkTokens[0].decimals);
    setSymbolIn(networkTokens[0].symbol);

    setDropdownTwoImg(networkTokens[1].logoURI);
    setAddressOut(networkTokens[1].address);
    setDecimalsOut(networkTokens[1].decimals);
    setSymbolOut(networkTokens[1].symbol);

    getBalances();
  }, [networkTokens]);

  const dropdownHandlerOne = (selectedOption) => {
    // let token = tokens[chainId].find(
    //   (el) => selectedOption.value === el.symbol
    // );
    getTokenBalance(selectedOption.value.address, "first");
    setDropdownOneImg(selectedOption.value.logoURI);
    setAddressIn(selectedOption.value.address);
    setSymbolIn(selectedOption.value.symbol);
    setDecimalsIn(selectedOption.value.decimals);
  };

  const dropdownHandlerTwo = (selectedOption) => {
    // let token = tokens[chainId].find(
    //   (el) => selectedOption.value === el.symbol
    // );
    getTokenBalance(selectedOption.value.address, "second");
    setDropdownTwoImg(selectedOption.value.logoURI);
    setAddressOut(selectedOption.value.address);
    setSymbolOut(selectedOption.value.symbol);
    setDecimalsOut(selectedOption.value.decimals);
  };

  const setImg = (img) => {
    return img === "inchIcon" ? inchIcon : ethIcon;
  };

  const getSwapAmount = async (type, amount) => {
    // let provider = new ethers.providers.JsonRpcProvider(providerRpc[chainId]);
    // console.log(chainId, "chainId", providerRpc[chainId]);
    // let routerInstance = new ethers.Contract(
    //   router[chainId],
    //   routerAbi,
    //   provider
    // );
    Contract.setProvider(providerRpc[chainId]);
    const routerInstance = new Contract(routerAbi, router[chainId]);
    let WETH =
      Number(chainId) !== 43114
        ? await routerInstance.methods.WETH().call()
        : await routerInstance.methods.WAVAX().call();
    // let inDecimals = tokens[chainId].find(
    //   (el) => el.address === addressIn
    // ).decimals;
    // let outDecimals = tokens[chainId].find(
    //   (el) => el.address === addressOut
    // ).decimals;

    let path;

    switch (type) {
      case "first":
        if (amount > 0) {
          if (addressIn === "0x0000000000000000000000000000000000000000") {
            path = [WETH, addressOut];
          } else if (
            addressOut === "0x0000000000000000000000000000000000000000"
          ) {
            path = [addressIn, WETH];
          } else {
            path = [addressIn, WETH, addressOut];
          }
          let amountsOut = await routerInstance.methods
            .getAmountsOut(ethers.utils.parseUnits(amount, decimalsIn), path)
            .call();

          return ethers.utils.formatUnits(amountsOut.at(-1), decimalsOut);
        }
        break;
      case "second":
        if (amount > 0) {
          if (addressOut === "0x0000000000000000000000000000000000000000") {
            path = [addressIn, WETH];
          } else if (
            addressIn === "0x0000000000000000000000000000000000000000"
          ) {
            path = [WETH, addressOut];
          } else {
            path = [addressIn, WETH, addressOut];
          }
          let amountsIn = await routerInstance.methods
            .getAmountsIn(ethers.utils.parseUnits(amount, decimalsOut), path)
            .call();
          return ethers.utils.formatUnits(amountsIn[0], decimalsIn);
        }
        break;

      default:
        break;
    }
  };

  const approveToken = async () => {
    setIsLoading(true);
    try {
      let web3Provider;

      if (wallet === "WALLET_CONNECT") {
        web3Provider = new providers.Web3Provider(walletProvider);
      } else {
        web3Provider = new providers.Web3Provider(window.ethereum);
      }

      let signer = web3Provider.getSigner(0);

      let newInstance = new ethers.Contract(
        !isInputsReverted ? addressIn : addressOut,
        ercAbi,
        signer
      );

      let receipt = await newInstance.approve(
        router[chainId],
        "115792089237316195423570985008687907853269984665640564039457584007913129639935"
      );
      setIsLoading(false);
      return receipt;
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleSwap = async () => {
    setIsLoading(true);
    try {
      console.log("swap");

      if (addressIn === addressOut) {
        throw "Address in and out are the same";
      }
      let exchangeType;

      if (addressIn === "0x0000000000000000000000000000000000000000") {
        exchangeType = !isInputsReverted ? "ETHtoToken" : "tokenToEth";
      } else if (addressOut === "0x0000000000000000000000000000000000000000") {
        exchangeType = !isInputsReverted ? "tokenToEth" : "ETHtoToken";
      } else {
        exchangeType = "tokenToToken";
      }

      // let inDecimals = tokens[chainId].find(
      //   (el) => el.address === addressIn
      // ).decimals;
      // let outDecimals = tokens[chainId].find(
      //   (el) => el.address === addressOut
      // ).decimals;

      let amountIn = ethers.utils.parseUnits(
        !isInputsReverted
          ? Number(firstInputValue).toString()
          : Number(secondInputValue).toString(),
        !isInputsReverted ? decimalsIn : decimalsOut
      );
      let amountOutMin = ethers.utils.parseUnits(
        !isInputsReverted
          ? truncate(
              secondInputValue - (secondInputValue * slippage) / 100,
              6
            ).toString()
          : truncate(
              firstInputValue - (firstInputValue * slippage) / 100,
              6
            ).toString(),
        !isInputsReverted ? decimalsOut : decimalsIn
      );

      let web3Provider;

      if (wallet === "WALLET_CONNECT") {
        web3Provider = new providers.Web3Provider(walletProvider);
      } else {
        web3Provider = new providers.Web3Provider(window.ethereum);
      }

      let signer = web3Provider.getSigner(0);

      let routerInstance = new ethers.Contract(
        router[chainId],
        routerAbi,
        signer
      );

      let WETH =
        Number(chainId) !== 43114
          ? await routerInstance.WETH()
          : await routerInstance.WAVAX();
      let path = !isInputsReverted
        ? [addressIn, addressOut]
        : [addressOut, addressIn];

      if (addressIn === "0x0000000000000000000000000000000000000000") {
        path = !isInputsReverted ? [WETH, addressOut] : [addressOut, WETH];
      } else if (addressOut === "0x0000000000000000000000000000000000000000") {
        path = !isInputsReverted ? [addressIn, WETH] : [WETH, addressIn];
      }

      let tx;
      let deadline = Date.now() + 1000 * 60 * 10;
      let gasLimit = 300000;

      if (exchangeType === "ETHtoToken") {
        tx =
          await routerInstance.swapExactETHForTokensSupportingFeeOnTransferTokens(
            amountOutMin,
            path,
            userAddress,
            deadline,
            { value: amountIn, gasLimit }
          );
      } else if (exchangeType === "tokenToEth") {
        tx =
          await routerInstance.swapExactTokensForETHSupportingFeeOnTransferTokens(
            amountIn,
            amountOutMin,
            path,
            userAddress,
            deadline,
            { gasLimit }
          );
      } else if (exchangeType === "tokenToToken") {
        if (path[0] !== WETH && path[1] !== WETH) {
          path[2] = path[1];
          path[1] = WETH;
        }
        tx =
          await routerInstance.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountIn,
            amountOutMin,
            path,
            userAddress,
            deadline,
            { gasLimit }
          );
      }

      let receipt = await tx.wait();
      getBalances();
      setIsLoading(false);
      return receipt;
    } catch (error) {
      console.log(error, "handleSwap");
    }
    setIsLoading(false);
  };

  const truncate = (value, numDecimalPlaces) =>
    Math.trunc(value * Math.pow(10, numDecimalPlaces)) /
    Math.pow(10, numDecimalPlaces);

  const getTokenBalance = async (address, type) => {
    if (!userAddress) {
      return;
    }
    let provider = new ethers.providers.JsonRpcProvider(providerRpc[chainId]);

    let tokenInstance = new ethers.Contract(address, ercAbi, provider);

    let balance;
    let isAllowed;

    if (address === "0x0000000000000000000000000000000000000000") {
      balance = await provider.getBalance(userAddress);
      isAllowed = true;
    } else {
      balance = await tokenInstance.balanceOf(userAddress);
      let allowance = await tokenInstance.allowance(
        userAddress,
        router[chainId]
      );
      isAllowed = Number(allowance) > 0;
    }

    switch (type) {
      case "first":
        setTokenIn({
          balance: Number(balance / 10 ** 18),
          isAllowed,
        });
        break;
      case "second":
        setTokenOut({
          balance: Number(balance / 10 ** 18),
          isAllowed,
        });
        break;

      default:
        break;
    }
  };

  const handleInputChange = async (e, type) => {
    let amount = parseFloat(e).toString();
    switch (type) {
      case "first":
        setFirstInputValue(amount);
        setSecondInputValue(await getSwapAmount(type, amount));
        break;
      case "second":
        setSecondInputValue(amount);
        setFirstInputValue(await getSwapAmount(type, amount));
        break;

      default:
        break;
    }
  };

  const getBalances = async () => {
    if (userAddress) {
      getTokenBalance(addressIn, "first");
      getTokenBalance(addressOut, "second");
    }
  };

  const getExchangeRate = async () => {
    let type = !isInputsReverted ? "first" : "second";
    let rate = await getSwapAmount(type, "1");
    setExchangeRate(rate);
    let provider = new ethers.providers.JsonRpcProvider(providerRpc[chainId]);
    setGasPrice(
      ethers.utils.formatUnits(await provider.getGasPrice()) * 200000
    );
  };

  const addToken = async (newAddress) => {
    let isAddress = ethers.utils.isAddress(newAddress);
    if (!isAddress) {
      toast.error(`Address ${newAddress} is not a valid token address`);
      console.log(`Address ${newAddress} is not a valid token address`);
      return;
    }
    let isAdded = networkTokens.some(
      (el) => el.address.toLowerCase() === newAddress.toLowerCase()
    );
    if (isAdded) {
      toast.error("Token already in the list")
      console.log("Token already in the list");
      return;
    }
    let provider = new ethers.providers.JsonRpcProvider(providerRpc[chainId]);
    let newInstance = new ethers.Contract(newAddress, ercAbi, provider);

    try {
      const name = await newInstance.name();
      const symbol = await newInstance.symbol();
      const decimals = await newInstance.decimals();
      let temp = [...networkTokens];
      temp.push({
        address: newAddress,
        decimals,
        logoURI: "https://etherscan.io/images/main/empty-token.png",
        name,
        network: chainId,
        symbol,
      });
      setData([...temp]);
      console.log(`Token Addedd:`, {
        name,
        symbol,
        decimals,
        address: newAddress,
      });
      toast.success("Token Added");
    } catch (error) {
      toast.error(`cannot find token ${newAddress}`);
      console.log(`cannot find token ${newAddress}, error:`, error);
    }
  };

  // useEffect(() => {
  //   dropdownHandlerOne({ value: options[0] });
  //   dropdownHandlerTwo({ value: options[1] });
  // }, []);

  useEffect(() => {
    getBalances();
  }, [userAddress]);

  // useEffect(() => {
  //   setAddressIn(tokens[chainId][0].address);
  //   setAddressOut(tokens[chainId][1].address);
  //   setOptions(tokens[chainId].map((el) => el.symbol));
  //   setDropdownOneImg(tokens[chainId][0].logoURI);
  //   setDropdownTwoImg(tokens[chainId][1].logoURI);
  //   setSymbolIn(tokens[chainId][0].symbol);
  //   setSymbolOut(tokens[chainId][1].symbol);
  //   getExchangeRate();
  // }, [chainId]);

  useEffect(() => {
    getExchangeRate();
  }, [addressIn, addressOut, isInputsReverted]);

  const switchInputs = () => {
    setIsInputsReverted((prev) => !prev);
  };

  return (
    <div className={classes["calculator-wrapper"]}>
      <h2 className={classes["calculator-header"]}>BANANA SWAP</h2>
      <div className={classes["calculator-dropdown"]}>
        {userAddress ? (
          <Dropdown.Common unknownNetwork={unknownNetwork} chainId={chainId} />
        ) : (
          <button
            className={classes["calc-button"]}
            onClick={() => setIsShowWalletModal(true)}>
            Connect Wallet
          </button>
        )}
      </div>
      <div className={classes["calculator-container"]}>
        <div className={`${classes["left-side"]} ${classes["card-default"]}`}>
          <div className={classes["justify-between"]}>
            <h2 className={classes["conversion-header"]}>Pay</h2>
            <div className={classes["buttons-group"]}>
              <button
                className={classes["convertation-item"]}
                onClick={(e) => {
                  handleInputChange(0.1, "first");
                }}>
                MIN
              </button>
              <button
                className={classes["convertation-item"]}
                onClick={(e) => {
                  handleInputChange(Number(tokenIn.value ?? 0) / 2, "first");
                }}>
                HALF
              </button>
              <button
                className={classes["convertation-item"]}
                onClick={(e) => {
                  handleInputChange(tokenIn.value ?? 0, "first");
                }}>
                MAX
              </button>
            </div>
          </div>
          {!isInputsReverted ? (
            <CalculatorConvertationItem
              text="From"
              dropdownHandler={dropdownHandlerOne}
              dropdownImg={dropdownOneImg}
              defaultOption={options[0]}
              options={options}
              setImg={setImg}
              networkTokens={networkTokens}
              chainId={chainId}
              wallet={wallet}
              addToken={addToken}
              walletProvider={walletProvider}>
              <div className={classes["balance-container"]}>
                <p>
                  Balance: {truncate(tokenIn.balance, 6)} {symbolIn}{" "}
                </p>
              </div>
              <div className={classes["calc-input-container"]}>
                <input
                  type="number"
                  // value={truncate(firstInputValue, 4)}
                  value={firstInputValue}
                  onChange={(e) => handleInputChange(e.target.value, "first")}
                  className={classes["calc-input"]}
                />
              </div>
            </CalculatorConvertationItem>
          ) : (
            <CalculatorConvertationItem
              text="From"
              dropdownHandler={dropdownHandlerTwo}
              dropdownImg={dropdownTwoImg}
              defaultOption={options[1]}
              options={options}
              networkTokens={networkTokens}
              setImg={setImg}
              walletProvider={walletProvider}
              chainId={chainId}
              wallet={wallet}>
              <div className={classes["balance-container"]}>
                <p>
                  {" "}
                  Balance: {truncate(tokenOut.balance, 6)} {symbolIn}
                </p>
              </div>
              <div className={classes["calc-input-container"]}>
                <input
                  type="number"
                  value={secondInputValue}
                  // value={truncate(secondInputValue, 4)}
                  onChange={(e) => handleInputChange(e.target.value, "second")}
                  className={classes["calc-input"]}
                />
              </div>
            </CalculatorConvertationItem>
          )}
        </div>
        <button className={classes["reverse-button"]} onClick={switchInputs} />
        <div className={`${classes["right-side"]} ${classes["card-default"]}`}>
          <div className={classes["justify-between"]}>
            <h2 className={classes["conversion-header"]}>Receive</h2>
            <div className={classes["buttons-group"]}>
              <button
                className={classes["convertation-item"]}
                onClick={(e) => {
                  handleInputChange(0.1, "second");
                }}>
                MIN
              </button>
              <button
                className={classes["convertation-item"]}
                onClick={(e) => {
                  handleInputChange(Number(tokenOut.value ?? 0) / 2, "second");
                }}>
                HALF
              </button>
              <button
                className={classes["convertation-item"]}
                onClick={(e) => {
                  handleInputChange(tokenOut.value ?? 0, "second");
                }}>
                MAX
              </button>
            </div>
          </div>
          {!isInputsReverted ? (
            <CalculatorConvertationItem
              text="To"
              dropdownHandler={dropdownHandlerTwo}
              dropdownImg={dropdownTwoImg}
              defaultOption={symbolOut}
              // defaultOption={options[1]}
              options={options}
              networkTokens={networkTokens}
              setImg={setImg}
              walletProvider={walletProvider}
              chainId={chainId}
              wallet={wallet}>
              <div className={classes["balance-container"]}>
                <p>
                  {" "}
                  Balance: {truncate(tokenOut.balance, 6)} {symbolOut}
                </p>
              </div>
              <div className={classes["calc-input-container"]}>
                <input
                  type="number"
                  value={secondInputValue}
                  // value={truncate(secondInputValue, 4)}
                  onChange={(e) => handleInputChange(e.target.value, "second")}
                  className={classes["calc-input"]}
                />
              </div>
              {/* <p className={classes["total"]}>12, 675.64</p> */}
            </CalculatorConvertationItem>
          ) : (
            <CalculatorConvertationItem
              text="To"
              dropdownHandler={dropdownHandlerOne}
              dropdownImg={dropdownOneImg}
              defaultOption={options[0]}
              options={options}
              setImg={setImg}
              chainId={chainId}
              networkTokens={networkTokens}
              walletProvider={walletProvider}
              wallet={wallet}>
              <div className={classes["balance-container"]}>
                <p>
                  Balance: {truncate(tokenIn.balance, 6)} {symbolOut}
                </p>
              </div>
              <div className={classes["calc-input-container"]}>
                <input
                  type="number"
                  value={truncate(firstInputValue, 4)}
                  onChange={(e) => handleInputChange(e.target.value, "first")}
                  className={classes["calc-input"]}
                />
              </div>
              {/* <p className={classes["total"]}>3, 063</p> */}
            </CalculatorConvertationItem>
          )}
        </div>
      </div>
      <div className={classes["justify-between"]}>
        <p className={classes["conversion-ratio"]}>
          {truncate(isInputsReverted ? secondInputValue : firstInputValue, 6)}{" "}
          {symbolIn} ={" "}
          {truncate(isInputsReverted ? firstInputValue : secondInputValue, 6)}{" "}
          {symbolOut}
        </p>
        <div className={classes["slippage-box"]}>
          <button
            onClick={() => setSlippageEdit(!slippageEdit)}
            className={classes["slippage-button"]}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M6.66663 16.6667C5.14601 16.6675 3.81761 15.639 3.43746 14.1667H1.66663V12.5H3.43829C3.87133 10.8229 5.51672 9.7569 7.22436 10.0472C8.932 10.3374 10.1328 11.8872 9.98734 13.6132C9.84192 15.3392 8.39876 16.6662 6.66663 16.6667ZM6.66663 11.6667C5.75612 11.6676 5.01487 12.3991 5.00182 13.3095C4.98877 14.2199 5.70876 14.9723 6.61887 14.9993C7.52897 15.0263 8.29232 14.3179 8.33329 13.4084V13.7417V13.3334C8.33329 12.4129 7.5871 11.6667 6.66663 11.6667ZM18.3333 14.1667H10.8333V12.5H18.3333V14.1667ZM10.8333 10C9.31298 10.0004 7.98504 8.97206 7.60496 7.50002H1.66663V5.83336H7.60496C8.03799 4.15623 9.68339 3.09023 11.391 3.38049C13.0987 3.67075 14.2994 5.22054 14.154 6.94655C14.0086 8.67257 12.5654 9.99958 10.8333 10ZM10.8333 5.00002C9.92279 5.00095 9.18153 5.7324 9.16849 6.64281C9.15544 7.55322 9.87543 8.30561 10.7855 8.33262C11.6956 8.35964 12.459 7.65127 12.5 6.74169V7.07502V6.66669C12.5 5.74622 11.7538 5.00002 10.8333 5.00002ZM18.3333 7.50002H15V5.83336H18.3333V7.50002Z"
                fill="white"
              />
            </svg>
          </button>
          {slippageEdit ? (
            <input
              className={classes["slippage-input"]}
              type="number"
              value={slippage}
              onChange={(e) => setSlippage(e.target.value)}
              name=""
              id=""
            />
          ) : (
            <span className={classes["slippage-button"]}>{slippage}%</span>
          )}
        </div>
      </div>
      {/* {!isWalletConnected ? (
        <button className={classes["calc-button"]} onClick={() => showModal()}>
          CONNECT WALLET
        </button>
      ) : (
        <button
          className={classes["calc-button"]}
          disabled={unknownNetwork || isLoading}
          onClick={
            // userAddress ? handleSwap : () => setIsShowWalletModal(true)
            userAddress
              ? !isInputsReverted
                ? tokenIn.isAllowed
                  ? handleSwap
                  : approveToken
                : tokenOut.isAllowed
                ? handleSwap
                : approveToken
              : () => setIsShowWalletModal(true)
          }
        >
          {userAddress
            ? !isInputsReverted
              ? tokenIn.isAllowed
                ? "Swap"
                : "Approve Token"
              : tokenOut.isAllowed
              ? "Swap"
              : "Approve Token"
            : "Connect Wallet"}
        </button>
      )} */}
      {userAddress && (
        <button
          className={classes["calc-button"]}
          disabled={unknownNetwork || isLoading}
          onClick={
            // userAddress ? handleSwap : () => setIsShowWalletModal(true)
            !isInputsReverted
              ? tokenIn.isAllowed
                ? handleSwap
                : approveToken
              : tokenOut.isAllowed
              ? handleSwap
              : approveToken
          }>
          {!isInputsReverted
            ? tokenIn.isAllowed
              ? "Swap"
              : "Approve Token"
            : tokenOut.isAllowed
            ? "Swap"
            : "Approve Token"}
        </button>
      )}
    </div>
  );
};

export default Calculator;
