import { CameraAlt, Close, Send } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import {
  Avatar,
  Badge,
  Button,
  FormControlLabel,
  FormHelperText,
  IconButton,
  OutlinedInput,
  Radio,
  RadioGroup,
} from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import meApi from "api/meApi";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: "#fff",
  borderRadius: 1,
};

const StyledImg = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

const StyledInputDate = styled.input`
  height: 38px;
  width: 100%;
  margin-bottom: 16px;
  padding-left: 8px;
`;
const StyledButtonCanel = styled(Button)`
  &:hover {
    background-color: #c9ccd1;
  }
`;

const StyledInputAvatar = styled.input`
  display: none;
`;

const StyledLabel = styled.label`
  cursor: pointer;
`;

export default function Account(props) {
  const { open, setAccountOpen } = props;

  // const currentUser = useSelector((state) => state.global.currentUser);
  const loading = useSelector((state) => state.global.logging);

  const [currentUser, setCurrentUser] = useState(null);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const [gender, setGender] = useState(null);
  const [fileInputState, setFileInputState] = useState("");
  const [selectFile, setSelectFile] = useState("");

  // console.log(fileInputState);
  const [previewFileSource, setPreviewSource] = useState(currentUser?.avatar);

  const dispatch = useDispatch();

  useEffect(() => {
    meApi
      .getInfo()
      .then((res) => {
        setCurrentUser(res);
        setName(res.userName);
        setDate(new Date(res.dateOfBirth).toISOString().substring(0, 10));
        setGender(res.gender);
        setPreviewSource(res.avatar);

        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleClose = () => {
    setAccountOpen(false);
    setFileInputState("");
  };
  const handleGender = (event) => {
    setGender(event.target.value);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      previewFile(file);
      setSelectFile(file);
      setFileInputState(e.target.value);
    }
  };

  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectFile) {
      const reader = new FileReader();
      reader.readAsDataURL(selectFile);
      reader.onloadend = () => {
        // uploadImage(reader.result);
        const user = {
          _id: currentUser.id,
          userName: name,
          dateOfBirth: date,
          gender: gender,
          avatar: reader.result,
        };
        meApi.updateProfile(user, dispatch);
      };
      reader.onerror = () => {
        console.error("AHHHHHHHH!!");
        // setErrMsg("something went wrong!");
      };
    } else {
      const user = {
        _id: currentUser.id,
        userName: name,
        dateOfBirth: date,
        gender: gender,
      };
      await meApi.updateProfile(user, dispatch);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              height: "50px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0px 8px",
            }}
          >
            <Box
              sx={{
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Cập nhật thông tin
            </Box>
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <Box>
            <StyledImg
              src="https://cover-talk.zadn.vn/8/1/5/b/1/51e4de33e732535f0bb7d733c86d15e7.jpg"
              alt="anh nen"
            />
          </Box>
          {/* <FormControl sx={{ width: "100%" }} variant="outlined"> */}
          <Box
            component="form"
            noValidate
            sx={{
              width: "100%",
            }}
          >
            <Box
              sx={{
                position: "relative",
              }}
            >
              <StyledInputAvatar
                onChange={handleFileInputChange}
                value={fileInputState}
                accept="image/*"
                id="icon-button-file"
                type="file"
              />
              <StyledLabel htmlFor="icon-button-file">
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={<CameraAlt />}
                  sx={{
                    position: "absolute",
                    top: "0%",
                    left: "50%",
                    transform: "translate(-50%, -130%)",
                  }}
                >
                  <Avatar
                    src={previewFileSource}
                    sx={{
                      width: 80,
                      height: 80,
                    }}
                  />
                </Badge>
              </StyledLabel>
            </Box>
            <Box
              sx={{
                width: "100%",
                marginTop: "60px",
                marginBottom: "20px",
                padding: "0px 12px",
              }}
            >
              <FormHelperText
                id="name-helper-text"
                sx={{
                  fontSize: "14px",
                  color: "#001933",
                  margin: 0,
                }}
              >
                Tên hiển thị
              </FormHelperText>
              <OutlinedInput
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  height: "38px",
                  marginBottom: "16px",
                  width: "100%",
                }}
              />
              <FormHelperText
                id="email-helper-text"
                sx={{
                  fontSize: "14px",
                  color: "#001933",
                  margin: 0,
                }}
              >
                Email đăng ký
              </FormHelperText>
              <OutlinedInput
                id="email"
                value={currentUser?.email ? currentUser.email : ""}
                // value={email}
                // onChange={(e) => setEmail(e.target.value)}
                disabled
                sx={{
                  height: "38px",
                  marginBottom: "16px",
                  width: "100%",
                }}
              />
              <FormHelperText
                id="date-helper-text"
                sx={{
                  fontSize: "14px",
                  color: "#001933",
                  margin: 0,
                }}
              >
                Ngày sinh
              </FormHelperText>
              <StyledInputDate
                type="date"
                id="date"
                name="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <FormHelperText
                id="gender-helper-text"
                sx={{
                  fontSize: "14px",
                  color: "#001933",
                  margin: 0,
                }}
              >
                Giới tính
              </FormHelperText>
              <RadioGroup
                row
                name="gender"
                value={gender}
                onChange={handleGender}
              >
                <FormControlLabel
                  value={true}
                  control={<Radio />}
                  label="Nam"
                />
                <FormControlLabel
                  value={false}
                  control={<Radio />}
                  label="Nữ"
                />
              </RadioGroup>
            </Box>
          </Box>
          {/* </FormControl> */}
          <Box
            sx={{
              margin: "16px",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <StyledButtonCanel
              onClick={handleClose}
              variant="contained"
              sx={{
                marginRight: "10px",
                backgroundColor: "#e7eaef",
                color: "#001933",
              }}
            >
              Huỷ
            </StyledButtonCanel>
            {/* <Button variant="contained" onClick={handleSubmit}>
              Cập nhật
            </Button> */}
            <LoadingButton
              onClick={handleSubmit}
              endIcon={<Send />}
              loading={loading}
              loadingPosition="end"
              variant="contained"
            >
              Cập nhật
            </LoadingButton>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
