import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";

import ClientLayout from "./layouts/ClientLayout";
import Home from "./pages/client/Home";
import Contact from "./pages/client/Contact";
import About from "./pages/client/About";
import Faq from "./pages/client/faq/Faq";
import Blog from "./pages/client/Blog";
import Checkout from "./pages/client/Checkout";


import Collections from "./pages/client/Collections";
import Wishlist from "./pages/client/wishlist/Wishlist";
import Product from "./pages/client/products/Product";
import ProductDetail from "./pages/client/products/ProductDetail";
import LoginRegister from "./pages/auth/LoginRegister";

import AdminLayout from "./layouts/AdminLayout";

import DashboardPage from "./pages/admin/DashboardPage";
import ProductsPage from "./pages/admin/ProductsPage";
import CategoriesPage from "./pages/admin/CategoriesPage";
import CollectionsPage from "./pages/admin/CollectionsPage";
import BlogsPage from "./pages/admin/BlogsPage";
import BlogCategoriesPage from "./pages/admin/BlogCategoriesPage";
import FaqsPage from "./pages/admin/FaqsPage";
import FaqCategoriesPage from "./pages/admin/FaqCategoriesPage";
import ReviewsPage from "./pages/admin/ReviewsPage";
import UsersPage from "./pages/admin/UsersPage";
import OrdersPage from "./pages/admin/OrdersPage";
import OrderSuccess from "./pages/client/OrderSuccess";
import AdminRoute from "./layouts/AdminRoute";
import { Preloader } from "./components/commoncomp/Loader";


function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <BrowserRouter>
      {/* <ToastContainer position="top-right" autoClose={2500} /> */}
      <ToastContainer position="top-center" autoClose={2500} closeOnClick pauseOnHover />
      <Preloader />

      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/product" element={<Product />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="/order-success" element={<OrderSuccess />} />
          

        </Route>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="collections" element={<CollectionsPage />} />
          <Route path="blogs" element={<BlogsPage />} />
          <Route path="blog-categories" element={<BlogCategoriesPage />} />
          <Route path="faqs" element={<FaqsPage />} />
          <Route path="faq-categories" element={<FaqCategoriesPage />} />
          <Route path="reviews" element={<ReviewsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;