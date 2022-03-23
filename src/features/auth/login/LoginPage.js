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
import authApi from "api/authApi";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
const StyledRouteLink = styled(RouteLink)`
  color: #1976d1;
  font-size: 14px;
`;
function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    authApi.login({ email, password }, dispatch, navigate).catch((err) => {
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
        Sign in
      </Typography>
      <Box component="form" noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
        />
        <TextField
          margin="normal"
          required
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          label="Password"
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
          Sign In
        </Button>
        <Grid container>
          <Grid item xs>
            {/* <Link href="#" variant="body2"> */}
            <StyledRouteLink to="/register">Forgot password?</StyledRouteLink>

            {/* </Link> */}
          </Grid>
          <Grid item>
            <StyledRouteLink to="/register">
              {/* <Link href="#" variant="body2"> */}
              {"Don't have an account? Sign Up"}
              {/* </Link> */}
            </StyledRouteLink>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default LoginPage;
