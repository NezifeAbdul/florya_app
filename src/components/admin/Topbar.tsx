import { Link } from "react-router";
import { FiExternalLink, FiLogOut, FiMenu } from "react-icons/fi";
import { getAdminSession, logoutAdmin } from "../../utils/adminAuth";
import { getInitials } from "./Sidebar";

interface TopbarProps {
  onMenuClick: () => void;
}

const Topbar = ({ onMenuClick }: TopbarProps) => {
  const session = getAdminSession();
  const name = session?.name ?? "Admin";

  return (
    <header className="adm-topbar">
      <button type="button" className="adm-topbar__menu" onClick={onMenuClick} aria-label="Menu">
        <FiMenu />
      </button>

      <div className="adm-topbar__right">
        <div className="adm-user-chip adm-user-chip--top">
          <span className="adm-avatar">{getInitials(name)}</span>
          <div className="adm-user-chip__info">
            <strong>{name}</strong>
          </div>
        </div>

        <Link to="/" className="adm-btn adm-btn--ghost">
          <FiExternalLink /> View site
        </Link>
        <button type="button" className="adm-btn adm-btn--ghost" onClick={logoutAdmin}>
          <FiLogOut /> Log out
        </button>
      </div>
    </header>
  );
};

export default Topbar;