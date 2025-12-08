import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import SettingsLayout from "./pages/Settings/SettingsLayout";
import ProductsList from "./pages/Products/ProductsList";
import ProductAdd from "./pages/Products/ProductAdd";
import ProductEdit from "./pages/Products/ProductEdit";
import OrdersList from "./pages/Orders/OrdersList";
import OnboardingLayout from "./pages/Onboarding/OnboardingLayout";
import RegistrationSuccess from "./pages/Onboarding/RegistrationSuccess";
import Login from "./pages/Onboarding/Login";

function App() {
  const isOnboarded = true; // later: read from API/auth

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        
        {/* Onboarding routes */}
        <Route path="/onboarding/*" element={<OnboardingLayout />} />
        <Route path="/onboarding/success" element={<RegistrationSuccess />} />

        {/* Protected app routes */}
        <Route
          path="/"
          element={
            isOnboarded ? <AppLayout /> : <Navigate to="/onboarding" replace />
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<SettingsLayout />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />
          <Route path="orders" element={<OrdersList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
