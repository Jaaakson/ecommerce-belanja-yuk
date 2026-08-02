import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { LoginPage } from './features/auth/LoginPage';
import { RegisterPage } from './features/auth/RegisterPage';
import { CartPage } from './features/cart/CartPage';
import { HomePage } from './features/products/HomePage';
import { PageTransition } from './routes/PageTransition';
import { ProtectedRoute } from './routes/ProtectedRoute';

export default function App() {
  const location = useLocation();

  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PageTransition>
  );
}
