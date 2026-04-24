import React, { useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import IssueCard from "../components/shared/IssueCard";
import { ISSUES, CATEGORIES, STATUSES, URGENCIES, STATES } from "../lib/mockData";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";

const SORT_TABS = [
    { id: "latest", label: "Latest" },
    { id: "trending", label: "Trending" },
    { id: "nearby", label: "Nearby" },
    { id: "resolved", label: "Recently Resolved" },
    { id: "critical", label: "Critical" },
];

export default function Feed() {
    const [sort, setSort] = useState("latest");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");
    const [state, setState] = useState("all");
    const [urgency, setUrgency] = useState("all");
    const [showFilters, setShowFilters] = useState(false);

    const filtered = useMemo(() => {
        let arr = [...ISSUES];
        if (query)
            arr = arr.filter(
                (i) =>
                    i.title.toLowerCase().includes(query.toLowerCase()) ||
                    i.description.toLowerCase().includes(query.toLowerCase()) ||
                    i.location.city.toLowerCase().includes(query.toLowerCase()) ||
                    i.location.pincode.includes(query)
            );
        if (category !== "all") arr = arr.filter((i) => i.category === category);
        if (status !== "all") arr = arr.filter((i) => i.status === status);
        if (state !== "all") arr = arr.filter((i) => i.location.state === state);
        if (urgency !== "all") arr = arr.filter((i) => i.urgency === urgency);

        if (sort === "trending") arr.sort((a, b) => b.upvotes - a.upvotes);
        else if (sort === "resolved")
            arr = arr.filter((i) => i.status === "resolved");
        else if (sort === "critical")
            arr = arr.filter((i) => i.urgency === "critical");
        else if (sort === "latest")
            arr.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt));
        return arr;
    }, [query, category, status, state, urgency, sort]);

    const clearFilters = () => {
        setQuery("");
        setCategory("all");
        setStatus("all");
        setState("all");
        setUrgency("all");
    };

    const activeFilters = [category, status, state, urgency].filter((v) => v !== "all").length;

    return (
        <div data-testid="page-feed" className="max-w-7xl mx-auto px-6 md:px-12 py-10 md:py-16">
            {/* Header */}
            <div className="mb-10">
                <div className="overline text-[#FF9933] mb-3">Public Feed</div>
                <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-[#0A192F] mb-4">
                    What India is reporting.
                </h1>
                <p className="text-slate-600 max-w-xl leading-relaxed">
                    Every issue, every status update, every resolution — filter, follow, and raise your voice on what matters.
                </p>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" strokeWidth={1.75} />
                    <Input
                        data-testid="feed-search-input"
                        placeholder="Search by title, city, pincode, or keyword..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 h-12 bg-white border-[#0A192F]/15 text-base"
                    />
                </div>
                <button
                    data-testid="feed-filters-toggle"
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex items-center gap-2 px-4 h-12 bg-white border border-[#0A192F]/15 rounded-md font-semibold text-sm hover:border-[#0A192F]"
                >
                    <SlidersHorizontal size={16} strokeWidth={1.75} />
                    Filters
                    {activeFilters > 0 && (
                        <span className="bg-[#FF9933] text-white font-mono text-[10px] px-1.5 py-0.5 rounded-full">{activeFilters}</span>
                    )}
                </button>
            </div>

            {showFilters && (
                <div className="bg-white border border-[#0A192F]/10 rounded-lg p-5 mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <div className="overline text-slate-500 mb-2">Category</div>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger data-testid="filter-category"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All categories</SelectItem>
                                {CATEGORIES.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <div className="overline text-slate-500 mb-2">Status</div>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger data-testid="filter-status"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any status</SelectItem>
                                {STATUSES.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <div className="overline text-slate-500 mb-2">State</div>
                        <Select value={state} onValueChange={setState}>
                            <SelectTrigger data-testid="filter-state"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All states</SelectItem>
                                {STATES.map((s) => (
                                    <SelectItem key={s} value={s}>{s}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <div className="overline text-slate-500 mb-2">Urgency</div>
                        <Select value={urgency} onValueChange={setUrgency}>
                            <SelectTrigger data-testid="filter-urgency"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any urgency</SelectItem>
                                {URGENCIES.map((u) => (
                                    <SelectItem key={u.id} value={u.id}>{u.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {activeFilters > 0 && (
                        <button
                            onClick={clearFilters}
                            data-testid="filter-clear"
                            className="col-span-2 md:col-span-4 inline-flex items-center gap-2 text-sm text-[#0A192F] justify-start hover:text-[#FF9933]"
                        >
                            <X size={14} /> Clear all filters
                        </button>
                    )}
                </div>
            )}

            {/* Sort tabs */}
            <Tabs value={sort} onValueChange={setSort} className="mb-8">
                <TabsList className="bg-white border border-[#0A192F]/10 h-auto p-1 flex-wrap justify-start gap-1">
                    {SORT_TABS.map((s) => (
                        <TabsTrigger
                            key={s.id}
                            value={s.id}
                            data-testid={`sort-tab-${s.id}`}
                            className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white font-semibold text-xs md:text-sm px-4 py-2"
                        >
                            {s.label}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            {/* Results count */}
            <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-mono text-slate-500" data-testid="feed-result-count">
                    {filtered.length} of {ISSUES.length} issues
                </div>
            </div>

            {/* Grid */}
            {filtered.length === 0 ? (
                <div className="bg-white border border-[#0A192F]/10 rounded-lg p-16 text-center" data-testid="feed-empty">
                    <div className="font-serif text-2xl mb-2 text-[#0A192F]">No issues match your filters.</div>
                    <p className="text-slate-500 mb-4">Try clearing filters or searching a different term.</p>
                    <button
                        onClick={clearFilters}
                        className="inline-flex items-center gap-2 text-sm text-[#FF9933] font-semibold"
                    >
                        Reset all filters
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="feed-grid">
                    {filtered.map((issue) => (
                        <IssueCard key={issue.id} issue={issue} />
                    ))}
                </div>
            )}
        </div>
    );
}
