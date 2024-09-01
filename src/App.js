import React, { useState, lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import MainRoutes from "./Routes/MainRoutes";
import useVerifyUser from "./Helpers/custom-hooks/useVerifyUser";
import { useSelector } from "react-redux";
import { PrivateRoutes } from "./Routes/PrivateRoutes";
import { Toaster } from "react-hot-toast";
import Home from "./Pages/Home/Home";
import Login from "./Pages/Auth/Login";
function App() {

  const [mainLoader, setmainLoader] = useState(true);
  const user = useSelector((state) => state.user);
  const refreshToken = localStorage.getItem("token");
  useVerifyUser(refreshToken, setmainLoader);
  return (
    <>
     <Routes>
      <Route
        path={MainRoutes.LOGIN}
        element={user ? <Navigate to={MainRoutes.HOME} /> : <Login />}
      />
      <Route element={<PrivateRoutes user={user} />}>
        {/* <Route path="*" element={<User user={user} />} /> */}
        <Route path={MainRoutes.HOME} element={<Home user={user} />} />
        {/* <Route path={MainRoutes.CUSTOMER} element={<AllUser />} /> */}
      </Route>
    </Routes>
     <Toaster
     position="top-center"
     reverseOrder={false}
     //  gutter={3}
     toastOptions={{
       // Define default options
       className: "",
       duration: 5000,
     }}
   />
    </>
  );
}

export default App;
