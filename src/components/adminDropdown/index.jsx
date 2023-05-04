import React, { useEffect, useState } from "react";
import classesIndex from "./index.module.css";
import classesCustom from "./custom.module.css";
import Polygon from "../../assets/png/polygon.png";
import ArrowBottom from "../../assets/png/arrow-bottom.png";
import { chainsList } from "../../common/chainsList";
import { Dropdown as RDropdown } from "rsuite";

const Common = ({ defaultValue, unknownNetwork, chainId, getValue }) => {
  const logos = {
    0: "https://e7.pngegg.com/pngimages/1022/1019/png-clipart-question-mark-logo-question-mark-in-circle-icons-logos-emojis-question-marks.png",
    1: "https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/81d9f/eth-diamond-black.webp",
    25: "https://cronoscan.com/token/images/cryptocom_32.png",
    56: "https://crypto-central.io/library/uploads/BNB-300x300.png",
    137: "https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/DPYBKVZG55EWFHIK2TVT3HTH7Y.png",
    43114: "https://cryptologos.cc/logos/avalanche-avax-logo.png",
  };
  const options = {
    1: "Ethereum Mainnet",
    25: "Cronos Mainnet",
    56: "Binance Smart Chain",
    137: "Polygon Mainnet",
    43114: "Avalanche Mainnet",
  };

  function toHex(d) {
    return "0x" + Number(d).toString(16);
  }

  const changeChain = async (e) => {
    let token = Object.values(options).findIndex((el) => el === e);
    let chain = Object.keys(options)[token];
    console.log(chainId, chain, token, toHex(chain));

    if (Number(chainId) !== Number(chain)) {
      console.log("change chain");
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(chain) }],
        });
      } catch (error) {
        console.log(error);
        if (Number(error.code) === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: toHex(chain), // A 0x-prefixed hexadecimal string
                chainName: chainsList[chain].name,
                nativeCurrency: {
                  name: chainsList[chain].symbol,
                  symbol: chainsList[chain].symbol, // 2-6 characters long
                  decimals: chainsList[chain].decimals,
                },
                rpcUrls: chainsList[chain].rpc,
                blockExplorerUrls: [chainsList[chain].explorers],
              },
            ],
          });
        }
      }
    }
  };

  const [value, setValue] = useState(
    defaultValue || { label: "", value: "", icon: "" }
  );
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  useEffect(() => {
    if (getValue) getValue(value);
  }, [value, getValue]);

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const chooseNewOption = (option) => {
    console.log(option);
    setValue(option);
    setIsOptionsOpen(false);
  };

  return (
    <div className={classesIndex["dropdown-wrapper"]}>
      <div
        onClick={toggleOptions}
        className={classesIndex["dropdown-value-container"]}
      >
        <img
          src={unknownNetwork ? logos[0] : logos[chainId]}
          alt="chain logo"
        />
        <p>{unknownNetwork ? "Unknown Network" : options[chainId]}</p>
        <div className={classesIndex["dropdown-arrow"]}>
          <img src={Polygon} alt="arrow" />
        </div>
      </div>
      {isOptionsOpen && (
        <div className={classesIndex["dropdown-options-container"]}>
          {Object.values(options).map((option) => (
            <div
              key={`--option-${option.value}-${option.icon}`}
              onClick={() => changeChain(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Custom = ({
  defaultValue,
  getValue,
  getLogo,
  dropdownHandler,
  options,
  chainId,
  networkTokens,
}) => {
  const [value, setValue] = useState("Set Value");
  const [isOptionsOpen, setIsOptionsOpen] = useState(false);

  // useEffect(() => {
  //   if (getValue) getValue(value);
  // }, [value, getValue]);

  // useEffect(() => {
  //   setValue(defaultValue);
  // }, [defaultValue]);

  const toggleOptions = () => {
    setIsOptionsOpen(!isOptionsOpen);
  };

  const chooseNewOption = (option) => {
    console.log("dropdown change", option);
    setValue(option.token);
    getLogo(option?.token);
    setIsOptionsOpen(false);
  };

  return (
    <div className={classesCustom["dropdown-wrapper"]}>
      <div
        onClick={toggleOptions}
        className={classesCustom["dropdown-value-container"]}
      >
        <p>{value}</p>
        <div className={classesCustom["dropdown-arrow"]}>
          <img src={ArrowBottom} alt="arrow" />
        </div>
      </div>
      {isOptionsOpen && (
        <div className={classesIndex["dropdown-options-container"]}>
          {networkTokens?.map((option) => (
            <div
              key={`--option-${option.token}`}
              onClick={() => chooseNewOption(option)}
            >
              {option.token}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminDropdown = {
  Common,
  Custom,
};

export default AdminDropdown;
