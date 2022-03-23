import React, { useState } from "react";

import logo from "../../../assets/img/icon-naruto.ico";
import icon_facebook from "../../../assets/img/facebook-logo-24.png";
import icon_google from "../../../assets/img/google-logo-24.png";
import { validateEmail } from "../login/ValidateEmail";
import Input from "../../../components/Input/Input";
import "../login/Login.scss";
import { Link as RouteLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authApi } from "api/authApi";
function Register() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!userName || !email || !password || !passwordConfirm) {
      setError("All fields are required");
      return;
    }
    if (password !== passwordConfirm) {
      setError("Password not match");
      return;
    }

    authApi
      .register({ userName, email, password }, dispatch, navigate)
      .catch((err) => {
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
              type="text"
              placeholder="Họ và tên"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={handleEmail}
            />
            <Input
              type="password"
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              type="password"
              value={passwordConfirm}
              placeholder="Nhập lại mật khẩu"
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />

            <div className="error">{error}</div>
            <button className="btn-signup" onClick={handleSignUp}>
              TẠO TÀI KHOẢN
            </button>
          </form>
          <div className="more-info">
            <h4>
              Đã có tài khoản ?
              <RouteLink
                to="/login"
                style={{
                  textDecoration: "none",
                }}
              >
                <span
                  onClick={() => {
                    setError("");
                  }}
                >
                  Đăng nhập
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

export default Register;
