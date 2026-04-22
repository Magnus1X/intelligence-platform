import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setToken } = useAuth(); // We need to make sure setToken is available in useAuth

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error(error);
      navigate("/auth", { replace: true });
      return;
    }

    if (token) {
      // Decode user manually or fetch /me later. For now, AuthContext will handle token setting
      localStorage.setItem("token", token);
      
      // Let's force a reload to let AuthContext pick it up cleanly
      window.location.href = "/dashboard";
    } else {
      navigate("/auth", { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4 text-gray-500">
        <Loader2 size={32} className="animate-spin text-black" />
        <p className="font-medium">Completing sign in...</p>
      </div>
    </div>
  );
}
