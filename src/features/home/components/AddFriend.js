import { ArrowBackIosOutlined, Close } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  Modal,
  TextField,
} from "@mui/material";
import axiosClient from "api/axiosClient";
import friendApi from "api/friendApi";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext } from "react-router-dom";
import styled from "styled-components";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  bgcolor: "background.paper",
  borderRadius: "4px",
};
const StyledImg = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const ButtonSecondaryAddFriend = styled(Button)`
  height: 24px;
  font-size: 13px;
  padding: 0 4px;
  text-transform: none;
`;

const ButtonAddFriend = styled(Button)`
  height: 30px;
  padding: 0;
  width: 124px;
  font-size: 15px;
  text-transform: none;
`;

export default function AddFriend(props) {
  const {
    open,
    handleCloseAddFriend,
    openProfileFriend,
    handleCloseProfileFriend,
    handleOpenProfileFriend,
    handleDeleteFriendConversation,
    handleAcceptFriendConversation,
  } = props;

  const socket = useOutletContext();
  const currentUser = useSelector((state) => state.global.currentUser);

  const [selectedUser, setSelectedUser] = useState(null);

  const [loading, setLoading] = useState(false);

  const [listUser, setListUser] = useState([]);
  const [listSearch, setListSearch] = useState([]);

  const navigate = useNavigate();

  const handleClickUser = (user) => {
    setSelectedUser(user);
    handleOpenProfileFriend();
  };
  //   console.log(selectedUser);

  useEffect(() => {
    let cancel = true;
    setLoading(true);
    async function fetchData() {
      await axiosClient
        .get("/user")
        .then((res) => {
          if (cancel) {
            setListUser(res.data);
            setListSearch(res.data);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err.response);
          setLoading(false);
        });
    }
    fetchData();
    return () => {
      setLoading(false);
      cancel = false;
    };
  }, []);

  useEffect(() => {
    socket.on("invite-friend", ({ senderId }) => {
      // console.log(senderId);
      // console.log(selectedUser);
      if (selectedUser && selectedUser._id === senderId) {
        const user = {
          ...selectedUser,
          isFriend: false,
          isSenderRequest: false,
          isReceiverRequest: true,
        };
        setSelectedUser(user);
      }
      const newListUser = listUser.map((user) => {
        if (user._id === senderId) {
          return {
            ...user,
            isFriend: false,
            isSenderRequest: false,
            isReceiverRequest: true,
          };
        }
        return user;
      });
      setListUser(newListUser);
      setListSearch(newListUser);
    });
    socket.on("accept-invite-friend-success", ({ senderId }) => {
      if (selectedUser && selectedUser._id === senderId) {
        const user = {
          ...selectedUser,
          isFriend: true,
          isSenderRequest: false,
          isReceiverRequest: false,
        };
        setSelectedUser(user);
      }
      const newListUser = listUser.map((user) => {
        if (user._id === senderId) {
          return {
            ...user,
            isFriend: true,
            isSenderRequest: false,
            isReceiverRequest: false,
          };
        }
        return user;
      });
      setListUser(newListUser);
      setListSearch(newListUser);
    });

    socket.on("delete-friend-success", ({ senderId }) => {
      if (!senderId) return;
      if (selectedUser && selectedUser._id === senderId) {
        const user = {
          ...selectedUser,
          isFriend: false,
          isSenderRequest: false,
          isReceiverRequest: false,
        };
        setSelectedUser(user);
      }
      const newListUser = listUser.map((user) => {
        if (user._id === senderId) {
          return {
            ...user,
            isFriend: false,
            isSenderRequest: false,
            isReceiverRequest: false,
          };
        }
        return user;
      });
      setListUser(newListUser);
      setListSearch(newListUser);
    });

    socket.on("cancel-invite-friend-success", ({ senderId }) => {
      // console.log(senderId);
      if (selectedUser && selectedUser._id === senderId) {
        const user = {
          ...selectedUser,
          isSenderRequest: false,
          isReceiverRequest: false,
          isFriend: false,
        };
        setSelectedUser(user);
      }
      const newListUser = listUser.map((user) => {
        if (user._id === senderId) {
          return {
            ...user,
            isFriend: false,
            isSenderRequest: false,
            isReceiverRequest: false,
          };
        }
        return user;
      });
      // console.log(newListUser);
      setListUser(newListUser);
      setListSearch(newListUser);
    });

    return () => {
      socket.off("invite-friend");
      socket.off("accept-invite-friend-success");
      socket.off("delete-friend-success");
      socket.off("cancel-invite-friend-success");
    };
  }, [selectedUser, listUser, socket]);

  const handleCloseProfile = () => {
    handleCloseProfileFriend();
    setSelectedUser(null);
    setListSearch(listUser);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (!(value.trim() === "")) {
      const filterList = listUser.filter((user) => {
        return user.userName.toLowerCase().includes(value.toLowerCase());
      });
      setListSearch(filterList);
    } else {
      setListSearch(listUser);
    }
  };
  const handleCloseAdd = () => {
    handleCloseAddFriend();
    setSelectedUser(null);
    setListSearch(listUser);
  };

  const handleSendInviteFriend = async (user) => {
    await friendApi
      .sendInvite(user)
      .then((res) => {
        const data = {
          ...user,
        };
        data.isSenderRequest = true;
        setSelectedUser(data);
        const newListUser = listUser.map((item) => {
          if (item._id === user._id) {
            return {
              ...item,
              isSenderRequest: true,
              isReceiverRequest: false,
              isFriend: false,
            };
          }
          return item;
        });
        setListUser(newListUser);
        setListSearch(newListUser);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteFriend = async (user) => {
    // socket.emit("delete-friend", {
    //   data: user,
    // });
    await friendApi
      .deleteFriend(user)
      .then(() => {
        const newSelectedUser = { ...user };
        newSelectedUser.isFriend = false;
        setSelectedUser(newSelectedUser);
        const newListUser = listUser.map((item) => {
          if (item._id === user._id) {
            item.isFriend = false;
          }
          return item;
        });
        setListUser(newListUser);
        setListSearch(newListUser);
        handleDeleteFriendConversation(user._id, currentUser.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleDeleteInvite = async (user) => {
    // socket.emit("cancel-invite-friend", user);
    await friendApi
      .cancelInvite(user)
      .then(() => {
        const newSelectedUser = { ...user };
        newSelectedUser.isSenderRequest = false;
        newSelectedUser.isReceiverRequest = false;
        newSelectedUser.isFriend = false;
        setSelectedUser(newSelectedUser);
        const newListUser = listUser.map((item) => {
          if (item._id === user._id) {
            item.isSenderRequest = false;
            item.isReceiverRequest = false;
            item.isFriend = false;
          }
          return item;
        });
        setListUser(newListUser);
        setListSearch(newListUser);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAcceptFriend = async (user) => {
    // socket.emit("accept-friend", user);
    await friendApi
      .acceptInvite(user)
      .then((res) => {
        const newSelectedUser = { ...user };
        newSelectedUser.isFriend = true;
        setSelectedUser(newSelectedUser);
        const newListUser = listUser.map((item) => {
          if (item._id === user._id) {
            item.isFriend = true;
            item.isSenderRequest = false;
            item.isReceiverRequest = false;
          }
          return item;
        });
        setListUser(newListUser);
        setListSearch(newListUser);
        handleAcceptFriendConversation(user._id, currentUser.id);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleNavigateChat = async () => {
    if (selectedUser) {
      await axiosClient
        .post("/conversation/individual", { receiveId: selectedUser._id })
        .then((res) => {
          const conversation = res.data;
          // console.log(conversation);
          if (conversation) {
            navigate(`/chats/${conversation._id}`);
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseAdd}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {openProfileFriend ? (
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              height: "49px",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0px 10px",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <IconButton
                aria-label="back"
                sx={{ marginRight: "8px" }}
                onClick={handleCloseProfile}
              >
                <ArrowBackIosOutlined
                  sx={{
                    color: "#88939f",
                    fontSize: "18px",
                  }}
                />
              </IconButton>
              <Box
                sx={{
                  fontSize: "18px",
                  fontWeight: "400",
                }}
              >
                Thêm bạn
              </Box>
            </Box>
            <IconButton onClick={handleCloseAdd}>
              <Close />
            </IconButton>
          </Box>
          <Box>
            <StyledImg
              src="https://cover-talk.zadn.vn/8/1/5/b/1/51e4de33e732535f0bb7d733c86d15e7.jpg"
              alt="anh nen"
            />
          </Box>
          <Box
            sx={{
              position: "relative",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            >
              <Avatar
                src={selectedUser?.avatar}
                sx={{
                  width: "96px",
                  height: "96px",
                }}
              />
            </Box>
          </Box>
          <Box
            sx={{
              textAlign: "center",
              marginTop: "60px",
              fontSize: "20px",
            }}
          >
            {selectedUser?.userName}
          </Box>
          <Box
            sx={{
              width: "100%",
              padding: "10px 0px 0px 0px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 10px",
              }}
            >
              <ButtonAddFriend
                variant="outlined"
                sx={{
                  marginRight: "10px",
                }}
                onClick={handleNavigateChat}
              >
                Nhắn tin
              </ButtonAddFriend>
              {selectedUser?.isFriend ? (
                <ButtonAddFriend
                  variant="contained"
                  onClick={() => {
                    handleDeleteFriend(selectedUser);
                  }}
                >
                  Huỷ kết bạn
                </ButtonAddFriend>
              ) : selectedUser?.isSenderRequest ? (
                <ButtonAddFriend
                  variant="contained"
                  onClick={() => {
                    handleDeleteInvite(selectedUser);
                  }}
                >
                  Huỷ lời mời
                </ButtonAddFriend>
              ) : selectedUser?.isReceiverRequest ? (
                <>
                  <ButtonAddFriend
                    variant="outlined"
                    sx={{
                      marginRight: "10px",
                    }}
                    onClick={() => {
                      handleDeleteInvite(selectedUser);
                    }}
                  >
                    Huỷ bỏ
                  </ButtonAddFriend>
                  <ButtonAddFriend
                    variant="contained"
                    onClick={() => {
                      handleAcceptFriend(selectedUser);
                    }}
                  >
                    Chấp nhận
                  </ButtonAddFriend>
                </>
              ) : (
                <ButtonAddFriend
                  variant="contained"
                  onClick={() => {
                    handleSendInviteFriend(selectedUser);
                  }}
                >
                  Kết bạn
                </ButtonAddFriend>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              padding: "20px 20px",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "118px",
                  fontSize: "15px",
                  color: "#72808E",
                }}
              >
                Email
              </Box>
              <Box
                sx={{
                  fontSize: "15px",
                  color: "#001A33",
                }}
              >
                {selectedUser?.email}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Box
                sx={{
                  width: "118px",
                  fontSize: "15px",
                  color: "#72808E",
                }}
              >
                Giới tính
              </Box>
              <Box
                sx={{
                  fontSize: "15px",
                  color: "#001A33",
                }}
              >
                {selectedUser?.gender ? "Nam" : "Nữ"}
              </Box>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginTop: "10px",
              }}
            >
              <Box
                sx={{
                  width: "118px",
                  fontSize: "15px",
                  color: "#72808E",
                }}
              >
                Ngày sinh
              </Box>
              <Box
                sx={{
                  fontSize: "15px",
                  color: "#001A33",
                }}
              >
                {/* {selectedUser?.dateOfBirth} */}
                {new Date(selectedUser?.dateOfBirth)
                  .toISOString()
                  .substring(0, 10)
                  .split("-")
                  .reverse()
                  .join("/")}
              </Box>
            </Box>
          </Box>
        </Box>
      ) : (
        <Box sx={style}>
          <Box
            sx={{
              display: "flex",
              height: "49px",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0px 10px",
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                fontSize: "18px",
                fontWeight: "400",
              }}
            >
              Thêm bạn
            </Box>
            <IconButton onClick={handleCloseAdd}>
              <Close />
            </IconButton>
          </Box>
          <Box
            component="form"
            noValidate
            sx={{
              padding: "10px 10px",
            }}
          >
            <TextField
              fullWidth
              placeholder="Nhập tên"
              id="standard-basic"
              label="Tên"
              autoComplete="off"
              variant="standard"
              autoFocus
              onChange={(e) => handleSearch(e)}
            />
          </Box>
          <Box>
            <Box
              sx={{
                fontSize: "13px",
                color: "#61707e",
                padding: "10px 10px",
              }}
            >
              Có thể bạn quen
            </Box>

            <List
              sx={{
                width: "100%",
                padding: "0 0 20px 0",
                bgcolor: "background.paper",
                maxHeight: "320px",
                overflowY: "auto",
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : (
                <>
                  {listSearch.map((item) => (
                    <ListItemButton
                      sx={{
                        padding: "0px",
                      }}
                      key={item._id}
                      onClick={() => handleClickUser(item)}
                    >
                      <ListItem
                        alignItems="center"
                        secondaryAction={
                          item?.isFriend ? (
                            <ButtonSecondaryAddFriend variant="outlined">
                              Huỷ kết bạn
                            </ButtonSecondaryAddFriend>
                          ) : item?.isSenderRequest ? (
                            <ButtonSecondaryAddFriend variant="outlined">
                              Huỷ lời mời
                            </ButtonSecondaryAddFriend>
                          ) : item?.isReceiverRequest ? (
                            <>
                              <ButtonSecondaryAddFriend variant="outlined">
                                Chấp nhận
                              </ButtonSecondaryAddFriend>
                            </>
                          ) : (
                            <ButtonSecondaryAddFriend variant="outlined">
                              Kết bạn
                            </ButtonSecondaryAddFriend>
                          )
                        }
                      >
                        <ListItemAvatar>
                          <Avatar
                            alt="Remy Sharp"
                            src={item?.avatar}
                            sx={{
                              width: "40px",
                              height: "40px",
                              marginRight: "10px",
                            }}
                          />
                        </ListItemAvatar>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: "calc(100% - 60px)",
                            whiteSpace: "nowrap",
                            height: "100%",
                          }}
                        >
                          <Box
                            sx={{
                              fontSize: "16px",
                            }}
                          >
                            {item?.userName}
                          </Box>
                          <Box
                            sx={{
                              textOverflow: "ellipsis",
                              overflow: "hidden",
                              maxWidth: "80%",
                              fontSize: "12px",
                              color: "#758390",
                            }}
                          >
                            {item?.email}
                          </Box>
                        </Box>
                      </ListItem>
                    </ListItemButton>
                  ))}
                </>
              )}
            </List>
          </Box>
          {/* <Box
            sx={{
              margin: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <StyledButtonCanel
              onClick={handleCloseAdd}
              variant="contained"
              sx={{
                marginRight: "10px",
                backgroundColor: "#e7eaef",
                color: "#001933",
              }}
            >
              Huỷ
            </StyledButtonCanel>
            <Button variant="contained" onClick={handleSearch}>
              Tìm kiếm
            </Button>
          </Box> */}
        </Box>
      )}
    </Modal>
  );
}
