import {
  ArrowBackIosOutlined,
  AttachmentOutlined,
  DeleteOutlined,
  ImageOutlined,
  InsertEmoticonOutlined,
  LabelOutlined,
  PermContactCalendarOutlined,
  Search,
  TableChartOutlined,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  AvatarGroup,
  Box,
  Divider,
  Drawer,
  IconButton,
  ImageList,
  ImageListItem,
  LinearProgress,
  Snackbar,
  useMediaQuery,
} from "@mui/material";
import axiosClient from "api/axiosClient";
import React, { memo, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import styled from "styled-components";

const StyledBox = styled(Box)`
  height: 68px;
  width: 100%;
  backgroundcolor: #fff;
  padding: 0px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledForm = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  height: 100%;
  outline: none;
  border: none;
  padding: 0px 16px;
  background-color: #fff;
  font-size: 16px;
`;

const StyledButtonSubmit = styled.button`
  height: 40px;
  text-align: center;
  background-color: #fff;
  border: none;
  outline: none;
  margin-right: 16px;
  font-size: 16px;
  color: #0068ff;
  cursor: pointer;
  padding: 8px;
  font-weight: bold;
  &:hover {
    background-color: #b8d5f5;
    border-radius: 4px;
  }
`;
const StyledLabel = styled.label`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledInputImage = styled.input`
  display: none;
`;

const ImgMessage = styled.img`
  max-width: 50%;
  height: auto;
  border-radius: 4px;
`;

const BoxImg = styled(Box)`
  margin-right: ${(props) => (props.first ? "32px" : "0px")};
`;

const Chat = (props) => {
  let param = useParams();
  const user = useSelector((state) => state.global.currentUser);
  const [currentUser, setCurrentUser] = useState(user);
  const [conversationSelected, setConversationSelected] = useState(null);
  const a = useOutletContext();
  const c = a.conversationSelected;
  const newMessage = a.newMessage;
  const deleteMessage = a.deleteMessage;
  // const socket = a.socket;
  // console.log(socket);

  useEffect(() => {
    setConversationSelected(c);
  }, [c]);

  const [content, setContent] = useState("");
  const [imageInputSate, setImageInputSate] = useState("");

  const [deleteConversationLoading, setDeleteConversationLoading] =
    useState(false);

  const [listMessage, setListMessage] = useState([]);

  const [open, setOpen] = useState(false);

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openUploadImgSuscess, setOpenUploadImgSuscess] = useState(false);
  const [openUploadImgError, setOpenUploadImgError] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
    setOpenUploadImgSuscess(false);
    setOpenUploadImgError(false);
  };

  const navigate = useNavigate();
  const matches = useMediaQuery("(min-width:800px)");
  const isHideAvatar = useMediaQuery("(min-width:400px)");

  const messageRef = useRef({});

  const chatRefs = useRef({});

  // console.log(chatRefs.current);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);
  useEffect(() => {
    let cancel = true;
    if (param.chatId) {
      // console.log("first");
      async function fetchData() {
        await axiosClient
          .get(`/conversation/${param.chatId.toString()}`)
          .then((res) => {
            if (cancel) setConversationSelected(res.data);
            // console.log(res.data);
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
      async function fetchMessage() {
        await axiosClient
          .get(`/message/${param.chatId.toString()}`)
          .then((res) => {
            if (cancel) setListMessage(res.data);
          })
          .catch((err) => {
            console.log(err.response);
          });
      }
      if (!c) {
        fetchData();
      }

      fetchMessage();
    }

    return () => {
      cancel = false;
    };
  }, [param.chatId, c]);

  useEffect(() => {
    if (
      newMessage &&
      newMessage?._id !== listMessage[listMessage.length - 1]?._id &&
      newMessage.conversationId === conversationSelected?.conversationId
    ) {
      // console.log(newMessage);
      setListMessage([...listMessage, newMessage]);
    }
  }, [listMessage, newMessage, conversationSelected]);

  useEffect(() => {
    if (
      deleteMessage &&
      deleteMessage?.conversationId === conversationSelected?.conversationId
    ) {
      const index = listMessage.findIndex(
        (item) => item._id === deleteMessage.messageId
      );
      if (index !== -1) {
        // console.log(listMessage);

        // console.log(index);
        const newList = [...listMessage];
        newList.splice(index, 1);
        // console.log(newList);
        setListMessage(newList);
      }
    }
  }, [deleteMessage, conversationSelected, listMessage]);

  // console.log(listMessage);

  useEffect(() => {
    chatRefs.current.scrollTop = chatRefs.current?.scrollHeight;
    return () => {
      // console.log("unmount");
    };
  }, [chatRefs, listMessage]);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setOpen(open);
  };

  const handleChangeImage = async (e) => {
    const file = e.target.files[0];
    setOpenSnackbar(true);
    if (file) {
      setImageInputSate(e.target.value);
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        await axiosClient
          .post("/message", {
            conversationId: conversationSelected.conversationId,
            content: reader.result,
            type: "image",
          })
          .then((response) => {
            setListMessage([...listMessage, response.data]);
            setOpenSnackbar(false);
            setOpenUploadImgSuscess(true);
          })
          .catch((error) => {
            console.log(error.response);
          });
      };
      reader.onerror = () => {
        console.error("AHHHHHHHH!!");
        setOpenSnackbar(false);
        setOpenUploadImgError(true);
      };
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const message = content;
    setContent("");
    if (message.trim() !== "") {
      await axiosClient
        .post("/message", {
          conversationId: conversationSelected.conversationId,
          content: message,
          type: "text",
        })
        .then((res) => {
          // console.log(res);
          setListMessage([...listMessage, res.data]);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
  };
  const handleDeleteMessage = async (id) => {
    // console.log(id);
    await axiosClient
      .delete(`/message/${id}`)
      .then((res) => {
        // console.log(res);
        // setListMessage(listMessage.filter((item) => item._id !== id));
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  // console.log(listMessage);

  const handleDeleteConversation = async () => {
    // console.log(conversationSelected);
    setDeleteConversationLoading(true);
    await axiosClient
      .delete(`/conversation/${conversationSelected.conversationId}`)
      .then((res) => {
        // console.log(res);
        setDeleteConversationLoading(false);
        navigate("/chats");
      })
      .catch((err) => {
        setDeleteConversationLoading(false);
        console.log(err.response);
      });
  };
  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
      }}
    >
      <StyledBox>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {!matches && (
            <IconButton
              aria-label="back"
              sx={{ marginRight: "10px" }}
              onClick={() => {
                navigate("/chats");
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
          {isHideAvatar ? (
            !conversationSelected?.type ||
            typeof conversationSelected?.avatar === "string" ||
            !conversationSelected?.avatar ? (
              conversationSelected?.avatar ? (
                <Avatar
                  alt="Remy Sharp"
                  src={conversationSelected?.avatar}
                  sx={{
                    width: "48px",
                    height: "48px",
                  }}
                />
              ) : (
                <Avatar
                  alt="Remy Sharp"
                  sx={{
                    width: "48px",
                    height: "48px",
                  }}
                />
              )
            ) : (
              <AvatarGroup
                max={4}
                sx={{
                  width: "48px",
                  height: "48px",
                }}
              >
                {conversationSelected?.avatar.map((avatar, index) => (
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
            )
          ) : (
            <></>
          )}

          <Box
            sx={{
              marginLeft: "16px",
            }}
          >
            <Box
              sx={{
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              {conversationSelected?.name}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              {conversationSelected?.type && (
                <Box
                  sx={{
                    fontSize: "15px",
                    color: "#001A33",
                    paddingRight: "5px",
                    position: "relative",
                    marginRight: "5px",
                    "&:after": {
                      content: '" "',
                      position: "absolute",
                      top: "50%",
                      transform: "translateY(-50%)",
                      left: "100%",
                      width: "1px",
                      height: "12px",
                      background: "#E1E4EA",
                    },
                  }}
                >{`${conversationSelected?.members.length} thành viên`}</Box>
              )}

              <LabelOutlined
                sx={{
                  fontSize: "20px",
                  color: "#98a2ac",
                }}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <Search
            sx={{
              width: "32px",
              height: "32px",
              padding: "4px",
              color: "#394e5f",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              },
              cursor: "pointer",
            }}
          />
          {/* <VideocamOutlined
            sx={{
              width: "32px",
              height: "32px",
              padding: "4px",
              marginLeft: "8px",
              color: "#394e5f",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              },
              cursor: "pointer",
            }}
          /> */}
          <TableChartOutlined
            onClick={toggleDrawer(true)}
            sx={{
              width: "32px",
              height: "32px",
              padding: "4px",
              marginLeft: "8px",
              color: "#394e5f",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                borderRadius: "4px",
              },
              cursor: "pointer",
            }}
          />
        </Box>
      </StyledBox>
      <Divider />

      <Box
        ref={chatRefs}
        sx={{
          width: "100%",
          backgroundColor: "#f4f5f7",
          height: "calc(100% - 170px)",
          borderBottom: 1,
          borderColor: "divider",
          overflowY: "scroll",
          paddingBottom: "40px",
        }}
      >
        {listMessage.map((message, index) => {
          if (message?.userId === currentUser?.id) {
            return (
              <Box
                key={message?._id}
                sx={{ width: "100%", paddingTop: "6px" }}
                ref={(el) =>
                  (messageRef.current = {
                    ...messageRef.current,
                    [message._id]: el,
                  })
                }
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "row-reverse",
                  }}
                >
                  {index === 0 ||
                  listMessage[index - 1]?.userId !== currentUser?.id ? (
                    <Avatar
                      alt="avatar"
                      src={currentUser?.avatar}
                      sx={{
                        width: "40px",
                        height: "40px",
                        marginRight: "8px",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "40px",
                        height: "40px",
                        marginRight: "8px",
                        // backgroundColor: "green",
                      }}
                    ></Box>
                  )}
                  {message.type === "text" && (
                    <Box
                      sx={{
                        textAlign: "left",
                        backgroundColor: "#e5efff",
                        borderRadius: "6px",
                        padding: "10px",
                        boxShadow: "0 1px 0 0 rgba(0,0,0,0.18)",
                        maxWidth: "80%",
                        marginRight: "8px",
                        wordWrap: "break-word",
                        fontSize: "15px",
                        position: "relative",
                        cursor: "pointer",
                        "&:hover": {
                          "& .iconDelete": {
                            display: "block",
                          },
                        },
                      }}
                    >
                      <Box
                        className="iconDelete"
                        onClick={() => {
                          handleDeleteMessage(message._id);
                        }}
                        sx={{
                          display: "none",
                          position: "absolute",
                          right: "100%",
                          color: "#98a2ac",
                          "&:hover": {
                            color: "#394e5f",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <DeleteOutlined />
                      </Box>
                      <Box>{message?.content}</Box>
                      {index === listMessage.length - 1 ||
                      listMessage[index]?.userId !==
                        listMessage[index + 1]?.userId ? (
                        <Box
                          sx={{
                            fontSize: "13px",
                            color: "rgba(0,0,0,0.5)",
                            paddingTop: "5px",
                          }}
                        >
                          {new Date(message?.createdAt).getHours() +
                            ":" +
                            new Date(message?.createdAt).getMinutes()}
                        </Box>
                      ) : (
                        <></>
                      )}
                    </Box>
                  )}
                  {message?.type === "image" && (
                    <BoxImg
                      first={
                        index === 0 ||
                        !(listMessage[index - 1]?.userId !== currentUser?.id)
                      }
                      sx={{
                        display: "flex",
                        flexDirection: "row-reverse",
                        position: "relative",
                        cursor: "pointer",
                        // marginRight: "40px",
                        "&:hover": {
                          "& .iconDelete": {
                            display: "block",
                          },
                        },
                        "&:click": {
                          "& .iconDelete": {
                            display: "block",
                          },
                        },
                      }}
                    >
                      <Box
                        className="iconDelete"
                        onClick={() => {
                          handleDeleteMessage(message._id);
                        }}
                        sx={{
                          display: "none",
                          position: "absolute",
                          right: "calc(50% + 10px)",
                          top: "20px",
                          color: "#98a2ac",

                          "&:hover": {
                            color: "#394e5f",
                            cursor: "pointer",
                          },
                        }}
                      >
                        <DeleteOutlined />
                      </Box>
                      <ImgMessage
                        src={message?.content}
                        alt="img-message"
                        style={{ marginRight: "8px" }}
                      />
                    </BoxImg>
                  )}
                </Box>
              </Box>
            );
          } else {
            return (
              <Box key={message?._id} sx={{ width: "100%", paddingTop: "6px" }}>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    paddingLeft: "8px",
                    // flexDirection: "row-reverse",
                  }}
                >
                  {index === 0 ||
                  listMessage[index - 1]?.userId === currentUser?.id ? (
                    <Avatar
                      alt="avatar"
                      src={message?.user?.avatar}
                      sx={{
                        width: "40px",
                        height: "40px",
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        width: "40px",
                        height: "40px",
                      }}
                    ></Box>
                  )}

                  {message.type === "text" && (
                    <Box
                      sx={{
                        textAlign: "left",
                        backgroundColor: "#fff",
                        borderRadius: "4px",
                        padding: "8px",
                        boxShadow: "0 1px 0 0 rgba(0,0,0,0.18)",
                        maxWidth: "80%",
                        marginLeft: "8px",
                        wordWrap: "break-word",
                        fontSize: "15px",
                      }}
                    >
                      {(index === 0 ||
                        listMessage[index - 1]?.userId === currentUser?.id) &&
                      conversationSelected?.type ? (
                        <Box
                          sx={{
                            fontSize: "13px",
                            color: "#72808E",
                          }}
                        >
                          {message?.user?.userName}
                        </Box>
                      ) : (
                        <></>
                      )}
                      <Box>{message?.content}</Box>
                      {index === listMessage.length - 1 ||
                      listMessage[index]?.userId !==
                        listMessage[index + 1]?.userId ? (
                        <Box
                          sx={{
                            fontSize: "13px",
                            color: "rgba(0,0,0,0.5)",
                            paddingTop: "5px",
                          }}
                        >
                          {new Date(message?.createdAt).getHours() +
                            ":" +
                            new Date(message?.createdAt).getMinutes()}
                        </Box>
                      ) : (
                        <></>
                      )}
                    </Box>
                  )}
                  {message?.type === "image" && (
                    <ImgMessage
                      src={message?.content}
                      alt="img-message"
                      style={{
                        marginLeft: "8px",
                      }}
                    />
                  )}
                </Box>
              </Box>
            );
          }
        })}
      </Box>

      <Box
        sx={{
          width: "100%",
          height: "102px",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "46px",
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            padding: "0 16px",
          }}
        >
          <Box
            sx={{
              width: "40px",
              height: "40px",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "8px",
              "&:hover": {
                backgroundColor: "#eeeff2",
              },
            }}
          >
            <StyledInputImage
              value={imageInputSate}
              onChange={handleChangeImage}
              accept="image/*"
              id="icon-button-image"
              type="file"
            />
            <StyledLabel htmlFor="icon-button-image">
              <ImageOutlined
                sx={{
                  width: "30px",
                  height: "30px",
                  color: "#394e5f",
                }}
              />
            </StyledLabel>
          </Box>
          <Box
            sx={{
              width: "40px",
              height: "40px",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "8px",
              "&:hover": {
                backgroundColor: "#eeeff2",
              },
            }}
          >
            <AttachmentOutlined
              sx={{
                width: "30px",
                height: "30px",
                color: "#394e5f",
              }}
            />
          </Box>
          <Box
            sx={{
              width: "40px",
              height: "40px",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "8px",
              "&:hover": {
                backgroundColor: "#eeeff2",
              },
            }}
          >
            <PermContactCalendarOutlined
              sx={{
                width: "30px",
                height: "30px",
                color: "#394e5f",
              }}
            />
          </Box>
        </Box>

        <Box
          sx={{
            width: "100%",
            height: "56px",
          }}
        >
          <StyledForm onSubmit={handleSendMessage}>
            <StyledInput
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Nhập @, tin nhắn tới ${conversationSelected?.name}`}
            />
            <Box
              sx={{
                width: "40px",
                height: "40px",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "8px",
                "&:hover": {
                  backgroundColor: "#eeeff2",
                },
              }}
            >
              <InsertEmoticonOutlined />
            </Box>
            <StyledButtonSubmit type="submit">GỬI</StyledButtonSubmit>
          </StyledForm>
        </Box>
      </Box>

      <Drawer
        anchor={"right"}
        open={open}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            width: "343px",
          },
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f4f5f7",
          }}
        >
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
              height: "68px",
              lineHeight: "68px",
              fontSize: "18px",
              fontWeight: "500",
              backgroundColor: "#fff",
            }}
          >
            Thông tin hội thoại
          </Box>

          <Divider />
          <Box
            sx={{
              height: "130px",
              width: "100%",
              backgroundColor: "#fff",
              display: "flex",
              flexDirection: "column",
              padding: "12px",
              alignItems: "center",
            }}
          >
            {!conversationSelected?.type ||
            typeof conversationSelected?.avatar === "string" ||
            !conversationSelected?.avatar ? (
              conversationSelected?.avatar ? (
                <Avatar
                  alt="Remy Sharp"
                  src={conversationSelected?.avatar}
                  sx={{
                    width: "56px",
                    height: "56px",
                    margin: "12px 0px",
                  }}
                />
              ) : (
                <Avatar
                  alt="Remy Sharp"
                  // src={conversationSelected?.avatar}
                  sx={{
                    width: "56px",
                    height: "56px",
                    margin: "12px 0px",
                  }}
                />
              )
            ) : (
              <AvatarGroup
                max={4}
                sx={{
                  width: "56px",
                  height: "56px",
                  margin: "12px 0px",
                }}
              >
                {conversationSelected?.avatar.map((avatar, index) => (
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

            <Box
              sx={{
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              {conversationSelected?.name}
            </Box>
          </Box>
          <Box
            sx={{
              marginTop: "8px",
              width: "100%",
              padding: "10px 16px",
              backgroundColor: "#fff",
            }}
          >
            <Box
              sx={{
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Ảnh/Video
            </Box>
            <Box
              sx={{
                width: "100%",
                height: "calc(100vh - 324px)",
              }}
            >
              <ImageList
                sx={{ width: "100%", height: "100%" }}
                cols={2}
                rowHeight={164}
              >
                {listMessage.map((item) => {
                  if (item?.type === "image") {
                    return (
                      <ImageListItem key={item?._id}>
                        <img
                          src={`${item?.content}?w=164&h=164&fit=crop&auto=format`}
                          srcSet={`${item?.content}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                          alt="img"
                          loading="lazy"
                        />
                      </ImageListItem>
                    );
                  } else {
                    return <Box key={item?._id} sx={{ display: "none" }}></Box>;
                  }
                })}
              </ImageList>
            </Box>
          </Box>
          <Box
            sx={{
              position: "fixed",
              bottom: "0px",
              height: "48px",
              width: "100%",
              backgroundColor: "#fff",
              marginTop: "8px",
              color: "#dd5c56",
            }}
          >
            <Box
              sx={{
                display: "flex",
                width: "100%",
                height: "100%",
                alignItems: "center",
                padding: "0px 16px",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              <DeleteOutlined
                sx={{
                  fontSize: "28px",
                }}
              />
              <Box
                sx={{
                  marginLeft: "8px",
                }}
                onClick={handleDeleteConversation}
              >
                Xoá lịch sử trò chuyện
                {deleteConversationLoading && <LinearProgress />}
              </Box>
            </Box>
          </Box>
        </Box>
      </Drawer>
      {/* <Stack spacing={2} sx={{ width: "100%" }}></Stack> */}
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnackbar}
        // onClose={handleClose}
      >
        <Alert severity="info">Đang tải !!!!</Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openUploadImgSuscess}
        onClose={handleClose}
        autoHideDuration={6000}
      >
        <Alert severity="success" onClose={handleClose}>
          Đã tải xong !!!
        </Alert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openUploadImgError}
        onClose={handleClose}
        autoHideDuration={6000}
      >
        <Alert severity="error" onClose={handleClose}>
          Lỗi tải ảnh !!!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default memo(Chat);
