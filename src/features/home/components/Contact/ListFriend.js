import { ArrowBackIosOutlined } from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  useMediaQuery,
} from "@mui/material";
import axiosClient from "api/axiosClient";
import React, { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";

import { friendApi } from "api/friendApi";

const SmallAvatar = styled(Avatar)`
  width: 15px;
  height: 15px;
`;

export default function ListFriend() {
  const socket = useOutletContext();

  const navigate = useNavigate();
  const matches = useMediaQuery("(min-width:800px)");

  const [inviteFriend, setInviteFriend] = React.useState([]);
  const [recommendFriend, setRecommendFriend] = React.useState([]);

  useEffect(() => {
    let cancel = true;
    async function fetch() {
      await axiosClient
        .get("/friend/recommendInvite")
        .then((res) => {
          if (cancel) setRecommendFriend(res.data);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    fetch();
    return () => {
      cancel = false;
    };
  }, []);
  useEffect(() => {
    let cancel = true;
    async function fetch() {
      await axiosClient
        .get("/friend/receiveInvite")
        .then(
          (res) => {
            if (cancel) setInviteFriend(res.data);
          }
          // setInviteFriend(res.data);
          // console.log(res.data);
        )
        .catch((err) => {
          console.log(err.response);
        });
    }
    fetch();
    return () => {
      cancel = false;
    };
  }, []);

  useEffect(() => {
    socket.on("invite-friend", async ({ inviteFiend, listNotFiend }) => {
      setInviteFriend(inviteFiend);

      setRecommendFriend(listNotFiend);
    });
    socket.on("accept-invite-friend-success", ({ senderId }) => {
      // setInviteFriend(data);
      const dataInviteFriend = inviteFriend.filter((item) => {
        return item.senderId !== senderId;
      });
      setInviteFriend(dataInviteFriend);
    });
    socket.on("cancel-invite-friend-success", ({ listNotFiend, senderId }) => {
      const dataInviteFriend = inviteFriend.filter((item) => {
        return item.id !== senderId;
      });
      setInviteFriend(dataInviteFriend);
      setRecommendFriend(listNotFiend);
    });
    socket.on("delete-friend-success", ({ user }) => {
      // console.log("first");
      const isExit = recommendFriend.some((item) => {
        return item.id === user._id;
      });
      if (!isExit) {
        setRecommendFriend([...recommendFriend, user]);
      }
      // console.log(recommendFriend);
    });

    return () => {
      socket.off("invite-friend");
      socket.off("accept-invite-friend-success");
      socket.off("cancel-invite-friend-success");
      socket.off("delete-friend-success");
    };
  }, [inviteFriend, socket, recommendFriend]);
  // console.log(recommendFriend);

  const handleSendInviteFriend = async (user) => {
    await friendApi
      .sendInvite(user)
      .then(() => {
        const data = recommendFriend.filter((item) => item._id !== user._id);

        setRecommendFriend(data);
      })
      .catch((err) => {
        console.log(err);
      });

    // socket.emit("invite-friend", user);
  };
  const handleAcceptFriend = async (user) => {
    await friendApi
      .acceptInvite(user)
      .then(() => {
        const data = inviteFriend.filter((item) => item._id !== user._id);

        setInviteFriend(data);
      })
      .catch((err) => {
        console.log(err.response);
      });

    // socket.emit("accept-friend", user);
  };

  const handleCancelInviteFriend = (user) => {
    const data = inviteFriend.filter((item) => item._id !== user._id);

    setInviteFriend(data);

    const dataRecommende = recommendFriend;
    dataRecommende.push(user);
    setRecommendFriend(dataRecommende);
    friendApi
      .cancelInvite(user)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });

    // socket.emit("cancel-invite-friend", user);
  };

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
          borderBottom: 1,
          borderColor: "divider",
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
            src="https://chat.zalo.me/assets/NewFr@2x.820483766abed8ab03205b8e4a8b105b.png"
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
          Danh sách kết bạn
        </Box>
      </Box>
      <Box
        sx={{
          height: "calc(100% - 69px)",
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          paddingTop: "16px",
          paddingBottom: "16px",
        }}
      >
        <List
          dense
          sx={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            margin: "0 auto",
            padding: "0 16px",
            marginBottom: "16px",
            marginTop: "30px",
          }}
        >
          <Box
            sx={{
              width: "60%",
              position: "relative",
            }}
          >
            {inviteFriend.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "-30px",
                  left: "0",
                  fontSize: "16px",
                  color: "#001A33",
                  fontWeight: "500",
                }}
              >
                Lời mời kết bạn ({inviteFriend.length})
              </Box>
            )}
            {inviteFriend.map((item) => (
              <ListItem
                key={item._id}
                secondaryAction={<Box></Box>}
                sx={{
                  height: "120px",
                  minWidth: "200px",
                  borderRadius: "4px",
                  border: 1,
                  borderColor: "divider",
                  padding: "15px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: "#fff",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    minWidth: "100px",
                  }}
                >
                  <ListItemAvatar
                    sx={{
                      marginRight: "10px",
                    }}
                  >
                    <Avatar
                      sx={{
                        width: "72px",
                        height: "72px",
                      }}
                      alt="Remy Sharp"
                      src={item.avatar}
                    />
                  </ListItemAvatar>
                  <Box
                    sx={{
                      // display: "flex",
                      // flexDirection: "column",
                      // justifyContent: "space-around",
                      // alignItems: "flex-start",
                      minWidth: "0px",
                    }}
                  >
                    <Box
                      sx={{
                        fontSize: "16px",
                        color: "#001A33",
                        marginBottom: "8px",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        minWidth: "0px",
                      }}
                    >
                      {item.userName}
                    </Box>
                    <Box
                      sx={{
                        fotnSize: "13px",
                        color: "#72808E",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        minWidth: "0px",
                      }}
                    >
                      "Xin chào, tôi là {item.userName}"
                    </Box>
                  </Box>
                </Box>

                <Box>
                  <Button
                    variant="text"
                    sx={{
                      height: "30px",
                      // width: "46px",
                      fontSize: "14px",
                      color: "#0068FF",
                      textTransform: "none",
                      marginRight: "10px",
                      "&:hover": {
                        backgroundColor: "#E5EFFF",
                      },
                    }}
                    onClick={() => {
                      handleCancelInviteFriend(item);
                    }}
                  >
                    Bỏ qua
                  </Button>
                  <Button
                    variant="contained"
                    sx={{
                      height: "30px",
                      // width: "46px",
                      fontSize: "14px",
                      color: "#FFFFFF",
                      textTransform: "none",
                    }}
                    onClick={() => {
                      handleAcceptFriend(item);
                    }}
                  >
                    Đồng ý
                  </Button>
                </Box>
              </ListItem>
            ))}
          </Box>
        </List>
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
          {recommendFriend.map((item) => (
            <Grid item key={item._id}>
              <Box
                sx={{
                  width: "250px",
                  height: "250px",
                  borderRadius: "4px",
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    width: "96px",
                    height: "96px",
                    marginTop: "16px",
                  }}
                >
                  <Avatar
                    alt="Remy Sharp"
                    src={item.avatar}
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    fontSize: "16px",
                    color: "#001A33",
                    fontWeight: "500",
                    marginTop: "8px",
                  }}
                >
                  {item.userName}
                </Box>
                <Box
                  sx={{
                    fontSize: "14px",
                    color: "#72808E",
                  }}
                >
                  Từ gợi ý kết bạn
                </Box>
                <Box
                  sx={{
                    fontSize: "14px",
                    color: "#72808E",
                    marginTop: "4px",
                  }}
                >
                  Chưa có nhóm chung
                </Box>
                <Box
                  sx={{
                    marginTop: "10px",
                  }}
                >
                  <Button
                    variant="outlined"
                    sx={{
                      height: "30px",
                    }}
                    onClick={() => {
                      handleSendInviteFriend(item);
                    }}
                  >
                    Kết bạn
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
}
