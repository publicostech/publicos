import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Lock, FileCheck2 } from "lucide-react";
import { BrandLogo } from "../shared/BrandLogo";

export const Footer = () => {
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
                            A public ledger of civic issues — every report, every response,
                            timestamped and auditable. Built by citizens, for citizens, with
                            governance in the loop.
                        </p>
                        <div className="flex flex-wrap gap-3 pt-2">
                            <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border border-white/20 rounded">
                                <ShieldCheck size={13} /> Data encrypted at rest
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border border-white/20 rounded">
                                <Lock size={13} /> GDPR + DPDP ready
                            </div>
                            <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 border border-white/20 rounded">
                                <FileCheck2 size={13} /> Public audit log
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="overline text-white/50 mb-3">Citizens</div>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/submit" className="hover:text-[#FF9933]">Report Issue</Link></li>
                            <li><Link to="/feed" className="hover:text-[#FF9933]">Public Feed</Link></li>
                            <li><Link to="/map" className="hover:text-[#FF9933]">Map View</Link></li>
                            <li><Link to="/profile" className="hover:text-[#FF9933]">My Profile</Link></li>
                        </ul>
                    </div>
                    <div className="md:col-span-2">
                        <div className="overline text-white/50 mb-3">Governance</div>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/dashboard" className="hover:text-[#FF9933]">Analytics</Link></li>
                            <li><Link to="/official" className="hover:text-[#FF9933]">Officer Portal</Link></li>
                            <li><Link to="/admin" className="hover:text-[#FF9933]">Admin</Link></li>
                            <li><a href="#" className="hover:text-[#FF9933]">Reports & Exports</a></li>
                        </ul>
                    </div>
                    <div className="md:col-span-3">
                        <div className="overline text-white/50 mb-3">Civic Promise</div>
                        <p className="text-sm text-white/70 leading-relaxed">
                            Every issue gets a response timestamp. Every closure has proof.
                            No complaint is silently deleted.
                        </p>
                    </div>
                </div>

                <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs text-white/50">
                    <div>© 2026 PublicOS Portal — An independent civic-tech initiative</div>
                    <div className="flex gap-5">
                        <a href="#" className="hover:text-white">Privacy</a>
                        <a href="#" className="hover:text-white">Terms</a>
                        <a href="#" className="hover:text-white">RTI Contact</a>
                        <a href="#" className="hover:text-white">Press</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
