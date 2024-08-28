import { Route, Routes } from "react-router-dom";
// import AdminAddAndEdit from "./pages/AdminAddAndEdit";
// import AdminProducts from "./pages/AdminProducts";
// import AdminSignIn from "./pages/AdminSignIn";
import Checkout from "./pages/Checkout";
import Confirmation from "./pages/Confirmation";
import Index from "./pages/Index";
import Product from "./pages/Product";
import RootLayout from "./pages/Rootlayout";
import Error from "./pages/Error";
import CategoryProducts from "./pages/CategoryProducts";

const Navigation = () => {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Index />}></Route>
        <Route path="product" element={<Product />}></Route>
        <Route path="checkout" element={<Checkout />}></Route>
        <Route path="confirmation" element={<Confirmation />}></Route>
        
        <Route path="/category/:categoryName" element={<CategoryProducts />}></Route> 
        {/* <Route path="admin/signin" element={<AdminSignIn />}></Route>
        <Route path="admin" element={<AdminProducts />}></Route>
        <Route
          path="admin/product/:param"
          element={<AdminAddAndEdit />}
        ></Route> */}
        <Route path="*" element={<Error />}></Route>
      </Route>
    </Routes>
  );
};

export default Navigation;
