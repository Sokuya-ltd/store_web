import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import SettingsLayout from "./pages/Settings/SettingsLayout";
import ProductsInventoryDashboard from "./pages/Products/ProductsInventoryDashboard";
import ProductAdd from "./pages/Products/ProductAdd";
import ProductView from "./pages/Products/ProductView";
import ProductEdit from "./pages/Products/ProductEdit";
import OrdersList from "./pages/Orders/OrdersList";
import OnboardingLayout from "./pages/Onboarding/OnboardingLayout";
import RegistrationSuccess from "./pages/Onboarding/RegistrationSuccess";
import Login from "./pages/Onboarding/Login";
import ForgotPassword from "./pages/Onboarding/ForgotPassword";
import ResetPassword from "./pages/Onboarding/ResetPassword";

function AppRoutes() {
  return (
    <Routes>
      {/* Guest routes - redirect to dashboard if already logged in */}
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/password-reset" element={<ResetPassword />} />
        <Route path="/onboarding/*" element={<OnboardingLayout />} />
        <Route path="/onboarding/success" element={<RegistrationSuccess />} />
      </Route>

      {/* Protected routes - require authentication */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="settings" element={<SettingsLayout />} />
          <Route path="products" element={<ProductsInventoryDashboard />} />
          <Route path="products/add" element={<ProductAdd />} />
          <Route path="products/view/:id" element={<ProductView />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
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
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
