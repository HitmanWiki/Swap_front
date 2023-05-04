

const queryString = require("query-string");

export class CommonUtility {

  static objectToParams(obj) {
    const str = queryString.stringify(obj);
    return str;
  }

  static validatePattern = (pattern, value) => {
    const regex = new RegExp(pattern);
    return regex.test(value);
  };

  static addressConvertor(address) {
    if ((address || "").length < 10) {
      return address || "";
    }
    return `${address.slice(0, 4)}...${address.slice(address.length - 6)}`;
  }

}
