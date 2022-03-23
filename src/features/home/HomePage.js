import { Backdrop, Box, CircularProgress } from "@mui/material";
import meApi from "api/meApi";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { init, socket } from "utils/socketClient";
import SideBar from "./components/SideBar";

init();

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.global.currentUser);

  const location = useLocation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = currentUser?.id;
    if (userId) {
      // console.log(userId);
      socket.emit("join", { userId });
      return () => {
        socket.emit("leave");
      };
    }
  }, [currentUser]);

  useEffect(() => {
    meApi.getProfile(dispatch, navigate);
  }, [dispatch, navigate]);
  const isLoggedIn = useSelector((state) => state.global.isLoggedIn);
  useEffect(() => {
    setLoading(!isLoggedIn);
  }, [isLoggedIn]);
  useEffect(() => {
    if (location.pathname === "/") {
      navigate("/chats");
    }
  });

  return (
    <>
      {loading ? (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      ) : (
        <Box
          sx={{
            width: "100%",
            height: "100%",
            display: "flex",
          }}
        >
          <SideBar socket={socket} />
          <Outlet context={socket} />
        </Box>
      )}
    </>
  );
}
