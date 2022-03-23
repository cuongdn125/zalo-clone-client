import {
  AssignmentIndOutlined,
  ChatOutlined,
  PersonOutlineOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import { Avatar, Box, Button, Divider, Menu, MenuItem } from "@mui/material";
import { authApi } from "api/authApi";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Account from "./Account";

const StyledNavLink = styled(NavLink)`
  &:hover {
    background-color: #5badff;
  }
  &.active {
    background-color: #006edc;
  }
`;
const StyledButton = styled(Button)`
  &:hover {
    background-color: #5badff;
  }
  &.active {
    background-color: #006edc;
  }
`;
export default function SideBar({ socket }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(socket);

  const currentUser = useSelector((state) => state.global.currentUser);
  const open = Boolean(anchorEl);
  const handleSettingClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleSettingClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    setAnchorEl(null);
    authApi.logout(dispatch, navigate);
  };

  const [accountOpen, setAccountOpen] = useState(false);

  const handleSetting = () => {
    setAccountOpen(true);
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        width: "65px",
        height: "100%",
        backgroundColor: "#0092ff",
        boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Avatar
          alt="avatar"
          src={currentUser?.avatar}
          sx={{
            mt: "30px",
            width: 50,
            height: 50,
            mb: 2,
          }}
        />
        <StyledNavLink to="chats">
          <Box
            sx={{
              width: "100%",
              paddingX: "10px",
              paddingY: "5px",
            }}
          >
            <ChatOutlined
              sx={{
                fontSize: "45px",
                padding: "8px",
                color: "white",
              }}
            />
          </Box>
        </StyledNavLink>
        <StyledNavLink to="contacts">
          <Box
            sx={{
              width: "100%",
              paddingX: "10px",
              paddingY: "5px",
            }}
          >
            <AssignmentIndOutlined
              sx={{
                fontSize: "45px",
                padding: "8px",
                color: "white",
              }}
            />
          </Box>
        </StyledNavLink>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <StyledButton
          id="basic-button"
          aria-controls={open ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleSettingClick}
        >
          <SettingsOutlined
            sx={{
              fontSize: "45px",
              padding: "8px",
              color: "white",
            }}
          />
        </StyledButton>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleSettingClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          sx={{
            width: "100%",
          }}
        >
          <MenuItem
            onClick={handleSetting}
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <PersonOutlineOutlined
              sx={{
                marginRight: "10px",
              }}
            />
            <Box>Tài khoản</Box>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={handleLogout}
            sx={{
              color: "red",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Đăng xuất
          </MenuItem>
        </Menu>
        {accountOpen && (
          <Account open={accountOpen} setAccountOpen={setAccountOpen} />
        )}
      </Box>
    </Box>
  );
}
