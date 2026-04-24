import React, { createContext, useContext, useState } from "react";

const translations = {
    en: {
        nav: {
            home: "Home",
            feed: "Public Feed",
            submit: "Report Issue",
            map: "Map",
            dashboard: "Dashboard",
            profile: "Profile",
            admin: "Admin",
            official: "Official",
        },
        hero: {
            eyebrow: "A Civic Accountability Initiative",
            title: "Every pothole. Every complaint. Every promise kept.",
            subtitle:
                "CivicTrack is India's public ledger of civic issues — open, auditable, and built for citizens, not bureaucracies.",
            cta_primary: "Report an Issue",
            cta_secondary: "Explore the Feed",
        },
        common: {
            report: "Report",
            track: "Track",
            resolve: "Resolve",
            view_all: "View all",
            upvote: "Support",
            comment: "Comment",
            share: "Share",
            status: "Status",
            category: "Category",
            location: "Location",
            reported: "Reported",
        },
        status: {
            submitted: "Submitted",
            under_review: "Under Review",
            assigned: "Assigned",
            in_progress: "In Progress",
            resolved: "Resolved",
            rejected: "Rejected",
        },
    },
    hi: {
        nav: {
            home: "मुखपृष्ठ",
            feed: "सार्वजनिक फ़ीड",
            submit: "समस्या दर्ज करें",
            map: "नक्शा",
            dashboard: "डैशबोर्ड",
            profile: "प्रोफ़ाइल",
            admin: "व्यवस्थापक",
            official: "अधिकारी",
        },
        hero: {
            eyebrow: "एक नागरिक जवाबदेही पहल",
            title: "हर गड्ढा. हर शिकायत. हर वादा पूरा.",
            subtitle:
                "CivicTrack भारत का सार्वजनिक नागरिक मुद्दों का खुला लेखाजोखा है — पारदर्शी, ऑडिट योग्य, और नागरिकों के लिए बना है।",
            cta_primary: "समस्या दर्ज करें",
            cta_secondary: "फ़ीड देखें",
        },
        common: {
            report: "रिपोर्ट",
            track: "ट्रैक",
            resolve: "हल",
            view_all: "सभी देखें",
            upvote: "समर्थन",
            comment: "टिप्पणी",
            share: "साझा करें",
            status: "स्थिति",
            category: "श्रेणी",
            location: "स्थान",
            reported: "दर्ज",
        },
        status: {
            submitted: "दर्ज",
            under_review: "समीक्षाधीन",
            assigned: "आवंटित",
            in_progress: "प्रगति पर",
            resolved: "हल",
            rejected: "अस्वीकृत",
        },
    },
    te: {
        nav: {
            home: "హోమ్",
            feed: "పబ్లిక్ ఫీడ్",
            submit: "సమస్యను నివేదించండి",
            map: "మ్యాప్",
            dashboard: "డాష్‌బోర్డ్",
            profile: "ప్రొఫైల్",
            admin: "అడ్మిన్",
            official: "అధికారి",
        },
        hero: {
            eyebrow: "పౌర జవాబుదారీతనం కార్యక్రమం",
            title: "ప్రతి గుంట. ప్రతి ఫిర్యాదు. ప్రతి వాగ్దానం.",
            subtitle:
                "CivicTrack భారతదేశ పౌర సమస్యల బహిరంగ లెడ్జర్ — పారదర్శకంగా, ఆడిట్ చేయదగినది, పౌరుల కోసం రూపొందించబడింది.",
            cta_primary: "సమస్యను నివేదించండి",
            cta_secondary: "ఫీడ్ చూడండి",
        },
        common: {
            report: "నివేదిక",
            track: "ట్రాక్",
            resolve: "పరిష్కరించు",
            view_all: "అన్నీ చూడండి",
            upvote: "మద్దతు",
            comment: "వ్యాఖ్య",
            share: "పంచుకోండి",
            status: "స్థితి",
            category: "వర్గం",
            location: "ప్రదేశం",
            reported: "నివేదించబడింది",
        },
        status: {
            submitted: "సమర్పించబడింది",
            under_review: "సమీక్షలో",
            assigned: "కేటాయించబడింది",
            in_progress: "పురోగతిలో",
            resolved: "పరిష్కరించబడింది",
            rejected: "తిరస్కరించబడింది",
        },
    },
};

const LanguageContext = createContext({
    lang: "en",
    setLang: () => {},
    t: (key) => key,
});

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState("en");

    const t = (path) => {
        const parts = path.split(".");
        let cur = translations[lang] || translations.en;
        for (const p of parts) {
            cur = cur?.[p];
            if (cur === undefined) return path;
        }
        return cur;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLang = () => useContext(LanguageContext);
