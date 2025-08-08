// components/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import Lottie from "lottie-react";
import LoadingRippleLottie from "../assets/loading-ripple.json";

export default function ProtectedRoute() {
  const { user, loading } = useUser();

  if (loading)
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 z-100 flex items-center justify-center">
        <Lottie animationData={LoadingRippleLottie} />
      </div>
    ); // or a spinner

  if (!loading && !user) return <Navigate to="/login" replace />;

  return <Outlet />;
}
