import { Close, PhotoCamera, SearchOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import axiosClient from "api/axiosClient";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 520,
  bgcolor: "background.paper",
  borderRadius: "4px",
};
const StyledLabel = styled.label`
  display: flex;
  align-items: center;
  padding-left: 4px;
`;
const StyledInput = styled.input`
  height: 38px;
  width: 100%;
  border: none;
  outline: none;
  margin-left: 4px;
  border-radius: 18px;
  "&:focus": {
    border: 1px solid #0092ff;
  }
`;
const StyledInputAvatar = styled.input`
  display: none;
`;
export default function AddGroup({ openAddGroup, setOpenAddGroup }) {
  const [checked, setChecked] = useState([]);

  const [listFriends, setListFriends] = useState([]);

  const [groupName, setGroupName] = useState("");
  const [listSearch, setListSearch] = useState([]);

  const [selectFile, setSelectFile] = useState("");

  const [previewFileSource, setPreviewSource] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleSearch = (e) => {
    const search = e.target.value;
    if (search.trim() !== "") {
      const list = listFriends.filter((friend) => {
        return friend.userName.toLowerCase().includes(search.toLowerCase());
      });
      setListSearch(list);
    } else {
      setListSearch(listFriends);
    }
  };
  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };
  //   console.log(checked);
  const handleClose = () => {
    setOpenAddGroup(false);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      previewFile(file);
      setSelectFile(e.target.value);
    }
  };
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleCreateGroup = async () => {
    setLoading(true);
    const group = {
      name: groupName,
      avatar: previewFileSource,
      users: checked,
    };
    await axiosClient
      .post("/conversation", group)
      .then((res) => {
        // console.log(res.data);
        setLoading(false);
        setOpenAddGroup(false);
      })
      .catch((err) => {
        console.log(err.response);
        setLoading(false);
      });
  };

  useEffect(() => {
    let cancel = true;
    async function getListFriends() {
      await axiosClient
        .get("/friend")
        .then((res) => {
          if (cancel) {
            // console.log(res.data);
            setListFriends(res.data);
            setListSearch(res.data);
          }
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    getListFriends();
    return () => {
      cancel = false;
    };
  }, []);
  return (
    <Modal
      open={openAddGroup}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            height: "49px",
            width: "100%",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0px 10px",
            // borderBottom: 1,
            // borderColor: "divider",
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
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Tạo nhóm
            </Box>
          </Box>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "64px",
            padding: "16px 16px 0 16px",
            // backgroundColor: "#fbfbfd",
          }}
        >
          <StyledInputAvatar
            onChange={handleFileInputChange}
            value={selectFile}
            accept="image/*"
            id="icon-button-file"
            type="file"
          />
          <StyledLabel htmlFor="icon-button-file">
            <Box
              sx={{
                height: "48px",
                width: "48px",
                borderRadius: "50%",
                border: "1px solid #e1e4ea",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#72808e",
                fontSize: "28px",
                marginRight: "16px",
              }}
            >
              {previewFileSource ? (
                <Avatar alt="Remy Sharp" src={previewFileSource} />
              ) : (
                <PhotoCamera />
              )}
            </Box>
          </StyledLabel>
          <Box
            sx={{
              width: "calc(100% - 48px - 16px)",
            }}
          >
            <TextField
              sx={{
                width: "100%",
                fontSize: "14px",
                color: "#001a33",
              }}
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              id="outlined-basic"
              autoComplete="off"
              placeholder="Nhập tên nhóm ..."
              variant="standard"
            />
          </Box>
        </Box>
        <Box
          sx={{
            padding: "16px 16px 0 16px",
          }}
        >
          <Box
            sx={{
              marginBottom: "8px",
            }}
          >
            Thêm bạn vào nhóm
          </Box>
          <Box
            sx={{
              //   backgroundColor: "#e7eaef",
              border: "1px solid #e1e4ea",
              marginRight: "4px",
              borderRadius: "18px",
              paddingLeft: "4px",
              paddingRight: "8px",
              width: "100%",
            }}
          >
            <StyledLabel>
              <SearchOutlined />
              <StyledInput
                type="text"
                placeholder="Nhập tên bạn bè ..."
                // value={searchName}
                onChange={(e) => handleSearch(e)}
              />
            </StyledLabel>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            padding: "16px 16px 0 16px",
            marginBottom: "16px",
          }}
        >
          <Typography
            sx={{
              padding: "2px 12px",
              borderRadius: "12px",
              backgroundColor: "#0068ff",
              color: "white",
              fontSize: "13px",
            }}
          >
            Bạn bè
          </Typography>
        </Box>

        <Box sx={{ padding: "0 16px" }}>
          <Divider />
        </Box>
        <Box
          sx={{
            padding: "16px",
            height: "400px",
            overflowY: "scroll",
          }}
        >
          <List dense sx={{ width: "100%", bgcolor: "background.paper" }}>
            {listSearch.map((friend) => {
              return (
                <ListItem
                  key={friend._id}
                  //   secondaryAction={

                  //   }
                  disablePadding
                >
                  <ListItemButton onClick={handleToggle(friend._id)}>
                    <Checkbox
                      edge="start"
                      checked={checked.indexOf(friend._id) !== -1}
                    />
                    <ListItemAvatar>
                      <Avatar
                        alt={`Avatar n°${friend.userName + 1}`}
                        src={friend.avatar}
                      />
                    </ListItemAvatar>
                    <ListItemText id={friend._id} primary={friend.userName} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>
        <Divider />
        <Box
          sx={{
            padding: "14px 16px",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            sx={{
              marginRight: "8px",
              backgroundColor: "#E8EAEF",
              color: "#001a33",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#E1E4EA",
              },
            }}
            onClick={handleClose}
          >
            Huỷ
          </Button>
          <LoadingButton
            loading={loading}
            onClick={handleCreateGroup}
            disabled={checked.length === 0 || groupName === ""}
            variant="contained"
            sx={{
              backgroundColor: "#0068ff",
              textTransform: "none",
            }}
          >
            Tạo nhóm
          </LoadingButton>
        </Box>
      </Box>
    </Modal>
  );
}
