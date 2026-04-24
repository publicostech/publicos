import React from "react";
import { Award, MapPin, TrendingUp, CheckCircle2, Clock, Bell, Bookmark } from "lucide-react";
import IssueCard from "../components/shared/IssueCard";
import { ISSUES } from "../lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";

const BADGES = [
    { name: "Verified Reporter", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
    { name: "100+ Reports", icon: Award, color: "text-[#FF9933]", bg: "bg-orange-50 border-orange-200" },
    { name: "Pollution Watch", icon: TrendingUp, color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
    { name: "First Responder", icon: Clock, color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
];

export default function Profile() {
    const avatar = "https://images.unsplash.com/photo-1560885673-34b9e5047b91?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBwb3J0cmFpdCUyMHNtaWxpbmd8ZW58MHx8fHwxNzc3MDExNjk1fDA&ixlib=rb-4.1.0&q=85";

    return (
        <div data-testid="page-profile" className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-14">
            {/* Profile header */}
            <div className="bg-[#0A192F] text-white rounded-lg p-8 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: "radial-gradient(circle at 80% 20%, #FF9933 0%, transparent 40%), radial-gradient(circle at 20% 80%, #138808 0%, transparent 40%)",
                }} />
                <div className="relative flex flex-col md:flex-row gap-6 items-start md:items-end justify-between">
                    <div className="flex gap-5 items-center">
                        <img src={avatar} alt="Arjun" className="w-24 h-24 rounded-lg object-cover border-2 border-[#FF9933]" />
                        <div>
                            <div className="overline text-[#FF9933] mb-2">Citizen · Verified</div>
                            <h1 className="font-serif text-4xl tracking-tight">Arjun Mehta</h1>
                            <div className="flex items-center gap-4 mt-2 text-sm text-white/60">
                                <span className="inline-flex items-center gap-1"><MapPin size={13} /> Bengaluru, Karnataka</span>
                                <span>Member since Sep 2024</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-6">
                        <Stat num="142" label="Reports" />
                        <Stat num="118" label="Resolved" />
                        <Stat num="4,860" label="Points" accent="text-[#FF9933]" />
                    </div>
                </div>
            </div>

            {/* Badges */}
            <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6 mb-6">
                <div className="overline text-slate-500 mb-4">Badges earned</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {BADGES.map((b) => (
                        <div key={b.name} className={`flex items-center gap-3 p-4 rounded-md border ${b.bg}`} data-testid={`badge-${b.name.toLowerCase().replace(/\s+/g, "-")}`}>
                            <b.icon size={22} className={b.color} strokeWidth={1.5} />
                            <div className="font-semibold text-sm text-[#0A192F]">{b.name}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="mine" className="w-full">
                <TabsList className="bg-white border border-[#0A192F]/10 h-auto p-1">
                    <TabsTrigger value="mine" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-4 py-2" data-testid="profile-tab-mine">My reports</TabsTrigger>
                    <TabsTrigger value="following" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-4 py-2" data-testid="profile-tab-following">Following</TabsTrigger>
                    <TabsTrigger value="notifications" className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white px-4 py-2" data-testid="profile-tab-notifs">Notifications</TabsTrigger>
                </TabsList>

                <TabsContent value="mine" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {ISSUES.slice(0, 6).map((i) => (
                            <IssueCard key={i.id} issue={i} />
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="following" className="mt-6">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6">
                        <div className="overline text-slate-500 mb-4">Following · 7 locations & categories</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {["HSR Layout, Bengaluru", "Pollution category", "Electronic City pincode 560100", "BBMP Roads Division", "Whitefield ward", "Garbage Collection", "Water Supply category"].map((f) => (
                                <div key={f} className="flex items-center gap-3 p-3 border border-[#0A192F]/10 rounded-md">
                                    <Bookmark size={15} className="text-[#FF9933]" />
                                    <span className="text-sm font-semibold text-[#0A192F] flex-1">{f}</span>
                                    <button className="text-xs text-slate-400 hover:text-red-600">Unfollow</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="notifications" className="mt-6">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg divide-y divide-[#0A192F]/5">
                        {[
                            { icon: CheckCircle2, text: "Your issue #CT-2404 was marked Resolved", when: "3h ago", color: "text-emerald-700" },
                            { icon: TrendingUp, text: "Your report #CT-2401 reached 1,000 supports", when: "6h ago", color: "text-[#FF9933]" },
                            { icon: Bell, text: "New report in HSR Layout: Pothole on 27th Main", when: "12h ago", color: "text-blue-700" },
                            { icon: Award, text: "You earned the 'Pollution Watch' badge", when: "2d ago", color: "text-purple-700" },
                        ].map((n, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 hover:bg-[#FAF9F6]">
                                <n.icon size={18} className={n.color} strokeWidth={1.5} />
                                <div className="flex-1 text-sm text-[#0A192F]">{n.text}</div>
                                <div className="text-xs text-slate-400 font-mono">{n.when}</div>
                            </div>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

const Stat = ({ num, label, accent = "text-white" }) => (
    <div>
        <div className={`font-serif text-3xl tracking-tight ${accent}`}>{num}</div>
        <div className="text-[10px] uppercase tracking-widest text-white/60 font-semibold">{label}</div>
    </div>
);
