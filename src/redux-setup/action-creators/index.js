export const addAuthenticateUser = (user) => {
  console.log(user)
  return (dispatch) => {
    dispatch({
      type: "authenticateUser",
      payload: user,
    });
  };
};
