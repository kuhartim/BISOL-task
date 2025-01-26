import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";

const Layout = () => {
  return (
    <div
      className="container d-flex flex-column"
      style={{ minHeight: "100svh" }}
    >
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
