import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import HomePage from "./components/pages/HomePage";
import NotFound from "./components/pages/NotFoundPage";
import FavoritesPage from "./components/pages/FavoritesPage";
import { ThemeToggle } from "./components/ui/ThemeToggle";
import RegistrationsPage from "./components/pages/RegistrationsPage";
import MyEventsPage from "./components/pages/MyEventsPage";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      {/* LAYOUT */}
      <Route
        element={
          <>
            <Navbar />
            <ThemeToggle />
          </>
        }
      >
        {/* protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route index element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/registrations" element={<RegistrationsPage />} />
          <Route path="/my-events" element={<MyEventsPage />} />
        </Route>

        {/* auth routes */}
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
