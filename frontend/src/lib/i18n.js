import React, { createContext, useContext, useState } from "react";

const translations = {
    en: {
        nav: {
            home: "Home", feed: "Public Feed", submit: "Report Issue", map: "Map",
            dashboard: "Dashboard", profile: "Profile", admin: "Admin", official: "Official",
        },
        hero: {
            eyebrow: "A Civic Accountability Initiative",
            title: "Every pothole. Every complaint. Every promise kept.",
            subtitle: "PublicOS is India's public ledger of civic issues — open, auditable, and built for citizens, not bureaucracies.",
            cta_primary: "Report an Issue",
            cta_secondary: "Explore the Feed",
        },
        common: {
            report: "Report", track: "Track", resolve: "Resolve", view_all: "View all",
            upvote: "Support", comment: "Comment", share: "Share",
            status: "Status", category: "Category", location: "Location", reported: "Reported",
            search: "Search", filter: "Filter", clear: "Clear", apply: "Apply",
            cancel: "Cancel", submit: "Submit", save: "Save", next: "Next", back: "Back",
            loading: "Loading…", retry: "Retry",
        },
        status: {
            submitted: "Submitted", under_review: "Under Review", assigned: "Assigned",
            in_progress: "In Progress", resolved: "Resolved", rejected: "Rejected",
            closure_requested: "Closure pending", closed: "Closed",
        },
        feed: {
            title: "The public ledger",
            subtitle: "Every report, every status change, every official decision — visible, time-stamped, and unalterable.",
            empty: "No issues yet. Be the first to report.",
            sort_recent: "Most recent", sort_supported: "Most supported", sort_urgent: "Most urgent",
        },
        submit: {
            title: "Report an issue", step1: "Location", step2: "Details", step3: "Photos", step4: "Review",
        },
    },
    hi: {
        nav: {
            home: "मुखपृष्ठ", feed: "सार्वजनिक फ़ीड", submit: "समस्या दर्ज करें", map: "नक्शा",
            dashboard: "डैशबोर्ड", profile: "प्रोफ़ाइल", admin: "व्यवस्थापक", official: "अधिकारी",
        },
        hero: {
            eyebrow: "एक नागरिक जवाबदेही पहल",
            title: "हर गड्ढा. हर शिकायत. हर वादा पूरा.",
            subtitle: "PublicOS भारत का सार्वजनिक नागरिक मुद्दों का खुला लेखाजोखा है — पारदर्शी, ऑडिट योग्य, और नागरिकों के लिए बना है।",
            cta_primary: "समस्या दर्ज करें",
            cta_secondary: "फ़ीड देखें",
        },
        common: {
            report: "रिपोर्ट", track: "ट्रैक", resolve: "हल", view_all: "सभी देखें",
            upvote: "समर्थन", comment: "टिप्पणी", share: "साझा करें",
            status: "स्थिति", category: "श्रेणी", location: "स्थान", reported: "दर्ज",
            search: "खोजें", filter: "फ़िल्टर", clear: "साफ़ करें", apply: "लागू करें",
            cancel: "रद्द करें", submit: "सबमिट करें", save: "सहेजें", next: "अगला", back: "वापस",
            loading: "लोड हो रहा है…", retry: "पुनः प्रयास",
        },
        status: {
            submitted: "दर्ज", under_review: "समीक्षाधीन", assigned: "आवंटित",
            in_progress: "प्रगति पर", resolved: "हल", rejected: "अस्वीकृत",
            closure_requested: "बंद करने का अनुरोध", closed: "बंद",
        },
        feed: {
            title: "सार्वजनिक खाता-बही",
            subtitle: "हर रिपोर्ट, हर स्थिति बदलाव, हर सरकारी निर्णय — दृश्य, समय-मुहर लगा, और अपरिवर्तनीय।",
            empty: "अभी तक कोई समस्या नहीं। सबसे पहले रिपोर्ट करें।",
            sort_recent: "सबसे हाल", sort_supported: "सबसे समर्थित", sort_urgent: "सबसे ज़रूरी",
        },
        submit: {
            title: "समस्या दर्ज करें", step1: "स्थान", step2: "विवरण", step3: "फ़ोटो", step4: "समीक्षा",
        },
    },
    te: {
        nav: {
            home: "హోమ్", feed: "పబ్లిక్ ఫీడ్", submit: "సమస్యను నివేదించండి", map: "మ్యాప్",
            dashboard: "డాష్‌బోర్డ్", profile: "ప్రొఫైల్", admin: "అడ్మిన్", official: "అధికారి",
        },
        hero: {
            eyebrow: "పౌర జవాబుదారీతనం కార్యక్రమం",
            title: "ప్రతి గుంట. ప్రతి ఫిర్యాదు. ప్రతి వాగ్దానం.",
            subtitle: "PublicOS భారతదేశ పౌర సమస్యల బహిరంగ లెడ్జర్ — పారదర్శకంగా, ఆడిట్ చేయదగినది, పౌరుల కోసం రూపొందించబడింది.",
            cta_primary: "సమస్యను నివేదించండి",
            cta_secondary: "ఫీడ్ చూడండి",
        },
        common: {
            report: "నివేదిక", track: "ట్రాక్", resolve: "పరిష్కరించు", view_all: "అన్నీ చూడండి",
            upvote: "మద్దతు", comment: "వ్యాఖ్య", share: "పంచుకోండి",
            status: "స్థితి", category: "వర్గం", location: "ప్రదేశం", reported: "నివేదించబడింది",
            search: "శోధించు", filter: "ఫిల్టర్", clear: "క్లియర్", apply: "వర్తింపజేయి",
            cancel: "రద్దు", submit: "సమర్పించు", save: "సేవ్", next: "తదుపరి", back: "వెనుకకు",
            loading: "లోడ్ అవుతోంది…", retry: "మళ్ళీ ప్రయత్నించు",
        },
        status: {
            submitted: "సమర్పించబడింది", under_review: "సమీక్షలో", assigned: "కేటాయించబడింది",
            in_progress: "పురోగతిలో", resolved: "పరిష్కరించబడింది", rejected: "తిరస్కరించబడింది",
            closure_requested: "మూసివేత పెండింగ్", closed: "మూసివేయబడింది",
        },
        feed: {
            title: "ప్రజా రికార్డు",
            subtitle: "ప్రతి నివేదిక, ప్రతి స్థితి మార్పు, ప్రతి అధికారిక నిర్ణయం — కనిపించే, టైమ్‌స్టాంప్, మరియు మార్చలేనిది.",
            empty: "ఇంకా సమస్యలు లేవు. మీరే మొదట నివేదించండి.",
            sort_recent: "ఇటీవలివి", sort_supported: "ఎక్కువ మద్దతు", sort_urgent: "అత్యవసరం",
        },
        submit: {
            title: "సమస్యను నివేదించండి", step1: "ప్రదేశం", step2: "వివరాలు", step3: "ఫోటోలు", step4: "సమీక్ష",
        },
    },
};

const LanguageContext = createContext({ lang: "en", setLang: () => {}, t: (key) => key });

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(() => {
        try { return localStorage.getItem("publicos.lang") || "en"; } catch { return "en"; }
    });
    const setLangPersist = (l) => {
        try { localStorage.setItem("publicos.lang", l); } catch {}
        setLang(l);
    };

    const t = (path) => {
        const parts = path.split(".");
        let cur = translations[lang] || translations.en;
        for (const p of parts) {
            cur = cur?.[p];
            if (cur === undefined) {
                // fallback to English
                let fb = translations.en;
                for (const q of parts) { fb = fb?.[q]; if (fb === undefined) return path; }
                return fb;
            }
        }
        return cur;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang: setLangPersist, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLang = () => useContext(LanguageContext);
