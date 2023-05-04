import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastMessage } from "../components/toastMessage";
import { AdminService } from "../services/adminServices";
import { BrowserUtility } from "../utility/browserUtility";
import { AuthType } from "../utility/constant";
import { CommonHook } from "./commonHook";

export const LoginHook = () => {
  const { data, setData, setError, loading, setLoading, error } = CommonHook();
  const navigate = useNavigate()

  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await AdminService.login(credentials);
      setData(result.data);
      BrowserUtility.save('token', result.data?.token)
      navigate('/tokens')
    } catch (error) {
      setError(error);
      setLoading(false)
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    data,
    loading,
    error,
  };
};


export const CheckAuthHook = (type) => {
  const { loading, setLoading, setData, data } = CommonHook();
  const navigate = useNavigate()

  const authenticate = async () => {
    try {
      setLoading(true)
      const auth = await AdminService.auth()
      if (auth.data && type === AuthType.LOGIN_PAGE) {

        navigate('/tokens') //navigate to admin's home screen
      }
      setData(auth.data)
    }
    catch (error) {
      if (type === AuthType.ADMIN_PAGE) {
        console.log("logged in")
        navigate('/admin-login')
      }
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    authenticate()
  }, [])

  return {
    authLoading: loading,
    data
  }

};

export const LogoutHook = () => {
  const { loading, setLoading, setData, data, setError, error } = CommonHook();

  const navigate = useNavigate();

  const logout = async () => {
    try {
      setLoading(true);
      const result = await AdminService.logout();
      setData(result.data);
      BrowserUtility.remove('token')
      navigate('/admin-login')
    } catch (error) {
      setError(error);
      ToastMessage('Error', error.error, "error")
      setLoading(false)
    } finally {
      setLoading(false);
    }
  };

  return {
    logout,
    logoutLoading: loading,
  };
};
