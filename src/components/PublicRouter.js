import meApi from "api/meApi";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

export const PublicRoute = ({ children }) => {
  //   const isLoggedIn = useSelector((state) => state.global.isLoggedIn);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    meApi.checkLogin(dispatch);
  }, [dispatch, navigate]);

  const isLoggedIn = useSelector((state) => state.global.isLoggedIn);

  useEffect(() => {
    setLoading(isLoggedIn);
  }, [isLoggedIn]);

  // if (!loading) {
  //   return <>{children}</>;
  // }
  // return <Navigate to="/" />;
  if (loading) {
    return <Navigate to="/" />;
  }
  return <>{children}</>;
};
