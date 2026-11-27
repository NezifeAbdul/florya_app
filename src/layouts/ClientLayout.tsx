import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import BasketDrawer from "../components/basket/BasketDrawer";
import ScrollToTop from "../utils/ScrollToTop";
import ScrollTopButton from "../components/commoncomp/ScrollTopButton";

const ClientLayout = () => (
  <>
    <ScrollToTop />
    <Header />
    <main className="page-main">
      <BasketDrawer />
      <Outlet />
    </main>
    <Footer />
    <ScrollTopButton />
  </>
);

export default ClientLayout;