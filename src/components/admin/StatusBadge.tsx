type Tone = "success" | "warning" | "danger" | "neutral";

const StatusBadge = ({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) => (
  <span className={`adm-badge adm-badge--${tone}`}>{children}</span>
);

export default StatusBadge;