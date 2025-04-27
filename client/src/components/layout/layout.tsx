import LayoutNav from "./layout-nav";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <>
      <LayoutNav />
      <Outlet />
    </>
  );
};

export default Layout;
