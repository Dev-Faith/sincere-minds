import Nav from "./Nav.jsx";
const Layout = ({ children }) => {
  return (
    <div className="font-poppins px-4">
      <Nav />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
