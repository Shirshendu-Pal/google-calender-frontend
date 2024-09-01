import axios from "axios";
import { BASE_URL } from "./base";
import { resolveErrorMessage } from "./service";

const API = axios.create({ baseURL: BASE_URL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem("token")) {
    req.headers.token = localStorage.getItem("token");
  }
  return req;
});

const ApiCall = async (type, route, data) => {
  try {
    const apiFunctions = {
      post: API.post,
      get: API.get,
      patch: API.patch,
      delete: API.delete,
      put: API.put,
    };

    let response = await apiFunctions[type](route, data);
    var success = true;
    if (response?.data?.success) {
      return response?.data;
    }
  } catch (error) {
    success = false;
    return {
      success,
      error: resolveErrorMessage(error),
      status: error?.response?.status,
    };
  }
};

export default ApiCall;
