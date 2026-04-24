import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { LanguageProvider } from "./lib/i18n";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Landing from "./pages/Landing";
import Feed from "./pages/Feed";
import Submit from "./pages/Submit";
import MapView from "./pages/MapView";
import Dashboard from "./pages/Dashboard";
import IssueDetail from "./pages/IssueDetail";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel";
import OfficialPanel from "./pages/OfficialPanel";

function App() {
    return (
        <LanguageProvider>
            <div className="App min-h-screen bg-[#FAF9F6] text-[#0A192F]">
                <BrowserRouter>
                    <Header />
                    <main data-testid="app-main">
                        <Routes>
                            <Route path="/" element={<Landing />} />
                            <Route path="/feed" element={<Feed />} />
                            <Route path="/submit" element={<Submit />} />
                            <Route path="/map" element={<MapView />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/issue/:id" element={<IssueDetail />} />
                            <Route path="/profile" element={<Profile />} />
                            <Route path="/admin" element={<AdminPanel />} />
                            <Route path="/official" element={<OfficialPanel />} />
                        </Routes>
                    </main>
                    <Footer />
                    <Toaster position="top-right" richColors />
                </BrowserRouter>
            </div>
        </LanguageProvider>
    );
}

export default App;
