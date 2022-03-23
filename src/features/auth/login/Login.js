import { authApi } from "api/authApi";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import icon_facebook from "../../../assets/img/facebook-logo-24.png";
import icon_google from "../../../assets/img/google-logo-24.png";
import logo from "../../../assets/img/icon-naruto.ico";
import Input from "../../../components/Input/Input";
import "./Login.scss";
import { validateEmail } from "./ValidateEmail";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    authApi.login({ email, password }, dispatch, navigate).catch((err) => {
      // console.log(err);
      setError(err.message);
    });
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(email)) {
      setError("Email is not valid");
      return;
    } else {
      setError("");
    }
  };
  return (
    <div className="container">
      <div className="wrapper">
        <div className="sidebar-login">
          <div className="logo-login">
            <img className="logo" src={logo} alt="logo" />
            <h3>Zalo-Chat</h3>
          </div>
          <form className="form-login">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmail}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="error">{error}</div>

            <button className="btn-signup" onClick={handleSignIn}>
              ĐĂNG NHẬP
            </button>
          </form>
          <div className="more-info">
            <h4>
              Chưa có tài khoản ?
              <RouteLink
                to="/register"
                style={{
                  textDecoration: "none",
                }}
              >
                <span
                  onClick={() => {
                    setError("");
                  }}
                >
                  Tạo tài khoản
                </span>
              </RouteLink>
            </h4>
          </div>
          <div className="login-social">
            <div className="login-facebook">
              <img src={icon_facebook} alt="Facebook" />
              <span>Facebook</span>
            </div>
            <div className="login-google">
              <img src={icon_google} alt="Google" />
              <span>Google</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
