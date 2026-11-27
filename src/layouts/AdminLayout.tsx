import { useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "../components/admin/Sidebar";
import Topbar from "../components/admin/Topbar";

const AdminLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="adm">
      <Sidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      {menuOpen && <div className="adm-backdrop" onClick={() => setMenuOpen(false)} />}
      <div className="adm-main">
        <Topbar onMenuClick={() => setMenuOpen((v) => !v)} />
        <main className="adm-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
