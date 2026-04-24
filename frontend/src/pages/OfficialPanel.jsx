import React, { useState } from "react";
import { Landmark, Clock, AlertCircle, Upload, CheckCircle2, MessageSquare } from "lucide-react";
import { ISSUES } from "../lib/mockData";
import { StatusBadge } from "../components/shared/StatusBadge";
import { CategoryIcon } from "../components/shared/CategoryIcon";
import { toast } from "sonner";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "../components/ui/select";

export default function OfficialPanel() {
    const [selected, setSelected] = useState(ISSUES[0]);
    const [newStatus, setNewStatus] = useState(selected.status);
    const [remark, setRemark] = useState("");

    const handleUpdate = () => {
        toast.success(`Status updated to ${newStatus.replace("_", " ")}`);
    };

    return (
        <div data-testid="page-official" className="max-w-[1440px] mx-auto px-6 md:px-12 py-10 md:py-14">
            <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-[#0A192F] flex items-center justify-center text-white">
                        <Landmark size={24} />
                    </div>
                    <div>
                        <div className="overline text-[#FF9933] mb-1">Official Portal</div>
                        <h1 className="font-serif text-3xl md:text-4xl tracking-tight text-[#0A192F]">
                            Inspector R. Nair <span className="text-slate-400 font-normal text-2xl">· BBMP Ward 74</span>
                        </h1>
                    </div>
                </div>
                <div className="flex gap-6 text-right">
                    <Kpi num="42" label="Assigned" />
                    <Kpi num="8" label="SLA risk" accent="text-red-600" />
                    <Kpi num="94%" label="On-time" accent="text-emerald-700" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Queue */}
                <div className="lg:col-span-5">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg overflow-hidden">
                        <div className="p-5 border-b border-[#0A192F]/10 flex items-center justify-between">
                            <div>
                                <div className="font-serif text-xl">My queue</div>
                                <div className="text-xs text-slate-500">Filtered to your ward</div>
                            </div>
                            <Select defaultValue="all">
                                <SelectTrigger className="w-32" data-testid="official-filter"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    <SelectItem value="critical">Critical</SelectItem>
                                    <SelectItem value="sla">SLA risk</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="divide-y divide-[#0A192F]/5 max-h-[640px] overflow-y-auto" data-testid="official-queue">
                            {ISSUES.map((i) => (
                                <button
                                    key={i.id}
                                    onClick={() => { setSelected(i); setNewStatus(i.status); }}
                                    className={`w-full text-left p-4 flex gap-3 hover:bg-[#FAF9F6] transition-colors ${selected.id === i.id ? "bg-[#FAF9F6] border-l-4 border-[#FF9933]" : "border-l-4 border-transparent"}`}
                                    data-testid={`official-queue-item-${i.id}`}
                                >
                                    <div className="w-10 h-10 rounded-md bg-[#FAF9F6] flex items-center justify-center shrink-0">
                                        <CategoryIcon categoryId={i.category} size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-mono text-[10px] text-slate-400">#{i.id}</span>
                                            {i.urgency === "critical" && <span className="text-[9px] font-bold text-red-700 uppercase tracking-widest">Critical</span>}
                                        </div>
                                        <div className="font-semibold text-sm text-[#0A192F] line-clamp-2 leading-tight">{i.title}</div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <StatusBadge status={i.status} />
                                            <span className="text-[10px] text-slate-400 font-mono">{i.upvotes.toLocaleString()} support</span>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Detail */}
                <div className="lg:col-span-7 space-y-4">
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg overflow-hidden" data-testid="official-detail">
                        {selected.photos?.[0] && (
                            <div className="aspect-video bg-slate-100">
                                <img src={selected.photos[0]} className="w-full h-full object-cover" alt="" />
                            </div>
                        )}
                        <div className="p-6 space-y-4">
                            <div className="flex items-center gap-2 flex-wrap">
                                <StatusBadge status={selected.status} />
                                <span className="font-mono text-xs text-slate-400">#{selected.id}</span>
                                <span className="text-xs text-slate-500 ml-auto inline-flex items-center gap-1">
                                    <Clock size={12} /> SLA: 5d remaining
                                </span>
                            </div>
                            <h2 className="font-serif text-2xl leading-tight text-[#0A192F]">{selected.title}</h2>
                            <p className="text-sm text-slate-600 leading-relaxed">{selected.description}</p>
                            <div className="grid grid-cols-2 gap-3 p-4 bg-[#FAF9F6] rounded-md text-xs">
                                <div>
                                    <div className="overline text-slate-500 mb-1">Location</div>
                                    <div className="text-[#0A192F]">{selected.location.address}</div>
                                </div>
                                <div>
                                    <div className="overline text-slate-500 mb-1">Pincode</div>
                                    <div className="font-mono text-[#0A192F]">{selected.location.pincode}</div>
                                </div>
                                <div>
                                    <div className="overline text-slate-500 mb-1">Reporter</div>
                                    <div className="text-[#0A192F]">{selected.reporter.anonymous ? "Anonymous" : selected.reporter.name}</div>
                                </div>
                                <div>
                                    <div className="overline text-slate-500 mb-1">Citizens supporting</div>
                                    <div className="font-mono font-bold text-[#FF9933]">{selected.upvotes.toLocaleString()}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action panel */}
                    <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6 space-y-5">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={16} className="text-[#FF9933]" />
                            <div className="font-serif text-lg">Take action</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div className="overline text-slate-500 mb-2">Change status</div>
                                <Select value={newStatus} onValueChange={setNewStatus}>
                                    <SelectTrigger data-testid="official-status-select"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="under_review">Under Review</SelectItem>
                                        <SelectItem value="assigned">Assigned</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="resolved">Resolved</SelectItem>
                                        <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <div className="overline text-slate-500 mb-2">Assign to</div>
                                <Select defaultValue="team-a">
                                    <SelectTrigger data-testid="official-assign-select"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="team-a">Field Team A</SelectItem>
                                        <SelectItem value="team-b">Contractor X</SelectItem>
                                        <SelectItem value="escalate">Escalate to Mandal</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <div className="overline text-slate-500 mb-2 flex items-center gap-1"><MessageSquare size={12} /> Public remark</div>
                            <textarea
                                data-testid="official-remark"
                                value={remark}
                                onChange={(e) => setRemark(e.target.value)}
                                rows={3}
                                placeholder="Add a note visible to the citizen and on the public audit log..."
                                className="w-full border border-[#0A192F]/15 rounded-md px-3 py-2 text-sm bg-[#FAF9F6] focus:outline-none focus:border-[#0A192F]"
                            />
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={handleUpdate}
                                data-testid="official-update-btn"
                                className="inline-flex items-center gap-2 bg-[#0A192F] text-white font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#FF9933] transition-colors"
                            >
                                <CheckCircle2 size={15} /> Update status
                            </button>
                            <button
                                onClick={() => toast.success("Resolution proof uploaded (mocked)")}
                                data-testid="official-proof-btn"
                                className="inline-flex items-center gap-2 bg-[#138808] text-white font-semibold px-5 py-2.5 rounded-md text-sm hover:bg-[#0A192F] transition-colors"
                            >
                                <Upload size={15} /> Upload resolution proof
                            </button>
                            <button
                                onClick={() => toast.info("Escalated to mandal officer")}
                                data-testid="official-escalate-btn"
                                className="inline-flex items-center gap-2 bg-white border border-[#0A192F]/15 font-semibold px-5 py-2.5 rounded-md text-sm hover:border-[#0A192F]"
                            >
                                Escalate
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Kpi = ({ num, label, accent = "text-[#0A192F]" }) => (
    <div>
        <div className={`font-serif text-3xl tracking-tight ${accent}`}>{num}</div>
        <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">{label}</div>
    </div>
);
