export const authenticateUser = (state = null, action) => {
    if (action.type === "authenticateUser") {
      return state  =  action.payload;
    }
   else {
      return state;
    }
  };
  
  