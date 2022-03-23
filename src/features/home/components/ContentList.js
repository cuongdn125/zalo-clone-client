import {
  GroupAddOutlined,
  PersonAddOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tab,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axiosClient from "api/axiosClient";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import styled from "styled-components";
import dateUtils from "utils/dateUtil";
import AddFriend from "./AddFriend";
import AddGroup from "./AddGroup";

const StyledInput = styled.input`
  height: 32px;
  width: 100%;
  background-color: #e7eaef;
  border: none;
  outline: none;
  margin-left: 4px;
  border-radius: 16px;
`;

const CloseButton = styled(IconButton)`
  background-color: white;
  border-radius: 16px;
  height: 32px;
  width: 60px;
  &:hover {
    background-color: #e7eaef;
  }
`;

const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  padding-left: 4px;
`;

const AntTab = styled(Tab)`
  text-transform: none;
`;

const BoxNotReadName = styled(Box)`
  color: ${(props) => (props.isRead ? "" : "black")};
  font-weight: ${(props) => (props.isRead ? "" : "500")};
`;
const BoxNotReadContent = styled(Box)`
  color: ${(props) => (props.isRead ? "#848f9b" : "#001933")};
`;

const StyledNavLink = styled(NavLink)`
  color: #212121;
  text-decoration: none;
  width: 100%;
  &.active {
    background-color: #e5effe;
  }
`;

const BoxResponsive = styled(Box)`
  width: ${(props) => (props.matches ? "310px" : "100%")};
  display: ${(props) => (!props.isHide & !props.matches ? "none" : "block")};

  background-color: "white";
`;

const BoxMatches = styled(Box)`
  width: ${(props) => (props.matches ? "310px" : "100%")};
`;

const StyledBox = styled(Box)`
  width: ${(props) => (props.matches ? "309px" : "100%")};
  margin-top: 16px;
`;

export default function ContentList() {
  const socket = useOutletContext();
  const [isSearch, setIsSearch] = useState(false);
  const [tab, setTab] = React.useState("1");
  const [listSearch, setListSearch] = useState([]);
  const [open, setOpen] = useState(false);

  const [openAddGroup, setOpenAddGroup] = useState(false);

  const currentUser = useSelector((state) => state.global.currentUser);

  const [listConversation, setListConversation] = useState([]);

  const [listConversationValid, setListConversationValid] = useState([]);

  const [listStrange, setListStrange] = useState([]);

  const [conversationSelected, setConversationSelected] = useState(null);

  const [newMessage, setNewMessage] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const [openProfileFriend, setOpenProfileFriend] = useState(false);

  const matches = useMediaQuery("(min-width:800px)");

  const location = useLocation();
  const pathnameChat = location.pathname.split("/")[2];
  // console.log(pathnameChat);
  const isHide = location.pathname === "/chats";

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const searchRef = useRef();

  useEffect(() => {
    let cancel = true;
    async function fetchData() {
      await axiosClient
        .get("/conversation")
        .then((res) => {
          if (cancel) {
            setListConversation(res.data);
            const dataStrange = res.data.filter(
              (item) => !item?.isFriend && !item?.type
            );
            setListStrange(dataStrange);
            const dataValid = res.data.filter(
              (item) => item?.isFriend || item?.type
            );

            const re = [...dataValid, dataStrange[0]];
            re.sort((a, b) => {
              return (
                new Date(b.lastMessage?.createdAt).getTime() -
                new Date(a.lastMessage?.createdAt).getTime()
              );
            });
            setListConversationValid(re);
            // console.log(dataStrange);
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    fetchData();
    return () => {
      cancel = false;
    };
  }, [dispatch]);

  useEffect(() => {
    socket.on("add-conversation", ({ data }) => {
      const dataConversation = [...listConversation];
      // console.log(data);
      const index = dataConversation.findIndex(
        (item) => item?._id === data?._id
      );
      if (dataConversation[index]?.type) {
        dataConversation[index].isFriend = true;
        setListConversation(dataConversation);
      } else {
        if (index === -1) {
          dataConversation.push(data);
          setListConversation(dataConversation);
        } else {
          dataConversation[index].isFriend = true;
          setListConversation(dataConversation);
        }
      }
    });

    socket.on("delete-friend-success", ({ conversationId }) => {
      if (!conversationId) return;
      const dataConversation = [...listConversation];
      const index = dataConversation.findIndex(
        (item) => item.conversationId === conversationId
      );
      if (index !== -1) {
        dataConversation[index].isFriend = false;
        setListConversation(dataConversation);
      }
    });
    socket.on("delete-conversation", ({ conversationId }) => {
      if (!conversationId) return;
      if (conversationId === pathnameChat) {
        navigate("/chats");
      }
      const dataConversation = [...listConversation];
      const index = dataConversation.findIndex(
        (item) => item.conversationId === conversationId
      );
      if (index !== -1) {
        dataConversation[index].message = [];
        dataConversation.splice(index, 1);
        setListConversation(dataConversation);
      }
    });
    socket.on("newMessage", (data) => {
      setNewMessage(data);
      // console.log(data);
      const dataConversation = [...listConversation];

      const index = dataConversation.findIndex(
        (item) => item.conversationId === data.conversationId
      );
      if (index !== -1) {
        if (pathnameChat === data.conversationId) {
          dataConversation[index].isRead = true;
          dataConversation[index].lastMessage = data;

          dataConversation[index].lastMessage.time = data.time;
          dataConversation[index].message.push(data);
          dataConversation.sort((a, b) => {
            // console.log(new Date(a.lastMessage.createdAt).getTime());
            return (
              new Date(b.lastMessage?.createdAt).getTime() -
              new Date(a.lastMessage?.createdAt).getTime()
            );
          });
          setListConversation(dataConversation);
          const dataStrange = dataConversation.filter(
            (item) => !item?.isFriend && !item?.type
          );
          setListStrange(dataStrange);
          const dataValid = dataConversation.filter(
            (item) => item?.isFriend || item?.type
          );

          const re = [...dataValid, dataStrange[0]];
          re.sort((a, b) => {
            return (
              new Date(b.lastMessage?.createdAt).getTime() -
              new Date(a.lastMessage?.createdAt).getTime()
            );
          });
          setListConversationValid(re);
        } else {
          dataConversation[index].isRead = false;
          dataConversation[index].lastMessage = data;
          dataConversation[index].lastMessage.time = data.time;
          dataConversation[index].message.push(data);
          dataConversation.sort((a, b) => {
            return (
              new Date(b.lastMessage?.createdAt).getTime() -
              new Date(a.lastMessage?.createdAt).getTime()
            );
          });
          setListConversation(dataConversation);
          const dataStrange = dataConversation.filter(
            (item) => !item?.isFriend && !item?.type
          );
          setListStrange(dataStrange);
          const dataValid = dataConversation.filter(
            (item) => item?.isFriend || item?.type
          );

          const re = [...dataValid, dataStrange[0]];
          re.sort((a, b) => {
            return (
              new Date(b.lastMessage?.createdAt).getTime() -
              new Date(a.lastMessage?.createdAt).getTime()
            );
          });
          setListConversationValid(re);
        }
      }
    });

    socket.on("deleteMessage", ({ data }) => {
      // console.log(data);
      setDeleteMessage(data);
      if (data.messageId === newMessage?._id) {
        setNewMessage(null);
      }
      const dataConversation = [...listConversation];
      const index = dataConversation.findIndex(
        (item) => item.conversationId === data.conversationId
      );
      if (index !== -1) {
        // console.log("message: ", dataConversation[index]);
        const messageIndex = dataConversation[index].message.findIndex(
          (item) => item._id === data.messageId
        );
        if (messageIndex !== -1) {
          dataConversation[index].message.splice(messageIndex, 1);
          dataConversation[index].lastMessage =
            dataConversation[index].message[
              dataConversation[index].message.length - 1
            ];

          if (dataConversation[index].message.length !== 0) {
            dataConversation[index].lastMessage.time = dateUtils.toTime(
              dataConversation[index]?.lastMessage?.createdAt.toString()
            );
          }

          dataConversation.sort((a, b) => {
            // console.log(new Date(a.lastMessage.createdAt).getTime());
            return (
              new Date(b.lastMessage?.createdAt).getTime() -
              new Date(a.lastMessage?.createdAt).getTime()
            );
          });

          // console.log(dataConversation[index]);

          setListConversation(dataConversation);
        }
      }
    });

    return () => {
      socket.off("add-conversation");
      socket.off("delete-friend-success");
      socket.off("newMessage");
      socket.off("deleteMessage");
      socket.off("delete-conversation");
    };
  }, [listConversation, socket, dispatch, pathnameChat, newMessage, navigate]);

  const handleTab = (event, newValue) => {
    setTab(newValue);
  };

  const handleSearch = (event) => {
    const search = event.target.value;
    if (search.trim() === "") {
      setListSearch(listConversation);
    }
    const dataConversation = [...listConversation];
    const dataSearch = dataConversation.filter((item) => {
      return item.name.toLowerCase().includes(search.toLowerCase());
    });
    setListSearch(dataSearch);
  };

  const handleClose = (event) => {
    setIsSearch(false);
    searchRef.current.value = "";
  };

  const handleOpenAddFriend = () => setOpen(true);
  const handleCloseAddFriend = () => {
    setOpen(false);
    setOpenProfileFriend(false);
  };
  const handleOpenProfileFriend = () => setOpenProfileFriend(true);
  const handleCloseProfileFriend = () => setOpenProfileFriend(false);

  const handleDeleteFriendConversation = (member1, member2) => {
    const dataListConversation = [...listConversation];
    const index = dataListConversation.findIndex((item) => {
      return (
        item.members.includes(member1) &&
        item.members.includes(member2) &&
        !item.type
      );
    });
    if (index !== -1) {
      dataListConversation[index].isFriend = false;
      setListConversation(dataListConversation);
    }
  };
  const handleAcceptFriendConversation = (member1, member2) => {
    const dataListConversation = [...listConversation];
    const index = dataListConversation.findIndex((item) => {
      return (
        item.members.includes(member1) &&
        item.members.includes(member2) &&
        !item.type
      );
    });
    if (index !== -1) {
      dataListConversation[index].isFriend = true;
      setListConversation(dataListConversation);
    }
  };

  const handleReadMessage = (conversationId) => {
    let cancel = true;
    async function fetchData() {
      await axiosClient
        .post("/member", { conversationId })
        .then((res) => {
          if (cancel) {
            // console.log(res.data);
            const dataConversation = [...listConversation];
            const index = dataConversation.findIndex(
              (item) => item.conversationId === conversationId
            );
            if (index !== -1) {
              dataConversation[index].isRead = true;
              setListConversation(dataConversation);
            }
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    fetchData();
    return () => {
      cancel = false;
    };
  };
  // console.log(listConversation);
  // console.log(listConversationValid);

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <BoxResponsive
        matches={matches}
        isHide={isHide}
        sx={{
          borderRight: 1,
          borderColor: "divider",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box>
          <Box
            component="form"
            noValidate
            autoComplete="off"
            sx={{
              mt: 2,
              display: "flex",
              alignItems: "center",
              height: "32px",
              width: "100%",
            }}
          >
            <Box
              sx={{
                backgroundColor: "#e7eaef",
                marginLeft: "10px",
                marginRight: "4px",
                borderRadius: "16px",
                paddingLeft: "4px",
                paddingRight: "8px",
                width: "100%",
              }}
            >
              <StyledLabel>
                <SearchOutlined />
                <StyledInput
                  ref={searchRef}
                  type="text"
                  placeholder="Tìm kiếm"
                  // value={search}
                  onChange={(e) => {
                    handleSearch(e);
                  }}
                  onClick={() => setIsSearch(true)}
                />
              </StyledLabel>
            </Box>
            <Box sx={{ paddingRight: "4px" }}>
              {isSearch ? (
                <Box>
                  <CloseButton
                    onClick={handleClose}
                    sx={{
                      color: "#3b3b3b",
                      fontSize: "14px",
                      fontWeight: "600",
                    }}
                  >
                    Đóng
                  </CloseButton>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                  }}
                >
                  <IconButton onClick={handleOpenAddFriend}>
                    <PersonAddOutlined />
                  </IconButton>
                  <IconButton
                    onClick={() => {
                      setOpenAddGroup(true);
                    }}
                  >
                    <GroupAddOutlined />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        {isSearch ? (
          <StyledBox matches={matches}>
            <Typography
              variant="subtitle1"
              sx={{
                fontSize: "14px",
                fontWeight: "bold",
                marginLeft: "10px",
              }}
            >
              Tìm gần đây
            </Typography>
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                maxHeight: "calc(100vh - 89px)",
                overflowY: "auto",
              }}
            >
              {listSearch.map(
                (item) =>
                  item.message?.length > 0 && (
                    <ListItemButton
                      sx={{
                        padding: "0px",
                      }}
                      key={"key" + item.conversationId}
                      onClick={() => {
                        handleReadMessage(item.conversationId);
                      }}
                    >
                      <StyledNavLink
                        to={item.conversationId.toString()}
                        onClick={() => {
                          setConversationSelected(item);
                        }}
                      >
                        <ListItem alignItems="center">
                          <ListItemAvatar>
                            {!item?.type ||
                            typeof item?.avatar === "string" ||
                            !item?.avatar ? (
                              item?.avatar ? (
                                <Avatar
                                  alt="Remy Sharp"
                                  src={item?.avatar}
                                  sx={{
                                    width: "48px",
                                    height: "48px",
                                    marginRight: "10px",
                                  }}
                                />
                              ) : (
                                <Avatar
                                  alt="Remy Sharp"
                                  // src={item?.avatar}
                                  sx={{
                                    width: "48px",
                                    height: "48px",
                                    marginRight: "10px",
                                  }}
                                />
                              )
                            ) : (
                              <AvatarGroup
                                max={4}
                                sx={{
                                  width: "48px",
                                  height: "48px",
                                  marginRight: "10px",
                                }}
                              >
                                {item?.avatar.map((avatar, index) => (
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
                          </ListItemAvatar>
                          <ListItemText primary={item.name} />
                        </ListItem>
                      </StyledNavLink>
                    </ListItemButton>
                  )
              )}
            </List>
          </StyledBox>
        ) : (
          <Box sx={{ width: "100%" }}>
            {!(!isHide & !matches) && (
              <TabContext value={tab}>
                <BoxMatches
                  matches={matches}
                  sx={{
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <TabList
                    onChange={handleTab}
                    aria-label="lab API tabs example"
                  >
                    <AntTab label="Tất cả" value="1" />
                    <AntTab label="Chưa đọc" value="2" />
                    <AntTab label="Người lạ" value="3" />
                  </TabList>
                </BoxMatches>
                <TabPanel
                  value="1"
                  sx={{
                    padding: 0,
                  }}
                >
                  <List
                    sx={{
                      width: "100%",
                      padding: 0,
                      bgcolor: "background.paper",
                      maxHeight: "calc(100vh - 94px)",
                      overflowY: "auto",
                    }}
                  >
                    {listConversationValid.map(
                      (item) =>
                        item?.message?.length > 0 &&
                        (!item?.isFriend && !item?.type ? (
                          <ListItemButton
                            sx={{
                              padding: "0px",
                            }}
                            key={"key" + item?.conversationId}
                            onClick={() => {
                              setTab("3");
                            }}
                          >
                            <ListItem
                              alignItems="center"
                              sx={{ height: "100%" }}
                            >
                              <ListItemAvatar>
                                <Avatar
                                  alt="Remy Sharp"
                                  sx={{
                                    width: "50px",
                                    height: "50px",
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
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                                >
                                  <BoxNotReadName
                                    isRead={item?.isRead}
                                    sx={{
                                      fontSize: "16px",
                                    }}
                                  >
                                    Tin nhắn từ người lạ
                                  </BoxNotReadName>
                                  <Box
                                    sx={{
                                      fontSize: "12px",
                                      color: "#758390",
                                    }}
                                  >
                                    {item?.lastMessage?.time}
                                  </Box>
                                </Box>
                                <BoxNotReadContent
                                  isRead={item?.isRead}
                                  component="div"
                                  sx={{
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    maxWidth: "80%",
                                    fontSize: "14px",
                                  }}
                                >
                                  Chưa có trong bạn bè
                                </BoxNotReadContent>
                              </Box>
                            </ListItem>
                          </ListItemButton>
                        ) : (
                          <ListItemButton
                            sx={{
                              padding: "0px",
                            }}
                            key={"key" + item?.conversationId}
                            onClick={() => {
                              handleReadMessage(item.conversationId);
                            }}
                          >
                            <StyledNavLink
                              to={item?.conversationId.toString()}
                              onClick={() => {
                                setConversationSelected(item);
                              }}
                            >
                              <ListItem alignItems="center">
                                <ListItemAvatar>
                                  {!item?.type ||
                                  typeof item?.avatar === "string" ||
                                  !item?.avatar ? (
                                    item?.avatar ? (
                                      <Avatar
                                        alt="Remy Sharp"
                                        src={item?.avatar}
                                        sx={{
                                          width: "48px",
                                          height: "48px",
                                          marginRight: "10px",
                                        }}
                                      />
                                    ) : (
                                      <Avatar
                                        alt="Remy Sharp"
                                        // src={item?.avatar}
                                        sx={{
                                          width: "48px",
                                          height: "48px",
                                          marginRight: "10px",
                                        }}
                                      />
                                    )
                                  ) : (
                                    <AvatarGroup
                                      max={4}
                                      sx={{
                                        width: "48px",
                                        height: "48px",
                                        marginRight: "10px",
                                      }}
                                    >
                                      {item?.avatar.map((avatar, index) => (
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
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <BoxNotReadName
                                      isRead={item?.isRead}
                                      sx={{
                                        fontSize: "16px",
                                      }}
                                    >
                                      {item?.name}
                                    </BoxNotReadName>
                                    <Box
                                      sx={{
                                        fontSize: "12px",
                                        color: "#758390",
                                      }}
                                    >
                                      {item?.lastMessage?.time}
                                    </Box>
                                  </Box>
                                  <BoxNotReadContent
                                    isRead={item?.isRead}
                                    component="div"
                                    sx={{
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                      maxWidth: "80%",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {item?.type
                                      ? item?.lastMessage?.type === "text"
                                        ? currentUser?.id ===
                                          item?.lastMessage?.userId
                                          ? "Bạn: " + item?.lastMessage?.content
                                          : `${item?.lastMessage?.user?.userName}: ${item?.lastMessage?.content}`
                                        : currentUser?.id ===
                                          item?.lastMessage?.userId
                                        ? "Bạn: Hình ảnh"
                                        : `${item?.lastMessage?.user?.userName}: Hình ảnh`
                                      : item?.lastMessage?.type === "text"
                                      ? currentUser?.id ===
                                        item?.lastMessage?.userId
                                        ? "Bạn: " + item?.lastMessage?.content
                                        : item?.lastMessage?.content
                                      : currentUser?.id ===
                                        item?.lastMessage?.userId
                                      ? "Bạn: Hình ảnh"
                                      : "Hình ảnh"}
                                  </BoxNotReadContent>
                                </Box>
                              </ListItem>
                            </StyledNavLink>
                          </ListItemButton>
                        ))
                    )}
                  </List>
                </TabPanel>
                <TabPanel
                  value="2"
                  sx={{
                    padding: 0,
                  }}
                >
                  <List
                    sx={{
                      width: "100%",
                      padding: 0,
                      bgcolor: "background.paper",
                      maxHeight: "calc(100vh - 94px)",
                      overflowY: "auto",
                    }}
                  >
                    {listConversation.map(
                      (item) =>
                        !item?.isRead &&
                        item.message?.length > 0 && (
                          <ListItemButton
                            sx={{
                              padding: "0px",
                            }}
                            key={"key" + item?.conversationId}
                            onClick={() => {
                              handleReadMessage(item.conversationId);
                            }}
                          >
                            <StyledNavLink
                              to={item?.conversationId.toString()}
                              onClick={() => {
                                setConversationSelected(item);
                              }}
                            >
                              <ListItem alignItems="center">
                                <ListItemAvatar>
                                  {item?.isFriend ? (
                                    typeof item?.avatar === "string" ? (
                                      <Avatar
                                        alt="Remy Sharp"
                                        src={item?.avatar}
                                        sx={{
                                          width: "50px",
                                          height: "50px",
                                          marginRight: "10px",
                                        }}
                                      />
                                    ) : (
                                      <AvatarGroup
                                        max={2}
                                        sx={{
                                          width: "50px",
                                          height: "50px",
                                        }}
                                      >
                                        {conversationSelected?.avatar.map(
                                          (avatar, index) => (
                                            <Avatar
                                              src={avatar}
                                              key={index}
                                              sx={{
                                                width: "50%",
                                                height: "50%",
                                                border: "1px solid #fff",
                                              }}
                                            />
                                          )
                                        )}
                                      </AvatarGroup>
                                    )
                                  ) : (
                                    // <Avatar
                                    //   alt="Remy Sharp"
                                    //   src={item?.avatar}
                                    //   sx={{
                                    //     width: "50px",
                                    //     height: "50px",
                                    //     marginRight: "10px",
                                    //   }}
                                    // />
                                    <Avatar
                                      alt="Remy Sharp"
                                      sx={{
                                        width: "50px",
                                        height: "50px",
                                        marginRight: "10px",
                                      }}
                                    />
                                  )}
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
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <BoxNotReadName
                                      isRead={item?.isRead}
                                      sx={{
                                        fontSize: "16px",
                                      }}
                                    >
                                      {item?.isFriend
                                        ? item?.name
                                        : "Tin nhắn từ người lạ"}
                                    </BoxNotReadName>
                                    <Box
                                      sx={{
                                        fontSize: "12px",
                                        color: "#758390",
                                      }}
                                    >
                                      {item?.lastMessage?.time}
                                    </Box>
                                  </Box>
                                  <BoxNotReadContent
                                    isRead={item?.isRead}
                                    component="div"
                                    sx={{
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                      maxWidth: "80%",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {currentUser?.id ===
                                    item?.lastMessage?.userId
                                      ? "Bạn: " + item?.lastMessage?.content
                                      : item?.lastMessage?.content}
                                  </BoxNotReadContent>
                                </Box>
                              </ListItem>
                            </StyledNavLink>
                          </ListItemButton>
                        )
                    )}
                  </List>
                </TabPanel>
                <TabPanel
                  value="3"
                  sx={{
                    padding: 0,
                  }}
                >
                  <List
                    sx={{
                      width: "100%",
                      padding: 0,
                      bgcolor: "background.paper",
                      maxHeight: "calc(100vh - 94px)",
                      overflowY: "auto",
                    }}
                  >
                    {listStrange.map(
                      (item) =>
                        !item?.isFriend &&
                        item.message?.length > 0 && (
                          <ListItemButton
                            sx={{
                              padding: "0px",
                            }}
                            key={"key" + item?.conversationId}
                            onClick={() => {
                              handleReadMessage(item.conversationId);
                            }}
                          >
                            <StyledNavLink
                              to={item?.conversationId.toString()}
                              onClick={() => {
                                setConversationSelected(item);
                              }}
                            >
                              <ListItem alignItems="center">
                                <ListItemAvatar>
                                  <Avatar
                                    alt="Remy Sharp"
                                    src={item?.avatar}
                                    sx={{
                                      width: "50px",
                                      height: "50px",
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
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                      width: "100%",
                                    }}
                                  >
                                    <BoxNotReadName
                                      // isRead={item?.isRead}
                                      isRead={true}
                                      sx={{
                                        fontSize: "16px",
                                      }}
                                    >
                                      {item?.name}
                                    </BoxNotReadName>
                                    <Box
                                      sx={{
                                        fontSize: "12px",
                                        color: "#758390",
                                      }}
                                    >
                                      {item?.lastMessage?.time}
                                    </Box>
                                  </Box>
                                  <BoxNotReadContent
                                    isRead={item?.isRead}
                                    component="div"
                                    sx={{
                                      textOverflow: "ellipsis",
                                      overflow: "hidden",
                                      maxWidth: "80%",
                                      fontSize: "14px",
                                    }}
                                  >
                                    {currentUser?.id ===
                                    item?.lastMessage?.userId
                                      ? "Bạn: " + item?.lastMessage?.content
                                      : item?.lastMessage?.content}
                                  </BoxNotReadContent>
                                </Box>
                              </ListItem>
                            </StyledNavLink>
                          </ListItemButton>
                        )
                    )}
                  </List>
                </TabPanel>
              </TabContext>
            )}
          </Box>
        )}
      </BoxResponsive>

      <Outlet
        context={{ conversationSelected, socket, newMessage, deleteMessage }}
      />
      {open && (
        <AddFriend
          open={open}
          handleCloseAddFriend={handleCloseAddFriend}
          openProfileFriend={openProfileFriend}
          handleCloseProfileFriend={handleCloseProfileFriend}
          handleOpenProfileFriend={handleOpenProfileFriend}
          handleDeleteFriendConversation={handleDeleteFriendConversation}
          handleAcceptFriendConversation={handleAcceptFriendConversation}
          context={socket}
        />
      )}
      {openAddGroup && (
        <AddGroup
          openAddGroup={openAddGroup}
          setOpenAddGroup={setOpenAddGroup}
        />
      )}
    </Box>
  );
}
