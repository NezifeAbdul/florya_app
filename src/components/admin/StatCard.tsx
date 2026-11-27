import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
}

const StatCard = ({ label, value, icon }: StatCardProps) => (
  <div className="adm-card adm-stat">
    <div className="adm-stat__icon">{icon}</div>
    <div>
      <span className="adm-stat__label">{label}</span>
      <strong className="adm-stat__value">{value}</strong>
    </div>
  </div>
);

export default StatCard;