import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, FileCheck2 } from "lucide-react";
import { BrandLogo } from "../shared/BrandLogo";
import { useLang } from "../../lib/i18n";

export const Footer = () => {
    const { t } = useLang();
    return (
        <footer
            data-testid="site-footer"
            className="bg-[#0A192F] text-white mt-24 relative overflow-hidden"
        >
            <div className="h-1 bg-gradient-to-r from-[#FF9933] via-white to-[#138808]" />
            <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                    <div className="md:col-span-5 space-y-5">
                        <BrandLogo height={56} invert />
                        <p className="text-sm text-white/70 leading-relaxed max-w-md">
                            {t("footer.tagline")}
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border border-white/20 rounded">
                                <ShieldCheck size={13} /> {t("footer.badge_enc")}
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border border-white/20 rounded">
                                <Lock size={13} /> {t("footer.badge_gdpr")}
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border border-white/20 rounded">
                                <FileCheck2 size={13} /> {t("footer.badge_audit")}
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="overline text-white/50 mb-3">{t("footer.col_citizens")}</div>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/submit" className="hover:text-[#FF9933]">{t("footer.link_report")}</Link></li>
                            <li><Link to="/feed" className="hover:text-[#FF9933]">{t("footer.link_feed")}</Link></li>
                            <li><Link to="/map" className="hover:text-[#FF9933]">{t("footer.link_map")}</Link></li>
                            <li><Link to="/profile" className="hover:text-[#FF9933]">{t("footer.link_profile")}</Link></li>
                        </ul>
                    </div>
                    <div className="md:col-span-2">
                        <div className="overline text-white/50 mb-3">{t("footer.col_governance")}</div>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/dashboard" className="hover:text-[#FF9933]">{t("footer.link_analytics")}</Link></li>
                            <li><Link to="/official" className="hover:text-[#FF9933]">{t("footer.link_officer")}</Link></li>
                            <li><Link to="/admin" className="hover:text-[#FF9933]">{t("footer.link_admin")}</Link></li>
                            <li><a href="#" className="hover:text-[#FF9933]">{t("footer.link_exports")}</a></li>
                        </ul>
                    </div>
                    <div className="md:col-span-3">
                        <div className="overline text-white/50 mb-3">{t("footer.col_promise")}</div>
                        <p className="text-sm text-white/70 leading-relaxed">
                            {t("footer.promise_text")}
                        </p>
                    </div>
                </div>

                <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-white/50">
                    <div>{t("footer.copyright")}</div>
                    <div className="flex gap-5">
                        <a href="#" className="hover:text-white">{t("footer.privacy")}</a>
                        <a href="#" className="hover:text-white">{t("footer.terms")}</a>
                        <a href="#" className="hover:text-white">{t("footer.rti")}</a>
                        <a href="#" className="hover:text-white">{t("footer.press")}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
