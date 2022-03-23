import {
  GroupAddOutlined,
  PersonAddOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@mui/material";
import axiosClient from "api/axiosClient";
import React, { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";
import styled from "styled-components";
import AddFriend from "../AddFriend";
import AddGroup from "../AddGroup";

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

const StyledBox = styled(Box)`
  width: ${(props) => (props.matches ? "309px" : "100%")};
  margin-top: 16px;
`;
const SmallAvatar = styled(Avatar)`
  width: 15px;
  height: 15px;
`;

const ListItemButtonMatches = styled(ListItemButton)`
  width: ${(props) => (props.matches === "true" ? "309px" : "100%")};
`;

export default function ContactSideBar() {
  const [isSearch, setIsSearch] = useState(false);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [listConversation, setListConversation] = useState([]);

  const [listFriend, setListFriend] = useState([]);

  const socket = useOutletContext();

  const [openProfileFriend, setOpenProfileFriend] = useState(false);

  const [openAddGroup, setOpenAddGroup] = useState(false);

  const matches = useMediaQuery("(min-width:800px)");

  const location = useLocation();
  const isHide = location.pathname === "/contacts";
  const navigate = useNavigate();

  useEffect(() => {
    let cancel = true;
    async function getListConversation() {
      await axiosClient
        .get("/conversation")
        .then((res) => {
          if (cancel) {
            setListConversation(res.data);
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    getListConversation();
    return () => {
      cancel = false;
    };
  }, []);

  useEffect(() => {
    let cancel = true;
    async function getListFriend() {
      await axiosClient
        .get("/friend")
        .then((res) => {
          if (cancel) {
            // console.log(res.data);
            setListFriend(res.data);
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    getListFriend();
    return () => {
      cancel = false;
    };
  }, []);

  useEffect(() => {
    if (isHide && matches) {
      navigate("/contacts/list-add-friend");
    }
  }, [isHide, navigate, matches]);

  // console.log(!isHide & !matches);

  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  const handleClose = (event) => {
    setIsSearch(false);
    setSearch("");
  };

  const handleOpenAddFriend = () => setOpen(true);
  const handleCloseAddFriend = () => {
    setOpen(false);
    setOpenProfileFriend(false);
  };
  const handleOpenProfileFriend = () => setOpenProfileFriend(true);
  const handleCloseProfileFriend = () => setOpenProfileFriend(false);
  const handleDeleteFriendConversation = (member1, member2) => {
    // console.log(member1, member2);
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

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        overflow: "hidden",
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
                  type="text"
                  placeholder="Tìm kiếm"
                  value={search}
                  onChange={handleSearch}
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
              {listConversation.map((item) => (
                <ListItemButton
                  sx={{
                    padding: "0px",
                  }}
                  key={item.conversationId}
                >
                  <StyledNavLink
                    to={`/chats/${item.conversationId.toString()}`}
                  >
                    <ListItem alignItems="center">
                      <ListItemAvatar>
                        <Avatar
                          alt="Remy Sharp"
                          src={item.avatar}
                          sx={{
                            width: "50px",
                            height: "50px",
                            marginRight: "10px",
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText primary={item.name} />
                    </ListItem>
                  </StyledNavLink>
                </ListItemButton>
              ))}
            </List>
          </StyledBox>
        ) : (
          <Box sx={{ width: "100%" }}>
            {!(!isHide & !matches) && (
              <List
                sx={{
                  width: "100%",
                  marginTop: "20px",
                  padding: 0,
                  bgcolor: "background.paper",
                  maxHeight: "calc(100vh - 94px)",
                  overflowY: "auto",
                }}
              >
                <ListItemButtonMatches
                  matches={matches.toString()}
                  sx={{
                    padding: "8px 16px",
                  }}
                  key="add=friend"
                  onClick={handleOpenAddFriend}
                >
                  <PersonAddOutlined
                    sx={{
                      color: "#0368ff",
                    }}
                  />
                  <Box
                    sx={{
                      marginLeft: "10px",
                      fontSize: "17px",
                      color: "#001A33",
                    }}
                  >
                    Thêm bạn
                  </Box>
                </ListItemButtonMatches>
                <ListItemButton
                  sx={{
                    padding: "0px",
                  }}
                  key="list-add-friend"
                >
                  <StyledNavLink to="list-add-friend">
                    <ListItem alignItems="center">
                      <ListItemAvatar>
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
                              width: "52px",
                              height: "52px",
                            }}
                            alt="Travis Howard"
                            src="https://chat.zalo.me/assets/NewFr@2x.820483766abed8ab03205b8e4a8b105b.png"
                          />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText primary="Danh sách kết bạn" />
                    </ListItem>
                  </StyledNavLink>
                </ListItemButton>
                <ListItemButton
                  sx={{
                    padding: "0px",
                    // borderBottom: "1px solid #e7eaef",
                  }}
                  key="list-group"
                >
                  <StyledNavLink to="list-group">
                    <ListItem alignItems="center">
                      <ListItemAvatar>
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
                              width: "52px",
                              height: "52px",
                            }}
                            alt="Travis Howard"
                            src="https://chat.zalo.me/assets/group@2x.2d184edd797db8782baa0d5c7a786ba0.png"
                          />
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText primary="Danh sách nhóm" />
                    </ListItem>
                  </StyledNavLink>
                </ListItemButton>
                <Divider />
                <Box
                  sx={{
                    padding: "5px 16px",
                    fontSize: "15px",
                    color: "#001A33",
                    marginBottom: "10px",
                  }}
                >{`Bạn bè (${listFriend.length})`}</Box>

                {listFriend.map((item) => (
                  <ListItemButton
                    sx={{
                      padding: "0px",
                    }}
                    key="item._id"
                  >
                    <StyledNavLink to={`/chats/${item.conversationId}`}>
                      <ListItem alignItems="center">
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: "48px",
                              height: "48px",
                            }}
                            alt={`avatar-${item.userName}`}
                            src={item.avatar}
                          />
                        </ListItemAvatar>
                        <ListItemText primary={item.userName} />
                      </ListItem>
                    </StyledNavLink>
                  </ListItemButton>
                ))}
              </List>
            )}
          </Box>
        )}
      </BoxResponsive>
      <Outlet context={socket} />
      {open && (
        <AddFriend
          open={open}
          handleCloseAddFriend={handleCloseAddFriend}
          openProfileFriend={openProfileFriend}
          handleCloseProfileFriend={handleCloseProfileFriend}
          handleOpenProfileFriend={handleOpenProfileFriend}
          handleDeleteFriendConversation={handleDeleteFriendConversation}
          handleAcceptFriendConversation={handleAcceptFriendConversation}
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
