import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Languages, ChevronDown, LogOut, User as UserIcon, LayoutDashboard, Shield } from "lucide-react";
import { useLang } from "../../lib/i18n";
import { useAuth } from "../../lib/auth";
import { BrandLogo } from "../shared/BrandLogo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const LANGS = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिन्दी" },
    { code: "te", label: "తెలుగు" },
];

export const Header = () => {
    const { lang, setLang, t } = useLang();
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const navLinkCls = ({ isActive }) =>
        `px-1.5 py-1 text-sm font-medium transition-colors ${
            isActive
                ? "text-[#FF9933]"
                : "text-[#0A192F] hover:text-[#FF9933]"
        }`;

    return (
        <header
            data-testid="site-header"
            className="sticky top-0 z-40 glass border-b border-[#0A192F]/10"
        >
            {/* Top accent bar */}
            <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16">
                <Link
                    to="/"
                    className="flex items-center group"
                    data-testid="header-logo"
                >
                    <BrandLogo height={36} />
                </Link>

                <nav className="hidden lg:flex items-center gap-7">
                    <NavLink to="/feed" className={navLinkCls} data-testid="nav-feed">
                        {t("nav.feed")}
                    </NavLink>
                    <NavLink to="/map" className={navLinkCls} data-testid="nav-map">
                        {t("nav.map")}
                    </NavLink>
                    <NavLink to="/dashboard" className={navLinkCls} data-testid="nav-dashboard">
                        {t("nav.dashboard")}
                    </NavLink>
                    {user && (
                        <NavLink to="/me" className={navLinkCls} data-testid="nav-me">
                            My reports
                        </NavLink>
                    )}
                    {user?.role === "admin" && (
                        <NavLink to="/admin" className={navLinkCls} data-testid="nav-admin">
                            {t("nav.admin")}
                        </NavLink>
                    )}
                </nav>

                <div className="hidden lg:flex items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                data-testid="lang-switcher"
                                className="inline-flex items-center gap-1.5 text-sm font-medium text-[#0A192F] px-2.5 py-1.5 rounded-md hover:bg-[#0A192F]/5"
                            >
                                <Languages size={14} strokeWidth={1.75} />
                                {LANGS.find((l) => l.code === lang)?.label}
                                <ChevronDown size={12} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {LANGS.map((l) => (
                                <DropdownMenuItem
                                    key={l.code}
                                    onClick={() => setLang(l.code)}
                                    data-testid={`lang-option-${l.code}`}
                                >
                                    {l.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {user ? (
                        <>
                            <button
                                data-testid="header-report-btn"
                                onClick={() => navigate("/submit")}
                                className="inline-flex items-center gap-1.5 bg-[#0A192F] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#FF9933] transition-colors"
                            >
                                {t("nav.submit")}
                            </button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button data-testid="user-menu-trigger" className="inline-flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-[#0A192F]/5">
                                        {user.picture ? (
                                            <img src={user.picture} alt="" className="w-7 h-7 rounded-full object-cover border border-[#0A192F]/15" />
                                        ) : (
                                            <span className="w-7 h-7 rounded-full bg-[#FF9933] text-white text-xs font-bold flex items-center justify-center">
                                                {user.name?.[0]?.toUpperCase() || "U"}
                                            </span>
                                        )}
                                        <ChevronDown size={12} className="text-slate-400" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <div className="px-3 py-2.5 border-b border-[#0A192F]/5">
                                        <div className="text-sm font-semibold text-[#0A192F] truncate">{user.name}</div>
                                        <div className="text-xs text-slate-500 truncate">{user.email}</div>
                                    </div>
                                    <DropdownMenuItem onClick={() => navigate("/me")} data-testid="menu-my-dashboard">
                                        <LayoutDashboard size={14} className="mr-2" /> My dashboard
                                    </DropdownMenuItem>
                                    {user.role === "admin" && (
                                        <DropdownMenuItem onClick={() => navigate("/admin")} data-testid="menu-admin">
                                            <Shield size={14} className="mr-2" /> Admin
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={async () => { await logout(); navigate("/"); }} data-testid="menu-logout" className="text-red-600 focus:text-red-700">
                                        <LogOut size={14} className="mr-2" /> Log out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Link to="/login" data-testid="header-login-btn" className="text-sm font-semibold text-[#0A192F] hover:text-[#FF9933] px-3 py-2">
                                Log in
                            </Link>
                            <Link to="/register" data-testid="header-signup-btn" className="inline-flex items-center gap-1.5 bg-[#0A192F] text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-[#FF9933] transition-colors">
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                <button
                    className="lg:hidden p-2 text-[#0A192F]"
                    onClick={() => setOpen(!open)}
                    data-testid="mobile-menu-toggle"
                >
                    {open ? <X size={22} /> : <Menu size={22} />}
                </button>
            </div>

            {open && (
                <div className="lg:hidden border-t border-[#0A192F]/10 bg-white">
                    <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-3">
                        {["feed", "map", "dashboard"].map((k) => (
                            <NavLink
                                key={k}
                                to={`/${k}`}
                                className={navLinkCls}
                                onClick={() => setOpen(false)}
                                data-testid={`mobile-nav-${k}`}
                            >
                                {t(`nav.${k}`)}
                            </NavLink>
                        ))}
                        {user && (
                            <NavLink to="/me" className={navLinkCls} onClick={() => setOpen(false)} data-testid="mobile-nav-me">
                                My reports
                            </NavLink>
                        )}
                        {user?.role === "admin" && (
                            <NavLink to="/admin" className={navLinkCls} onClick={() => setOpen(false)} data-testid="mobile-nav-admin">
                                {t("nav.admin")}
                            </NavLink>
                        )}
                        <div className="flex gap-2 pt-2 border-t border-[#0A192F]/10">
                            {LANGS.map((l) => (
                                <button
                                    key={l.code}
                                    onClick={() => setLang(l.code)}
                                    data-testid={`mobile-lang-${l.code}`}
                                    className={`text-xs px-2 py-1 rounded border ${
                                        lang === l.code
                                            ? "bg-[#0A192F] text-white border-[#0A192F]"
                                            : "text-[#0A192F] border-[#0A192F]/20"
                                    }`}
                                >
                                    {l.label}
                                </button>
                            ))}
                        </div>
                        {user ? (
                            <>
                                <button
                                    onClick={() => { setOpen(false); navigate("/submit"); }}
                                    data-testid="mobile-report-btn"
                                    className="mt-2 bg-[#0A192F] text-white font-semibold px-4 py-2.5 rounded-md"
                                >
                                    {t("nav.submit")}
                                </button>
                                <button
                                    onClick={async () => { setOpen(false); await logout(); navigate("/"); }}
                                    data-testid="mobile-logout-btn"
                                    className="text-sm text-red-600 font-semibold px-2 py-1.5 text-left"
                                >
                                    Log out
                                </button>
                            </>
                        ) : (
                            <div className="flex gap-2 mt-2">
                                <button onClick={() => { setOpen(false); navigate("/login"); }} data-testid="mobile-login-btn" className="flex-1 border border-[#0A192F]/15 font-semibold px-4 py-2.5 rounded-md">
                                    Log in
                                </button>
                                <button onClick={() => { setOpen(false); navigate("/register"); }} data-testid="mobile-signup-btn" className="flex-1 bg-[#0A192F] text-white font-semibold px-4 py-2.5 rounded-md">
                                    Sign up
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
