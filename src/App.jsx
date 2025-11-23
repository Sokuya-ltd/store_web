import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import SettingsLayout from "./pages/Settings/SettingsLayout";
import ProductsList from "./pages/Products/ProductsList";
import OrdersList from "./pages/Orders/OrdersList";
import OnboardingLayout from "./pages/Onboarding/OnboardingLayout";

function App() {
  const isOnboarded = true; // later: read from API/auth

  return (
    <BrowserRouter>
      <Routes>
        {/* Onboarding routes */}
        <Route path="/onboarding/*" element={<OnboardingLayout />} />

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
          <Route path="orders" element={<OrdersList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
