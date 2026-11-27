import React, { useState } from "react";
import type { AuthMode } from "../../types/auth.types";
import loginImg from "../../assets/images/authImg.webp";
import LoginForm from "../../components/auth/LoginForm";
import RegisterForm from "../../components/auth/RegisterForm";

const LoginRegister: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>("login");

  const goToRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    setMode("register");
  };

  const goToLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    setMode("login");
  };

  return (
    <div className="login-section">
      <div className={`wrapper ${mode === "register" ? "active" : ""}`}>
        <div className="form-container">
          <LoginForm onSwitchToRegister={goToRegister} />
          <RegisterForm onSwitchToLogin={goToLogin} />
        </div>

        <div className="login-image">
          <img src={loginImg} alt="Auth visual" />
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;