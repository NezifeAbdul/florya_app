import { Suspense, lazy, useEffect } from "react";
import type { ReactNode } from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { ToastContainer } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import "react-toastify/dist/ReactToastify.css";

import ClientLayout from "./layouts/ClientLayout";
import AdminRoute from "./layouts/AdminRoute";
import Home from "./pages/client/Home";
import Product from "./pages/client/products/Product";
import ProductDetail from "./pages/client/products/ProductDetail";
import { Preloader } from "./components/commoncomp/Loader";

const Contact = lazy(() => import("./pages/client/Contact"));
const About = lazy(() => import("./pages/client/About"));
const Faq = lazy(() => import("./pages/client/faq/Faq"));
const Blog = lazy(() => import("./pages/client/Blog"));
const Checkout = lazy(() => import("./pages/client/Checkout"));
const Collections = lazy(() => import("./pages/client/Collections"));
const Wishlist = lazy(() => import("./pages/client/wishlist/Wishlist"));
const OrderSuccess = lazy(() => import("./pages/client/OrderSuccess"));
const LoginRegister = lazy(() => import("./pages/auth/LoginRegister"));

const AdminLayout = lazy(() => import("./layouts/AdminLayout"));
const DashboardPage = lazy(() => import("./pages/admin/DashboardPage"));
const ProductsPage = lazy(() => import("./pages/admin/ProductsPage"));
const CategoriesPage = lazy(() => import("./pages/admin/CategoriesPage"));
const CollectionsPage = lazy(() => import("./pages/admin/CollectionsPage"));
const BlogsPage = lazy(() => import("./pages/admin/BlogsPage"));
const BlogCategoriesPage = lazy(() => import("./pages/admin/BlogCategoriesPage"));
const FaqsPage = lazy(() => import("./pages/admin/FaqsPage"));
const FaqCategoriesPage = lazy(() => import("./pages/admin/FaqCategoriesPage"));
const ReviewsPage = lazy(() => import("./pages/admin/ReviewsPage"));
const UsersPage = lazy(() => import("./pages/admin/UsersPage"));
const OrdersPage = lazy(() => import("./pages/admin/OrdersPage"));

const PageFallback = () => <div style={{ minHeight: "60vh" }} aria-busy="true" />;

const Lazy = ({ children }: { children: ReactNode }) => (
  <Suspense fallback={<PageFallback />}>{children}</Suspense>
);

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="top-center" autoClose={2500} closeOnClick pauseOnHover />
      <Preloader />

      <Routes>
        <Route element={<ClientLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/products/:slug" element={<ProductDetail />} />

          <Route path="/contact" element={<Lazy><Contact /></Lazy>} />
          <Route path="/about" element={<Lazy><About /></Lazy>} />
          <Route path="/faq" element={<Lazy><Faq /></Lazy>} />
          <Route path="/blog" element={<Lazy><Blog /></Lazy>} />
          <Route path="/collections" element={<Lazy><Collections /></Lazy>} />
          <Route path="/checkout" element={<Lazy><Checkout /></Lazy>} />
          <Route path="/wishlist" element={<Lazy><Wishlist /></Lazy>} />
          <Route path="/login" element={<Lazy><LoginRegister /></Lazy>} />
          <Route path="/order-success" element={<Lazy><OrderSuccess /></Lazy>} />
        </Route>

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <Lazy>
                <AdminLayout />
              </Lazy>
            </AdminRoute>
          }
        >
          <Route index element={<Lazy><DashboardPage /></Lazy>} />
          <Route path="products" element={<Lazy><ProductsPage /></Lazy>} />
          <Route path="categories" element={<Lazy><CategoriesPage /></Lazy>} />
          <Route path="collections" element={<Lazy><CollectionsPage /></Lazy>} />
          <Route path="blogs" element={<Lazy><BlogsPage /></Lazy>} />
          <Route path="blog-categories" element={<Lazy><BlogCategoriesPage /></Lazy>} />
          <Route path="faqs" element={<Lazy><FaqsPage /></Lazy>} />
          <Route path="faq-categories" element={<Lazy><FaqCategoriesPage /></Lazy>} />
          <Route path="reviews" element={<Lazy><ReviewsPage /></Lazy>} />
          <Route path="users" element={<Lazy><UsersPage /></Lazy>} />
          <Route path="orders" element={<Lazy><OrdersPage /></Lazy>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;