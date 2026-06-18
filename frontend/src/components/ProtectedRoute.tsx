import { Navigate } from "react-router";
import { useAuthStore } from "../stores/authStore";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}