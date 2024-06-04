import React, { useState, useEffect } from "react";
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Root from "./pages/root";

//import ForgotPassword from "./pages/forgotPassword";
//import ResetPassword from "./pages/resetPassword";
import ProtectedRoute from "./router/ProtectedRoute";
import Loading from "./components/loading";
import authAPI from "./api/authAPI";
import { setUserSuccess, setUserFail } from "./features/auth/authSlice";
import { current, unwrapResult } from "@reduxjs/toolkit";
import { fetchNotification } from "./features/auth/notificationSlice";
import { adminRouter, employeeRouter, lecturerRouter, studentRouter } from "./router";
import { USER_ROLES } from "./utils/Constant";
import { toast } from "react-toastify";
import notificationSound from "./assets/sound/notification-sound.mp3";
import NotFoundPage from "./pages/NotFoundPage/index";
import Login from "./pages/login";
import io from "socket.io-client";
const socket = io('http://localhost:8080' ,{
  withCredentials: true,
});

function App() {
  const auth = useSelector((state) => state.auth);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const checkIsLogin = async () => {
    try {
      const response = await authAPI.checkLogin();
      dispatch(setUserSuccess(response.data));
      unwrapResult(await dispatch(fetchNotification()));
    } catch {
      dispatch(setUserFail);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    checkIsLogin();
    const setUserInteracted = () => setHasUserInteracted(true);
    document.addEventListener('mousedown', setUserInteracted);
    return () => {
        document.removeEventListener('mousedown', setUserInteracted);
    };
    
  }, []);

  useEffect(() => {
    if(auth.isAuth){
    if(auth?.currentUser?.account_id?.role_id?.id === 1 || auth?.currentUser?.account_id?.role_id?.id === 2){
    const handleLecturerBooking = async (data) => {
      if (!hasUserInteracted) return; // Don't play audio if the user hasn't interacted

      const audio = new Audio(notificationSound);
      audio.play();
      toast.success(data, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      try {
        unwrapResult(await dispatch(fetchNotification()));
      } catch (err) {
        console.log(err);
      }
    };

    socket.on("lecturerBooking", handleLecturerBooking);

    return () => {
      socket.off("lecturerBooking", handleLecturerBooking);
    };
  }}
  }, [auth, hasUserInteracted]);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <React.Fragment>
        <Route path="/login" element={<Login />} />
    
        {/*<Route path="/forget-password" element={<ForgotPassword />} />
    <Route path="/reset-password/:resetToken" element={<ResetPassword />} />*/ }
        <Route
          path="/"
          element={
            <ProtectedRoute >
              <Root />
            </ProtectedRoute>
          }
        >
          
          {auth.currentUser?.account_id?.role_id?.id === USER_ROLES.ADMIN
            ?(
              adminRouter.map((item) => {
                const Page = item.element;
                return <Route key={item.path} path={item.path} element={<Page />} />;
              })
            )
            :(  
              auth.currentUser?.account_id?.role_id?.id === USER_ROLES.EMPLOYEE
              ?(
                employeeRouter.map((item) => {
                  const Page = item.element;
                  return <Route key={item.path} path={item.path} element={<Page />} />;
                })
              )
              :(
                auth.currentUser?.account_id?.role_id?.id === USER_ROLES.LECTURER
                ?(
                  lecturerRouter.map((item) => {
                    const Page = item.element;
                    return <Route key={item.path} path={item.path} element={<Page />} />;
                  })
                )
                :(
                  studentRouter.map((item) => {
                    const Page = item.element;
                    return <Route key={item.path} path={item.path} element={<Page />} />;
                  })
                
                )
              )
            )    
          }
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </React.Fragment>,
    ),
  );
  return (
    <React.Fragment>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loading size={40} />
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
      
    </React.Fragment>
  );
}

export default App;
