import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
    Camera, MapPin, AlertCircle, ChevronRight, ChevronLeft, CheckCircle2, Eye, EyeOff, Upload, Navigation,
} from "lucide-react";
import { CATEGORIES, URGENCIES } from "../lib/mockData";
import { CategoryIcon } from "../components/shared/CategoryIcon";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";

const STEPS = [
    { id: 1, label: "Category" },
    { id: 2, label: "Details" },
    { id: 3, label: "Media" },
    { id: 4, label: "Location" },
    { id: 5, label: "Review" },
];

export default function Submit() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        category: "",
        title: "",
        description: "",
        urgency: "medium",
        anonymous: false,
        photos: [],
        address: "",
        pincode: "",
        city: "",
        state: "",
    });

    const update = (k, v) => setForm({ ...form, [k]: v });

    const next = () => setStep(Math.min(5, step + 1));
    const prev = () => setStep(Math.max(1, step - 1));

    const submit = () => {
        toast.success("Issue submitted successfully", {
            description: `Tracking ID: CT-${Math.floor(Math.random() * 9000 + 1000)}`,
        });
        setTimeout(() => navigate("/feed"), 1200);
    };

    const canProceed = () => {
        if (step === 1) return !!form.category;
        if (step === 2) return form.title.trim().length >= 10 && form.description.trim().length >= 20;
        if (step === 4) return form.address && form.city && form.state;
        return true;
    };

    return (
        <div data-testid="page-submit" className="max-w-5xl mx-auto px-6 md:px-12 py-10 md:py-16">
            <div className="mb-10">
                <div className="overline text-[#FF9933] mb-3">Report an issue</div>
                <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-[#0A192F]">
                    Your report goes on the public ledger.
                </h1>
                <p className="text-slate-600 mt-3 max-w-xl">
                    Takes under 90 seconds. Photos and GPS speed up resolution 3x.
                </p>
            </div>

            {/* Progress */}
            <div className="flex items-center mb-10 gap-2 md:gap-4 overflow-x-auto pb-2" data-testid="submit-stepper">
                {STEPS.map((s, i) => (
                    <React.Fragment key={s.id}>
                        <div className={`flex items-center gap-2 shrink-0 ${step >= s.id ? "text-[#0A192F]" : "text-slate-400"}`}>
                            <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-mono text-xs font-bold ${
                                step > s.id
                                    ? "bg-emerald-600 border-emerald-600 text-white"
                                    : step === s.id
                                    ? "bg-[#0A192F] border-[#0A192F] text-white"
                                    : "bg-white border-slate-300"
                            }`}>
                                {step > s.id ? <CheckCircle2 size={14} /> : s.id}
                            </div>
                            <span className="text-xs font-semibold uppercase tracking-wider">{s.label}</span>
                        </div>
                        {i < STEPS.length - 1 && (
                            <div className={`flex-1 h-0.5 min-w-[20px] ${step > s.id ? "bg-emerald-600" : "bg-slate-200"}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="bg-white border border-[#0A192F]/10 rounded-lg p-6 md:p-10 min-h-[480px]">
                {/* Step 1: Category */}
                {step === 1 && (
                    <div data-testid="submit-step-category">
                        <h2 className="font-serif text-2xl md:text-3xl mb-2">What kind of issue is it?</h2>
                        <p className="text-slate-600 mb-8 text-sm">Pick the closest match. AI will suggest a better category if available.</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {CATEGORIES.map((c) => (
                                <button
                                    key={c.id}
                                    onClick={() => update("category", c.id)}
                                    data-testid={`submit-category-${c.id}`}
                                    className={`p-5 border rounded-lg text-left hover:-translate-y-0.5 transition-all ${
                                        form.category === c.id
                                            ? "border-[#0A192F] bg-[#FAF9F6] ring-2 ring-[#FF9933]"
                                            : "border-[#0A192F]/10 bg-white hover:border-[#0A192F]/30"
                                    }`}
                                >
                                    <CategoryIcon categoryId={c.id} size={22} />
                                    <div className="font-semibold text-sm mt-3 text-[#0A192F]">{c.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                    <div data-testid="submit-step-details" className="space-y-6">
                        <div>
                            <h2 className="font-serif text-2xl md:text-3xl mb-2">Tell us what's happening.</h2>
                            <p className="text-slate-600 text-sm">Be specific. Specific complaints get fixed 2x faster.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                data-testid="submit-title"
                                placeholder="e.g. Large pothole near Forum mall causing accidents"
                                value={form.title}
                                onChange={(e) => update("title", e.target.value)}
                                className="h-12 bg-white"
                            />
                            <div className="text-xs text-slate-400 font-mono">{form.title.length}/120</div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea
                                id="desc"
                                data-testid="submit-description"
                                placeholder="How long has this been going on? Who is affected? Any previous complaints?"
                                value={form.description}
                                onChange={(e) => update("description", e.target.value)}
                                rows={5}
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-3">
                            <Label>Urgency</Label>
                            <div className="grid grid-cols-4 gap-2">
                                {URGENCIES.map((u) => (
                                    <button
                                        key={u.id}
                                        onClick={() => update("urgency", u.id)}
                                        data-testid={`submit-urgency-${u.id}`}
                                        className={`py-2.5 rounded-md text-sm font-semibold border transition-colors ${
                                            form.urgency === u.id
                                                ? u.id === "critical" ? "bg-red-600 text-white border-red-600"
                                                : u.id === "high" ? "bg-[#FF9933] text-white border-[#FF9933]"
                                                : u.id === "medium" ? "bg-amber-500 text-white border-amber-500"
                                                : "bg-[#138808] text-white border-[#138808]"
                                                : "bg-white border-[#0A192F]/15 text-[#0A192F]"
                                        }`}
                                    >
                                        {u.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex items-center justify-between p-4 border border-[#0A192F]/10 rounded-md bg-[#FAF9F6]">
                            <div className="flex items-center gap-3">
                                {form.anonymous ? <EyeOff size={18} className="text-slate-600" /> : <Eye size={18} className="text-slate-600" />}
                                <div>
                                    <div className="font-semibold text-sm">Report anonymously</div>
                                    <div className="text-xs text-slate-500">Your name won't appear publicly. Officials still get a case ID.</div>
                                </div>
                            </div>
                            <Switch
                                data-testid="submit-anonymous"
                                checked={form.anonymous}
                                onCheckedChange={(v) => update("anonymous", v)}
                            />
                        </div>
                    </div>
                )}

                {/* Step 3: Media */}
                {step === 3 && (
                    <div data-testid="submit-step-media">
                        <h2 className="font-serif text-2xl md:text-3xl mb-2">Add photos or video.</h2>
                        <p className="text-slate-600 mb-8 text-sm">Evidence makes your report 3x more credible.</p>
                        <div className="border-2 border-dashed border-[#0A192F]/15 rounded-lg p-10 text-center bg-[#FAF9F6]">
                            <Upload size={32} strokeWidth={1.5} className="mx-auto text-slate-400 mb-4" />
                            <div className="font-semibold text-[#0A192F] mb-1">Drop files here or click to upload</div>
                            <div className="text-xs text-slate-500 mb-4">JPG, PNG, MP4 up to 50 MB each · max 5 files</div>
                            <button
                                onClick={() => {
                                    update("photos", ["mock-photo-1.jpg", "mock-photo-2.jpg"]);
                                    toast.success("2 photos attached (mocked)");
                                }}
                                data-testid="submit-upload-mock"
                                className="inline-flex items-center gap-2 bg-[#0A192F] text-white font-semibold px-5 py-2.5 rounded-md hover:bg-[#FF9933] transition-colors"
                            >
                                <Camera size={15} /> Simulate upload
                            </button>
                        </div>
                        {form.photos.length > 0 && (
                            <div className="mt-4 font-mono text-xs text-emerald-700">
                                ✓ {form.photos.length} file(s) attached
                            </div>
                        )}
                    </div>
                )}

                {/* Step 4: Location */}
                {step === 4 && (
                    <div data-testid="submit-step-location" className="space-y-6">
                        <div>
                            <h2 className="font-serif text-2xl md:text-3xl mb-2">Where is the problem?</h2>
                            <p className="text-slate-600 text-sm">Use GPS or enter manually. Pincode helps route to the right ward.</p>
                        </div>
                        <button
                            onClick={() => {
                                update("address", "Hosur Road, Electronic City Phase 1");
                                update("pincode", "560100");
                                update("city", "Bengaluru");
                                update("state", "Karnataka");
                                toast.success("Location detected via GPS (mocked)");
                            }}
                            data-testid="submit-gps-btn"
                            className="w-full md:w-auto inline-flex items-center gap-2 bg-[#FF9933] text-white font-semibold px-5 py-3 rounded-md hover:bg-[#0A192F] transition-colors"
                        >
                            <Navigation size={16} /> Auto-detect location
                        </button>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2 space-y-2">
                                <Label>Address / Landmark</Label>
                                <Input data-testid="submit-address" value={form.address} onChange={(e) => update("address", e.target.value)} placeholder="House no, street, landmark" className="h-12 bg-white" />
                            </div>
                            <div className="space-y-2">
                                <Label>Pincode</Label>
                                <Input data-testid="submit-pincode" value={form.pincode} onChange={(e) => update("pincode", e.target.value)} placeholder="6-digit pincode" className="h-12 bg-white font-mono" />
                            </div>
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input data-testid="submit-city" value={form.city} onChange={(e) => update("city", e.target.value)} className="h-12 bg-white" />
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <Label>State</Label>
                                <Input data-testid="submit-state" value={form.state} onChange={(e) => update("state", e.target.value)} className="h-12 bg-white" />
                            </div>
                        </div>
                        <div className="bg-[#FAF9F6] border border-[#0A192F]/10 rounded-md p-4 flex items-start gap-3">
                            <MapPin size={18} className="text-[#FF9933] shrink-0 mt-0.5" />
                            <div className="text-xs text-slate-600">
                                Map preview will appear here once you enter a location. GPS coordinates are encrypted and only shared with the assigned department.
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Review */}
                {step === 5 && (
                    <div data-testid="submit-step-review" className="space-y-6">
                        <h2 className="font-serif text-2xl md:text-3xl mb-2">One last look.</h2>
                        <p className="text-slate-600 text-sm mb-6">You can edit anything before submitting. Once live, edits are logged.</p>
                        <div className="bg-[#FAF9F6] border border-[#0A192F]/10 rounded-lg p-6 space-y-4">
                            <Row label="Category" value={CATEGORIES.find((c) => c.id === form.category)?.label || "—"} />
                            <Row label="Title" value={form.title || "—"} />
                            <Row label="Description" value={form.description || "—"} />
                            <Row label="Urgency" value={form.urgency} />
                            <Row label="Reporting as" value={form.anonymous ? "Anonymous" : "Signed-in citizen"} />
                            <Row label="Photos" value={`${form.photos.length} attached`} />
                            <Row label="Location" value={`${form.address || "—"}, ${form.city || "—"}, ${form.state || "—"} ${form.pincode || ""}`} />
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-md">
                            <AlertCircle size={18} className="text-amber-700 shrink-0 mt-0.5" />
                            <div className="text-xs text-amber-900">
                                Fake or abusive reports can lead to account suspension. Officials verify photos.
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
                <button
                    onClick={prev}
                    disabled={step === 1}
                    data-testid="submit-prev-btn"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A192F] disabled:text-slate-300 disabled:cursor-not-allowed"
                >
                    <ChevronLeft size={16} /> Back
                </button>
                {step < 5 ? (
                    <button
                        onClick={next}
                        disabled={!canProceed()}
                        data-testid="submit-next-btn"
                        className="inline-flex items-center gap-2 bg-[#0A192F] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#FF9933] transition-colors disabled:bg-slate-300 disabled:cursor-not-allowed"
                    >
                        Continue <ChevronRight size={16} />
                    </button>
                ) : (
                    <button
                        onClick={submit}
                        data-testid="submit-final-btn"
                        className="inline-flex items-center gap-2 bg-[#138808] text-white font-semibold px-6 py-3 rounded-md hover:bg-[#0A192F] transition-colors"
                    >
                        Submit to public ledger <CheckCircle2 size={16} />
                    </button>
                )}
            </div>
        </div>
    );
}

const Row = ({ label, value }) => (
    <div className="flex flex-col md:flex-row gap-1 md:gap-8 pb-3 border-b border-[#0A192F]/5 last:border-0 last:pb-0">
        <div className="overline text-slate-500 md:w-40 shrink-0">{label}</div>
        <div className="text-sm text-[#0A192F] flex-1">{value}</div>
    </div>
);
