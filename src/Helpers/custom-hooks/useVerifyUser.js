import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AuthEndPoints } from "../../Api/Endpoints";
import ApiCall from "../../Api/ApiCall";
import { actionCreators } from "../../redux-setup";


const useVerifyUser = (refreshToken,setmainLoader) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const handleAuthenticateUser = async () => {
      if (refreshToken) {
        try {
          console.log("***Logged in Success.Token Verified***");
          const res = await ApiCall("get", AuthEndPoints.verifyUser, {
            params: { token: refreshToken },
          });
          if (res?.success) {
            dispatch(actionCreators.addAuthenticateUser(res.result));
          }
        } catch (error) {
          console.error("Error verifying user", error);
        } finally {
          setmainLoader(false);
        }
      } else {
        setmainLoader(false);
      }
        }
        
    handleAuthenticateUser();
  }, [refreshToken, dispatch]);
};

export default useVerifyUser;
