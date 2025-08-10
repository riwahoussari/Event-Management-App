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
import ProfilePage from "./components/pages/ProfilePage";
import CategoriesPage from "./components/pages/CategoriesPage";
import SelfProfile from "./components/Profiles/SelfProfile";
import UsersListPage from "./components/pages/UsersListPage";
import RequestsPage from "./components/pages/RequestsPage";
import EventPage from "./components/pages/EventPage";
import PlatformAnalyticsPage from "./components/pages/PlatformAnalyticsPage";
import { CreateEventPage } from "./components/pages/CreateNewEvent";

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
          <Route path="/event/:id" element={<EventPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/registrations" element={<RegistrationsPage />} />

          {/* organizer only */}
          <Route path="/my-events" element={<MyEventsPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />

          {/* admin only */}
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/all-users" element={<UsersListPage />} />
          <Route path="/requests" element={<RequestsPage />} />
          <Route path="/platfrom-analytics" element={<PlatformAnalyticsPage />} />

          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/profile" element={<SelfProfile />} />
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
