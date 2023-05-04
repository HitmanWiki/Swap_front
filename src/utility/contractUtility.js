
export class ContractUtility {
  
  static getSymbol(chainId) {
    switch (chainId) {
      case "eth":
      case "1":
      case "rinkeby":  
        return "ETH";
      case "56":
      case "bsc testnet":
        return "BNB";
      case "43114":
        return "AVAX";
      case "137":
      case "mumbai":
        return "MATIC";
      case "25":
          return "CRO";  
      default:
        return "";
    }
  }

}
