import { SideBarDesktop } from "./sidebar-desktop";

const Layout = ({ children }: any) => {
  return (
    <div className="app-layout">
      <SideBarDesktop />
      <div className="main-content">{children}</div>
    </div>
  );
};

export default Layout;
