import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import MainRoutes from "../../Routes/MainRoutes";
import { useNavigate, useParams } from "react-router-dom";
import { startApiCall } from '../../Helpers/globalFunctions';
import {AuthEndPoints}  from "../../Api/Endpoints"
import ApiCall from "../../Api/ApiCall";
import toast from "react-hot-toast";
import ApiLoader from "../../Components/Loaders/ApiLoader";
import { resolveErrorMessage } from "../../Api/service";
import { GoogleLogin , useGoogleLogin } from "@react-oauth/google";

const Login = () => {
  const navigate = useNavigate();
  const [firstName, setfirstName] = useState("");
  const [password, setpassword] = useState("")
  const [errorMessage, seterrorMessage] = useState("");
  const [loader, setLoader] = useState(false);
  

  const signIn = async (code) => {
    startApiCall(seterrorMessage, setLoader);
    const data = {
      code
    };
    const res = await ApiCall("post", AuthEndPoints.userLogin, data);
    console.log(res)
    if (res?.success) {
      toast.loading("Login Success");
      let data = res?.result
      let refreshToken = data.tokens.refresh_token ;
      localStorage.setItem("token", refreshToken);
      window.location.href = MainRoutes.HOME;
    } else {
      seterrorMessage(resolveErrorMessage(res.error));
      setLoader(false);
    }
  };
  
  const loginGoogle = useGoogleLogin({
    onSuccess: (codeResponse) => {
      console.log("here", codeResponse)
      signIn(codeResponse.code)
    },
    flow: 'auth-code',
    scope:"openid email profile https://www.googleapis.com/auth/calendar"
  });



  return (
    <>
    <div className="ja-iccha">
    <h1>Hi</h1>
     <button className="signup-btn" onClick={() => loginGoogle()}>Sign in with Google 🚀</button>
     </div>
    </>
  );
};

export default Login;
