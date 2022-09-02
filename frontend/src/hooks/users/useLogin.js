import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import axios from "../../api/axios";
import useAxiosFunction from "../axios/useAxiosFunction";
import { useAuth } from "../../context/AuthContext";

const useLogin = () => {
  const [response, error, loading, axiosFetch] = useAxiosFunction();

  const { setUser, csrf, getCsrf } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const login = ({ username, password }) => {
    axiosFetch({
      axiosInstance: axios,
      method: "post",
      url: "/auth/login/",
      requestConfig: {
        username,
        password,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf,
        },
      },
    });
  };

  useEffect(() => {
    if (!response) return;

    getCsrf();
    setUser(response);
    navigate(location.state?.from || "/", { replace: true });
  }, [response]);

  return [login, error, loading];
};

export default useLogin;
