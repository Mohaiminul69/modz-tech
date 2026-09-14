import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = () => {
  const { pathname } = useLocation();
  // Checkout renders its own reduced footer so nothing competes with the form.
  const showFullFooter = pathname !== "/checkout";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {showFullFooter && <Footer />}
    </div>
  );
};

export default Layout;
