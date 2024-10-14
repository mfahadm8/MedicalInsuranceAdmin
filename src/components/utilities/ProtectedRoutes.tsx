import { PropsWithChildren, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren;

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isSignedIn = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("auth") || "").isSignedIn
    : false;
  const navigate = useNavigate();
  useEffect(() => {
    if (!isSignedIn) {
      navigate("/sign-in", { replace: true });
    }
  }, [navigate, isSignedIn]);
  return children;
}
