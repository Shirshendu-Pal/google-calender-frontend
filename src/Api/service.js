
export const resolveErrorMessage = (error) => {
  console.log("error?.response?.status", error?.response?.status);
  let message = "";
  console.log({ error });
  if (typeof error == "string") {
    message = error;
  } else if (typeof error.response?.data === "string") {
    message = error.response.data;
  } else if (typeof error.response?.data.message === "string") {
    console.log(error.response.data.message);
    message = error.response.data.message;
  } else {
    message = error.message;
  }
  if (
    message === "jwt expired" ||
    message === "Token not found." ||
    error?.response?.status === 401 ||
    error?.response?.status === 426 ||
    error?.response?.status === 401
  ) {
    localStorage.clear(); 
    window.location.href = "/";
  }
  return message;
};

