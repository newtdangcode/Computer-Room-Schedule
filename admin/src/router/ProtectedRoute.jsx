import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { USER_ROLES } from "../utils/Constant";
import Loading from "../components/loading";

export default function ProtectedRoute({ children }) {
    const auth = useSelector((state) => state.auth);
    //const [isLoading, setIsLoading] = useState(true);
  
  // useEffect(() => {
  //   setTimeout(() => {
  //      setIsLoading(false);
  //   }, 0);
  //   console.log(auth.currentUser);
  // });
  



  return (
    

    <React.Fragment>

      {auth.isAuth ? (
          
          children
        ) : (
          <Navigate to="/login" />
        )}

      
    </React.Fragment>
    
   
  );
}
