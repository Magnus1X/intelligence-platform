import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CodePage = lazy(() => import("./pages/CodePage"));
const InterviewPage = lazy(() => import("./pages/InterviewPage"));
const PracticePage = lazy(() => import("./pages/PracticePage"));
const RoadmapPage = lazy(() => import("./pages/RoadmapPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));

const Protected = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  return token ? <>{children}</> : <Navigate to="/auth" replace />;
};

import { Toaster } from "react-hot-toast";

const RouteFallback = () => (
  <div className="min-h-[40vh] flex items-center justify-center text-sm text-gray-400">
    Loading...
  </div>
);

import { GoogleOAuthProvider } from "@react-oauth/google";

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="bottom-right" />
      <BrowserRouter>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected app shell */}
            <Route path="/dashboard" element={<Protected><Layout /></Protected>}>
              <Route index element={<Dashboard />} />
            </Route>
            <Route path="/code" element={<Protected><Layout /></Protected>}>
              <Route index element={<CodePage />} />
            </Route>
            <Route path="/interview" element={<Protected><Layout /></Protected>}>
              <Route index element={<InterviewPage />} />
            </Route>
            <Route path="/practice" element={<Protected><Layout /></Protected>}>
              <Route index element={<PracticePage />} />
            </Route>
            <Route path="/roadmap" element={<Protected><Layout /></Protected>}>
              <Route index element={<RoadmapPage />} />
            </Route>
            <Route path="/profile" element={<Protected><Layout /></Protected>}>
              <Route index element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}
