import { Route, Routes } from "react-router-dom";
// import AdminAddAndEdit from "./pages/AdminAddAndEdit";
// import AdminProducts from "./pages/AdminProducts";
// import AdminSignIn from "./pages/AdminSignIn";
import AdminAddAndEdit from "./pages/AdminAddAndEdit";
import AdminProducts from "./pages/AdminProducts";
import AdminSignIn from "./pages/AdminSignIn";
import Cart from "./pages/Cart";
import CategoryProducts from "./pages/CategoryProducts";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Error from "./pages/Error";
import Index from "./pages/Index";
import {
  default as Product,
  default as ProductDetails,
} from "./pages/ProductDetail";
import RootLayout from "./pages/Rootlayout";
import ProtectedRoute from "./protectedRoute";

const Navigation = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Index />}></Route>
        <Route path="product" element={<Product />}></Route>
        <Route path="checkout" element={<Checkout />}></Route>
        <Route path="confirmation" element={<Confirmation />}></Route>

        <Route path="/category/:id" element={<CategoryProducts />}></Route>
        <Route path="cart" element={<Cart />}></Route>

        {/* ÄNDRA SEN SÅ INTE VI SKICKAR ID, UTAN SÄTTER ACTIVEPRODUCT? : */}
        <Route path="/product/:productId" element={<ProductDetails />} />
        {/* ADMINS NAVIGATION ENDAST */}
        <Route
          path="admin"
          element={<ProtectedRoute element={AdminProducts} />}
        />
        <Route
          path="admin/product/:param"
          element={<ProtectedRoute element={AdminAddAndEdit} />}
        />

        <Route path="admin/signin" element={<AdminSignIn />}></Route>

        <Route path="*" element={<Error />}></Route>
      </Route>
    </Routes>
  );
};

export default Navigation;
