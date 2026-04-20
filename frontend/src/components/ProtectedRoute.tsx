
import { Navigate } from "react-router";
import { useAuthStore } from "../stores/authStore";

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to="/login" replace />;
  return children;
}