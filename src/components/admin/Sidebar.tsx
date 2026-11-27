import { Link, NavLink } from "react-router";
import { FiExternalLink, FiLogOut } from "react-icons/fi";
import { getAdminSession, logoutAdmin } from "../../utils/adminAuth";
import { navGroups } from "../../data/adminNavigation";
import logo from "../../assets/images/header/florya_logo.png";

export const getInitials = (name?: string) => {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "A";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

interface SidebarProps {
  open: boolean;
  onNavigate: () => void;
}

const Sidebar = ({ open, onNavigate }: SidebarProps) => {
  const session = getAdminSession();
  const name = session?.name ?? "Admin";

  return (
    <aside className={`adm-sidebar ${open ? "open" : ""}`}>
      <div className="adm-sidebar__brand">
        <img src={logo} alt="Florya" />
      </div>

      <nav className="adm-sidebar__nav">
        {navGroups.map((group) => (
          <div className="adm-nav-group" key={group.title}>
            <span className="adm-nav-group__title">{group.title}</span>
            {group.items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) => `adm-nav-link ${isActive ? "active" : ""}`}
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      <div className="adm-sidebar__footer">
        <div className="adm-user-chip">
          <span className="adm-avatar">{getInitials(name)}</span>
          <div className="adm-user-chip__info">
            <strong>{name}</strong>
            {session?.email && <small>{session.email}</small>}
          </div>
        </div>

        <Link to="/" className="adm-nav-link" onClick={onNavigate}>
          <FiExternalLink />
          <span>View site</span>
        </Link>
        <button type="button" className="adm-nav-link" onClick={logoutAdmin}>
          <FiLogOut />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;