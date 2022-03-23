import { Lock } from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { authApi } from "api/authApi";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledRouteLink = styled(RouteLink)`
  color: #1976d1;
  font-size: 14px;
`;

function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    authApi
      .register({ userName, email, password }, dispatch, navigate)
      .catch((err) => {
        // console.log(err);
        setError(err.message);
      });
  };
  return (
    <Box
      sx={{
        marginTop: 8,
        padding: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
        <Lock />
      </Avatar>
      <Typography component="h1" variant="h5">
        Sign up
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          label="Họ và tên"
          name="name"
          autoComplete="name"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
        />
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
          fullWidth
          name="password"
          label="Mật khẩu"
          type="password"
          id="password"
          autoComplete="current-password"
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={handleLogin}
        >
          Sign Up
        </Button>
        <Grid container>
          <Grid item xs>
            {/* <Link href="#" variant="body2"> */}
            <StyledRouteLink to="/register">Forgot password?</StyledRouteLink>

            {/* </Link> */}
          </Grid>
          <Grid item>
            <StyledRouteLink to="/login">
              Already have an account? Sign In
            </StyledRouteLink>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default RegisterPage;
