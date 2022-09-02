import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import axios from "../../api/axios";

import { useAuth } from "../../context/AuthContext";
import useAxiosFunction from "../axios/useAxiosFunction";

import { showSuccessNotification } from "../../utils/notifications";

const useRegister = () => {
  const [response, error, loading, axiosFetch] = useAxiosFunction();

  const { setUser, csrf, getCsrf } = useAuth();
  const navigate = useNavigate();

  const register = (data) => {
    axiosFetch({
      axiosInstance: axios,
      method: "post",
      url: "/auth/register/",
      requestConfig: data,
      requestExtraConfig: {
        headers: {
          "Content-Type": "multipart/form-data",
          "X-CSRFToken": csrf,
        },
      },
    });
  };

  useEffect(() => {
    if (!response) return;

    getCsrf();
    setUser(response);
    navigate("/", { replace: true });
    showSuccessNotification("Your account has been created.");
  }, [response]);

  return [register, error, loading];
};

export default useRegister;
