import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import i18n from "../i18n";
import { isLoggedIn } from "./auth";

export const useRequireAuth = () => {
  const navigate = useNavigate();

  // message: tərcümə açarı (məs. "auth.cartRequired") və ya adi mətn
  return (message = "auth.cartRequired") => {
    if (isLoggedIn()) return true;
    const text = i18n.t(message, { defaultValue: message });
    toast.info(`${text} (${i18n.t("auth.clickToLogin")})`, {
      toastId: "auth-required",
      onClick: () => navigate("/login"),
    });
    return false;
  };
};

