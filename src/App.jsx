import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
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

function AppRoutes() {
  return (
    <Routes>
      {/* Guest routes - redirect to dashboard if already logged in */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding/*" element={<OnboardingLayout />} />
        <Route path="/onboarding/success" element={<RegistrationSuccess />} />
      </Route>

      {/* Protected routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<SettingsLayout />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/:id/edit" element={<ProductEdit />} />
          <Route path="orders" element={<OrdersList />} />
        </Route>
      </Route>

      {/* Catch all - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
