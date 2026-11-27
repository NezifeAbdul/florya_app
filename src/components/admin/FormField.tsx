import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

const FormField = ({ label, error, hint, className = "", children }: FormFieldProps) => (
  <div className={`adm-field ${error ? "has-error" : ""} ${className}`}>
    <label>{label}</label>
    {children}
    {error ? (
      <span className="adm-field__error">{error}</span>
    ) : (
      hint && <span className="adm-field__hint">{hint}</span>
    )}
  </div>
);

export default FormField;