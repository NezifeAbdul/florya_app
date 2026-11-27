import { useState } from "react";
import type { MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FiUser, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { loginSchema } from "../../validation/auth.schema";
import type { LoginFormValues } from "../../validation/auth.schema";
import { loginRequest, persistSession, getRedirectPathByRole } from "../../services/api/authService";
import { authErrorMessage } from "../../auth/authError";

interface Props {
  onSwitchToRegister: (e: MouseEvent) => void;
}

const LoginForm = ({ onSwitchToRegister }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema), mode: "onTouched" });

  const err = (key?: string) =>
    key ? <span className="input-error">{t(`auth.errors.${key}`)}</span> : null;

  const onSubmit = async (values: LoginFormValues) => {
    setFormError("");
    try {
      const auth = await loginRequest(values);
      persistSession(auth, !!values.remember);
      toast.success(t("auth.loginSuccess"));
      navigate(getRedirectPathByRole(auth.user.role));
    } catch (e) {
      const msg = authErrorMessage(e, t, "login");
      setFormError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="form-box login">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>{t("auth.loginTitle")}</h1>

        {formError && (
          <div className="form-alert" role="alert">
            <FiAlertCircle /> {formError}
          </div>
        )}

        <div className="input-box">
          <input
            {...register("identifier")}
            placeholder={t("auth.identifier")}
            autoComplete="username"
            aria-invalid={!!errors.identifier}
          />
          <FiUser />
          {err(errors.identifier?.message)}
        </div>

        <div className="input-box">
          <input
            {...register("password")}
            type={show ? "text" : "password"}
            placeholder={t("auth.password")}
            autoComplete="current-password"
            aria-invalid={!!errors.password}
          />
          <span onClick={() => setShow((v) => !v)}>{show ? <FiEyeOff /> : <FiEye />}</span>
          {err(errors.password?.message)}
        </div>

        <div className="remember-forgot">
          <label>
            <input type="checkbox" {...register("remember")} /> {t("auth.remember")}
          </label>
          <Link to="/forgot-password">{t("auth.forgot")}</Link>
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("common.loading") : t("auth.loginBtn")}
        </button>

        <p className="register-link">
          {t("auth.noAccount")}{" "}
          <a href="#" onClick={onSwitchToRegister}>{t("auth.registerLink")}</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;