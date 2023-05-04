import { BaseService } from "./baseService";
import { APIPath } from "../utility/constant";
import { CommonUtility } from "../utility/commonUtility";

class Tokens {
  getLogo = (data) => {
    const reqParams = CommonUtility.objectToParams(data);
    return BaseService.get(`${APIPath.getLogo}?${reqParams}`);
  };
  saveToken = (data) => {
    return BaseService.post(APIPath.saveToken, data);
  };
  getTokens = (network) => {
    return BaseService.get(APIPath.getTokens);
  };
  networkTokens = (network) => {
    return BaseService.get(`/${APIPath.networkToken}/${network}`);
  };
  deleteToken = (id) => {
    return BaseService.delete(`${APIPath.removeToken}/${id}`);
  };
}
const TokenService = new Tokens();
Object.freeze(TokenService);
export { TokenService };
