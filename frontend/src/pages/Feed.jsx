import React, { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, Loader2 } from "lucide-react";
import IssueCard from "../components/shared/IssueCard";
import { api } from "../lib/api";
import { CATEGORIES, STATUSES, URGENCIES, STATES } from "../lib/mockData";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Input } from "../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useLang } from "../lib/i18n";

const SORT_TABS_KEYS = [
    { id: "latest", k: "feed.sort_recent" },
    { id: "trending", k: "feed.sort_supported" },
    { id: "resolved", k: "status.resolved" },
    { id: "critical", k: "feed.sort_urgent" },
];

export default function Feed() {
    const { t } = useLang();
    const [sort, setSort] = useState("latest");
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");
    const [state, setState] = useState("all");
    const [urgency, setUrgency] = useState("all");
    const [showFilters, setShowFilters] = useState(false);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        api
            .get("/issues", {
                params: {
                    category, status, state, urgency, sort,
                    q: query || undefined, limit: 60,
                },
            })
            .then((r) => setIssues(r.data))
            .catch(() => setIssues([]))
            .finally(() => setLoading(false));
    }, [category, status, state, urgency, sort, query]);

    const clearFilters = () => {
        setQuery("");
        setCategory("all");
        setStatus("all");
        setState("all");
        setUrgency("all");
    };

    const activeFilters = [category, status, state, urgency].filter((v) => v !== "all").length;

    return (
        <div data-testid="page-feed" className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-16">
            <div className="mb-8 md:mb-10">
                <div className="overline text-[#FF9933] mb-3">{t("nav.feed")}</div>
                <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl tracking-tight text-[#0A192F] mb-3">
                    {t("feed.title")}
                </h1>
                <p className="text-slate-600 max-w-xl leading-relaxed">
                    {t("feed.subtitle")}
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
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
                    className="inline-flex items-center justify-center gap-2 px-4 h-12 bg-white border border-[#0A192F]/15 rounded-md font-semibold text-sm hover:border-[#0A192F]"
                >
                    <SlidersHorizontal size={16} />
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
                                {CATEGORIES.map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <div className="overline text-slate-500 mb-2">Status</div>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger data-testid="filter-status"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any status</SelectItem>
                                {STATUSES.map((s) => <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <div className="overline text-slate-500 mb-2">State</div>
                        <Select value={state} onValueChange={setState}>
                            <SelectTrigger data-testid="filter-state"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All states</SelectItem>
                                {STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <div className="overline text-slate-500 mb-2">Urgency</div>
                        <Select value={urgency} onValueChange={setUrgency}>
                            <SelectTrigger data-testid="filter-urgency"><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Any urgency</SelectItem>
                                {URGENCIES.map((u) => <SelectItem key={u.id} value={u.id}>{u.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    {activeFilters > 0 && (
                        <button onClick={clearFilters} data-testid="filter-clear" className="col-span-2 md:col-span-4 inline-flex items-center gap-2 text-sm text-[#0A192F] hover:text-[#FF9933]">
                            <X size={14} /> Clear all filters
                        </button>
                    )}
                </div>
            )}

            <Tabs value={sort} onValueChange={setSort} className="mb-6">
                <TabsList className="bg-white border border-[#0A192F]/10 h-auto p-1 flex-wrap justify-start gap-1">
                    {SORT_TABS_KEYS.map((s) => (
                        <TabsTrigger
                            key={s.id}
                            value={s.id}
                            data-testid={`sort-tab-${s.id}`}
                            className="data-[state=active]:bg-[#0A192F] data-[state=active]:text-white font-semibold text-xs md:text-sm px-3 sm:px-4 py-2"
                        >
                            {t(s.k)}
                        </TabsTrigger>
                    ))}
                </TabsList>
            </Tabs>

            <div className="flex items-center justify-between mb-5">
                <div className="text-sm font-mono text-slate-500" data-testid="feed-result-count">
                    {loading ? t("common.loading") : `${issues.length} ${issues.length === 1 ? "issue" : "issues"}`}
                </div>
            </div>

            {loading ? (
                <div className="py-16 flex justify-center"><Loader2 size={28} className="animate-spin text-[#FF9933]" /></div>
            ) : issues.length === 0 ? (
                <div className="bg-white border border-[#0A192F]/10 rounded-lg p-12 text-center" data-testid="feed-empty">
                    <div className="font-serif text-2xl mb-2 text-[#0A192F]">No issues match your filters.</div>
                    <p className="text-slate-500 mb-4">Try clearing filters or be the first to report.</p>
                    <button onClick={clearFilters} className="text-sm text-[#FF9933] font-semibold">Reset filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" data-testid="feed-grid">
                    {issues.map((issue) => <IssueCard key={issue.issue_id} issue={issue} />)}
                </div>
            )}
        </div>
    );
}
