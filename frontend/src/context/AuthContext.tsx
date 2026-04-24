import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import api from "../services/api";

interface User { id: string; name: string; email: string; role: string; college?: string; yearOfStudy?: string; address?: string; }
interface AuthCtx {
  user: User | null;
  token: string | null;
  isNewUser: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, college?: string, yearOfStudy?: string, address?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthCtx | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser]           = useState<User | null>(null);
  const [token, setToken]         = useState<string | null>(localStorage.getItem("token"));
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    if (token) {
      api.get("/auth/me").then((r) => setUser(r.data.data)).catch(() => logout());
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);
    setIsNewUser(false);
  };

  const register = async (name: string, email: string, password: string, college?: string, yearOfStudy?: string, address?: string) => {
    const { data } = await api.post("/auth/register", { name, email, password, college, yearOfStudy, address });
    localStorage.setItem("token", data.data.token);
    setToken(data.data.token);
    setUser(data.data.user);
    setIsNewUser(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setIsNewUser(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, isNewUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
