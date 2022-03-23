import { ArrowBackIosOutlined } from "@mui/icons-material";
import {
  Avatar,
  AvatarGroup,
  Badge,
  Divider,
  Grid,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import axiosClient from "api/axiosClient";
import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";

const SmallAvatar = styled(Avatar)`
  width: 15px;
  height: 15px;
`;
const StyledNavLink = styled(NavLink)`
  color: #212121;
  text-decoration: none;
  width: 100%;
  &.active {
    background-color: #e5effe;
  }
`;
export default function ListGroup() {
  const [listGroup, setListGroup] = useState([]);

  const matches = useMediaQuery("(min-width:800px)");
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = true;
    async function getListGroup() {
      await axiosClient
        .get("/conversation/group")
        .then((res) => {
          if (cancel) {
            setListGroup(res.data);
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    getListGroup();
    return () => {
      cancel = false;
    };
  }, []);
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        backgroundColor: "#fafafc",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "69px",
          backgroundColor: "#fff",
          display: "flex",
          alignItems: "center",
          paddingX: "16px",
        }}
      >
        {!matches && (
          <IconButton
            aria-label="back"
            sx={{ marginRight: "10px" }}
            onClick={() => {
              navigate("/contacts");
            }}
          >
            <ArrowBackIosOutlined
              sx={{
                color: "#88939f",
                fontSize: "20px",
              }}
            />
          </IconButton>
        )}
        <Badge
          overlap="circular"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          badgeContent={
            <SmallAvatar
              alt="Remy Sharp"
              src="https://stc-chat.zdn.vn/images/icons/ic_oa_verify_20.png"
            />
          }
        >
          <Avatar
            sx={{
              width: "48px",
              height: "48px",
            }}
            alt="Travis Howard"
            src="https://chat.zalo.me/assets/group@2x.2d184edd797db8782baa0d5c7a786ba0.png"
          />
        </Badge>
        <Box
          sx={{
            fontSize: "24px",
            color: "#001A33",
            fontWeight: "500",
            marginLeft: "16px",
          }}
        >
          Danh sách nhóm
        </Box>
      </Box>
      <Divider />
      <Box
        sx={{
          width: "100%",
          height: "calc(100% - 75px)",
          padding: "16px",
          overflowY: "auto",
        }}
      >
        <Grid
          container
          spacing={{ xs: 1, md: 2 }}
          // columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginLeft: "120px",
          }}
        >
          {listGroup.map((item) => (
            <Grid item key={item._id}>
              <StyledNavLink to={`/chats/${item._id}`}>
                <Box
                  sx={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "4px",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                    border: "1px solid #e6e6e6",
                  }}
                >
                  <Box
                    sx={{
                      width: "96px",
                      height: "96px",
                      marginTop: "16px",
                    }}
                  >
                    {typeof item.avatar === "string" ? (
                      <Avatar
                        alt="Remy Sharp"
                        src={item.avatar}
                        sx={{
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    ) : (
                      <AvatarGroup
                        max={2}
                        sx={{
                          width: "100%",
                          height: "100%",
                        }}
                      >
                        {item.avatar.map((avatar, index) => (
                          <Avatar
                            src={avatar}
                            key={index}
                            sx={{
                              width: "50%",
                              height: "50%",
                              border: "1px solid #fff",
                            }}
                          />
                        ))}
                      </AvatarGroup>
                    )}
                  </Box>
                  <Box
                    sx={{
                      fontSize: "16px",
                      color: "#001A33",
                      fontWeight: "500",
                      marginTop: "20px",
                    }}
                  >
                    {item.name}
                  </Box>
                  <Box
                    sx={{
                      fontSize: "14px",
                      color: "#72808E",
                      marginTop: "10px",
                    }}
                  >
                    {item.members.length} thành viên
                  </Box>
                </Box>
              </StyledNavLink>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
