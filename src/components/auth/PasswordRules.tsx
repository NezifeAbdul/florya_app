import { useTranslation } from "react-i18next";
import { PASSWORD_RULES } from "../../validation/auth.chema";

const PasswordRules = ({ value, touched }: { value: string; touched: boolean }) => {
  const { t } = useTranslation();
  const missing = PASSWORD_RULES.filter((r) => !r.test(value));

  if (!touched || !value || missing.length === 0) return null;

  return (
    <div className="input-error-row">
      {missing.map((r) => (
        <span key={r.key} className="input-error">
          {t(`auth.rules.${r.key}`)}
        </span>
      ))}
    </div>
  );
};

export default PasswordRules;