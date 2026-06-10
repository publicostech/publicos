import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { LanguageProvider } from "./lib/i18n";
import { AuthProvider } from "./lib/auth";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/shared/ProtectedRoute";
import Landing from "./pages/Landing";
import Feed from "./pages/Feed";
import Submit from "./pages/Submit";
import MapView from "./pages/MapView";
import Dashboard from "./pages/Dashboard";
import IssueDetail from "./pages/IssueDetail";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import OfficialPanel from "./pages/OfficialPanel";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import MyDashboard from "./pages/MyDashboard";

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/feed" element={<Feed />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/issue/:id" element={<IssueDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/official" element={
                <ProtectedRoute officialOrAdmin><OfficialPanel /></ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            <Route path="/submit" element={
                <ProtectedRoute><Submit /></ProtectedRoute>
            } />
            <Route path="/me" element={
                <ProtectedRoute><MyDashboard /></ProtectedRoute>
            } />
            <Route path="/admin" element={
                <ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>
            } />
        </Routes>
    );
}

function App() {
    return (
        <LanguageProvider>
            <AuthProvider>
                <div className="App min-h-screen bg-[#FAF9F6] text-[#0A192F]">
                    <BrowserRouter>
                        <Header />
                        <main data-testid="app-main">
                            <AppRoutes />
                        </main>
                        <Footer />
                        <Toaster position="top-right" richColors />
                    </BrowserRouter>
                </div>
            </AuthProvider>
        </LanguageProvider>
    );
}

export default App;
