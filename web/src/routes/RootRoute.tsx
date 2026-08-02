import { LandingPage } from '../features/landing/LandingPage';
import { HomePage } from '../features/products/HomePage';
import { useAuth } from '../lib/auth';

/** Public visitors get the landing page; signed-in users go straight to the shop. */
export function RootRoute() {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? <HomePage /> : <LandingPage />;
}
