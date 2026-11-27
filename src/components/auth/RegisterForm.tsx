import { useState } from "react";
import type { MouseEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import { registerSchema } from "../../validation/auth.schema";
import type { RegisterFormValues } from "../../validation/auth.schema";
import { registerRequest, persistSession } from "../../services/api/authService";
import { authErrorMessage } from "../../auth/authError";
import PasswordRules from "./PasswordRules";

interface Props {
  onSwitchToLogin: (e: MouseEvent) => void;
}

const RegisterForm = ({ onSwitchToLogin }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema), mode: "onTouched" });

  const pw = watch("password") ?? "";
  const err = (key?: string) =>
    key ? <span className="input-error">{t(`auth.errors.${key}`)}</span> : null;

  const onSubmit = async (v: RegisterFormValues) => {
    setFormError("");
    try {
      const auth = await registerRequest(v);
      persistSession(auth, false);
      toast.success(t("auth.registerSuccess"));
      navigate("/");
    } catch (e) {
      const msg = authErrorMessage(e, t, "register");
      setFormError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="form-box register">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1>{t("auth.registerTitle")}</h1>

        {formError && (
          <div className="form-alert" role="alert">
            <FiAlertCircle /> {formError}
          </div>
        )}

        <div className="input-row">
          <div className="input-box">
            <input {...register("firstName")} placeholder={t("auth.firstName")} autoComplete="given-name" aria-invalid={!!errors.firstName} />
            {err(errors.firstName?.message)}
          </div>
          <div className="input-box">
            <input {...register("lastName")} placeholder={t("auth.lastName")} autoComplete="family-name" aria-invalid={!!errors.lastName} />
            {err(errors.lastName?.message)}
          </div>
        </div>

        <div className="input-box">
          <input {...register("email")} type="email" placeholder={t("auth.email")} autoComplete="email" aria-invalid={!!errors.email} />
          {err(errors.email?.message)}
        </div>

        <div className="input-box">
          <input
            {...register("password")}
            type={show ? "text" : "password"}
            placeholder={t("auth.password")}
            autoComplete="new-password"
            aria-invalid={!!errors.password}
          />
          <span onClick={() => setShow((v) => !v)}>{show ? <FiEyeOff /> : <FiEye />}</span>
          {pw ? (
            <PasswordRules value={pw} touched={!!touchedFields.password} />
          ) : (
            err(errors.password?.message)
          )}
        </div>

        <div className="input-box">
          <input
            {...register("confirmPassword")}
            type={show ? "text" : "password"}
            placeholder={t("auth.confirmPassword")}
            autoComplete="new-password"
            aria-invalid={!!errors.confirmPassword}
          />
          {err(errors.confirmPassword?.message)}
        </div>

        <label className="terms">
          <input type="checkbox" {...register("acceptedTerms")} /> {t("auth.acceptTerms")}
        </label>
        {err(errors.acceptedTerms?.message)}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("common.loading") : t("auth.registerBtn")}
        </button>

        <p className="register-link">
          {t("auth.haveAccount")}{" "}
          <a href="#" onClick={onSwitchToLogin}>{t("auth.loginLink")}</a>
        </p>
      </form>
    </div>
  );
};

export default RegisterForm;