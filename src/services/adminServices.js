import { BaseService } from "./baseService";
import { APIPath } from "../utility/constant/apiPath";

class Admin {
  login = (data) => {
    return BaseService.post(APIPath.login, data);
  };
  logout = () => {
    return BaseService.post(APIPath.logout);
  };
  auth = () => {
    return BaseService.get(APIPath.auth);
  };
}

const AdminService = new Admin();
Object.freeze(AdminService);
export { AdminService };
