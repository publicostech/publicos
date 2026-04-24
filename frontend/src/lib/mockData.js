// Mocked data for CivicTrack Portal

export const CATEGORIES = [
    { id: "roads", label: "Roads & Potholes", icon: "Construction", color: "#FF9933" },
    { id: "garbage", label: "Garbage Collection", icon: "Trash2", color: "#138808" },
    { id: "water", label: "Water Supply & Leakage", icon: "Droplets", color: "#3B82F6" },
    { id: "streetlight", label: "Street Lights", icon: "Lamp", color: "#F59E0B" },
    { id: "drainage", label: "Drainage Overflow", icon: "Waves", color: "#0EA5E9" },
    { id: "construction", label: "Illegal Construction", icon: "HardHat", color: "#EF4444" },
    { id: "corruption", label: "Corruption Complaint", icon: "ShieldAlert", color: "#991B1B" },
    { id: "traffic", label: "Traffic Issues", icon: "TrafficCone", color: "#F97316" },
    { id: "pollution", label: "Pollution", icon: "Factory", color: "#78716C" },
    { id: "health", label: "Public Health", icon: "HeartPulse", color: "#DC2626" },
    { id: "services", label: "Government Services", icon: "Landmark", color: "#0A192F" },
    { id: "infrastructure", label: "School / Hospital", icon: "School", color: "#8B5CF6" },
    { id: "safety", label: "Safety & Security", icon: "ShieldCheck", color: "#0F766E" },
];

export const STATUSES = [
    { id: "submitted", label: "Submitted" },
    { id: "under_review", label: "Under Review" },
    { id: "assigned", label: "Assigned" },
    { id: "in_progress", label: "In Progress" },
    { id: "resolved", label: "Resolved" },
    { id: "rejected", label: "Rejected" },
];

export const URGENCIES = [
    { id: "low", label: "Low" },
    { id: "medium", label: "Medium" },
    { id: "high", label: "High" },
    { id: "critical", label: "Critical" },
];

export const STATES = [
    "Maharashtra", "Karnataka", "Tamil Nadu", "Telangana", "Andhra Pradesh",
    "Kerala", "Delhi", "Uttar Pradesh", "Gujarat", "West Bengal",
    "Rajasthan", "Madhya Pradesh", "Bihar", "Punjab", "Haryana", "Odisha",
];

const imgPothole = "https://images.pexels.com/photos/6018646/pexels-photo-6018646.jpeg";
const imgPothole2 = "https://images.pexels.com/photos/11849379/pexels-photo-11849379.jpeg";
const imgGarbage = "https://images.unsplash.com/photo-1762805544399-7cdf748371e0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjY2NzF8MHwxfHNlYXJjaHwyfHxnYXJiYWdlJTIwc3RyZWV0JTIwaW5kaWFufGVufDB8fHx8MTc3NzAxMTY5NXww&ixlib=rb-4.1.0&q=85";
const imgWater = "https://images.pexels.com/photos/15206136/pexels-photo-15206136.jpeg";
const imgLight = "https://images.pexels.com/photos/9953451/pexels-photo-9953451.jpeg";

const avatar1 = "https://images.unsplash.com/photo-1560885673-34b9e5047b91?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHwyfHxpbmRpYW4lMjBwb3J0cmFpdCUyMHNtaWxpbmd8ZW58MHx8fHwxNzc3MDExNjk1fDA&ixlib=rb-4.1.0&q=85";
const avatar2 = "https://images.unsplash.com/photo-1511763508683-99dc7949e97f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NDh8MHwxfHNlYXJjaHw0fHxpbmRpYW4lMjBwb3J0cmFpdCUyMHNtaWxpbmd8ZW58MHx8fHwxNzc3MDExNjk1fDA&ixlib=rb-4.1.0&q=85";
const avatarOfficer = "https://images.pexels.com/photos/28945957/pexels-photo-28945957.jpeg";

export const CITY_HERO_IMAGES = {
    mumbai: "https://images.unsplash.com/photo-1769591364855-b01458cad4b8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NjZ8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjBjaXR5JTIwc2t5bGluZXxlbnwwfHx8fDE3NzcwMTE2OTV8MA&ixlib=rb-4.1.0&q=85",
    delhi: "https://images.pexels.com/photos/3581694/pexels-photo-3581694.jpeg",
    bangalore: "https://images.pexels.com/photos/11742414/pexels-photo-11742414.jpeg",
};

export const ISSUES = [
    {
        id: "CT-2401",
        title: "Massive pothole causing daily accidents on Hosur Road",
        description:
            "A 4-foot wide pothole has formed at the junction near Electronic City flyover. Two two-wheeler accidents reported this week. Urgent resurfacing needed before monsoon.",
        category: "roads",
        status: "in_progress",
        urgency: "high",
        photos: [imgPothole, imgPothole2],
        location: {
            address: "Hosur Road, Electronic City Phase 1",
            city: "Bengaluru",
            district: "Bengaluru Urban",
            state: "Karnataka",
            pincode: "560100",
            lat: 12.8456, lng: 77.6603,
        },
        reporter: { name: "Arjun Mehta", anonymous: false, avatar: avatar1, reputation: 842 },
        upvotes: 1247,
        comments: 89,
        shares: 214,
        postedAt: "2026-02-04T09:23:00Z",
        assignedDept: "BBMP Roads Division",
        timeline: [
            { at: "2026-02-04T09:23:00Z", label: "Submitted by citizen", actor: "Arjun Mehta" },
            { at: "2026-02-04T14:10:00Z", label: "Under review", actor: "Ward Officer" },
            { at: "2026-02-05T11:00:00Z", label: "Assigned to BBMP Roads", actor: "Mandal Officer" },
            { at: "2026-02-07T08:30:00Z", label: "Work started on site", actor: "Contractor" },
        ],
    },
    {
        id: "CT-2402",
        title: "Garbage uncollected for 8 days in Sector 14",
        description:
            "Garbage collection truck has not visited the lane behind community park for over a week. Stray dogs are tearing open bags, creating a health hazard.",
        category: "garbage",
        status: "assigned",
        urgency: "high",
        photos: [imgGarbage],
        location: {
            address: "Sector 14, Block C",
            city: "Gurugram",
            district: "Gurugram",
            state: "Haryana",
            pincode: "122001",
            lat: 28.4701, lng: 77.0266,
        },
        reporter: { name: "Priya Sharma", anonymous: false, avatar: avatar2, reputation: 512 },
        upvotes: 634,
        comments: 41,
        shares: 87,
        postedAt: "2026-02-06T17:40:00Z",
        assignedDept: "MCG Sanitation",
        timeline: [
            { at: "2026-02-06T17:40:00Z", label: "Submitted by citizen", actor: "Priya Sharma" },
            { at: "2026-02-07T10:20:00Z", label: "Assigned to MCG Sanitation", actor: "Ward Officer" },
        ],
    },
    {
        id: "CT-2403",
        title: "Water leakage wasting thousands of litres near Jubilee Hills",
        description:
            "A main pipeline has been leaking for 3 days near Road No. 36. Estimated 30,000+ litres of potable water wasted daily. HMWSSB crews acknowledged but no action yet.",
        category: "water",
        status: "under_review",
        urgency: "critical",
        photos: [imgWater],
        location: {
            address: "Road No. 36, Jubilee Hills",
            city: "Hyderabad",
            district: "Hyderabad",
            state: "Telangana",
            pincode: "500033",
            lat: 17.4286, lng: 78.4066,
        },
        reporter: { name: "Anonymous", anonymous: true, avatar: null, reputation: 0 },
        upvotes: 2104,
        comments: 156,
        shares: 432,
        postedAt: "2026-02-05T06:15:00Z",
        assignedDept: "HMWSSB",
        timeline: [
            { at: "2026-02-05T06:15:00Z", label: "Submitted anonymously", actor: "Citizen" },
            { at: "2026-02-06T12:00:00Z", label: "Under review", actor: "HMWSSB Officer" },
        ],
    },
    {
        id: "CT-2404",
        title: "Entire lane dark — 11 streetlights non-functional",
        description:
            "Every single streetlight on Anna Nagar 2nd Cross has been out for 2 weeks. Residents, especially women and children, feel unsafe after 7 PM.",
        category: "streetlight",
        status: "resolved",
        urgency: "medium",
        photos: [imgLight],
        location: {
            address: "Anna Nagar 2nd Cross",
            city: "Chennai",
            district: "Chennai",
            state: "Tamil Nadu",
            pincode: "600040",
            lat: 13.0878, lng: 80.2169,
        },
        reporter: { name: "Karthik Subramanian", anonymous: false, avatar: avatar1, reputation: 321 },
        upvotes: 489,
        comments: 28,
        shares: 55,
        postedAt: "2026-01-28T19:20:00Z",
        assignedDept: "GCC Electrical",
        resolvedAt: "2026-02-03T15:00:00Z",
        timeline: [
            { at: "2026-01-28T19:20:00Z", label: "Submitted by citizen", actor: "Karthik S." },
            { at: "2026-01-29T09:00:00Z", label: "Assigned", actor: "Ward Officer" },
            { at: "2026-02-02T14:00:00Z", label: "Work started", actor: "GCC Electrical" },
            { at: "2026-02-03T15:00:00Z", label: "Resolved — all 11 lights replaced", actor: "Officer" },
        ],
    },
    {
        id: "CT-2405",
        title: "Open drain overflow floods colony during rains",
        description:
            "Every time it rains for more than 20 minutes, sewage from the open drain floods into ground floor houses. This has been a recurring issue for 3 monsoons.",
        category: "drainage",
        status: "submitted",
        urgency: "critical",
        photos: [imgPothole2],
        location: {
            address: "Lokhandwala Complex",
            city: "Mumbai",
            district: "Mumbai Suburban",
            state: "Maharashtra",
            pincode: "400053",
            lat: 19.1396, lng: 72.8338,
        },
        reporter: { name: "Neha Iyer", anonymous: false, avatar: avatar2, reputation: 156 },
        upvotes: 823,
        comments: 67,
        shares: 141,
        postedAt: "2026-02-08T11:45:00Z",
        assignedDept: null,
        timeline: [
            { at: "2026-02-08T11:45:00Z", label: "Submitted by citizen", actor: "Neha Iyer" },
        ],
    },
    {
        id: "CT-2406",
        title: "Illegal 5-storey construction without permits",
        description:
            "A commercial structure is being built on a plot zoned as residential. Multiple complaints to BMC ignored. Builder claims 'approval coming soon'.",
        category: "construction",
        status: "under_review",
        urgency: "high",
        photos: [imgPothole],
        location: {
            address: "Plot 44, Andheri East",
            city: "Mumbai",
            district: "Mumbai Suburban",
            state: "Maharashtra",
            pincode: "400069",
            lat: 19.1197, lng: 72.8468,
        },
        reporter: { name: "Anonymous", anonymous: true, avatar: null, reputation: 0 },
        upvotes: 412,
        comments: 34,
        shares: 76,
        postedAt: "2026-02-02T13:00:00Z",
        assignedDept: "BMC Enforcement",
        timeline: [
            { at: "2026-02-02T13:00:00Z", label: "Submitted anonymously", actor: "Citizen" },
            { at: "2026-02-03T10:00:00Z", label: "Sent for field verification", actor: "Officer" },
        ],
    },
    {
        id: "CT-2407",
        title: "Signal timing broken — causing 40-minute jams",
        description:
            "Traffic signal at main intersection stuck on red-red-red on all approaches during peak hours. Manual traffic police needed but absent.",
        category: "traffic",
        status: "in_progress",
        urgency: "high",
        photos: [imgPothole2],
        location: {
            address: "Connaught Place Outer Circle",
            city: "New Delhi",
            district: "Central Delhi",
            state: "Delhi",
            pincode: "110001",
            lat: 28.6315, lng: 77.2167,
        },
        reporter: { name: "Rohit Kapoor", anonymous: false, avatar: avatar1, reputation: 1024 },
        upvotes: 1556,
        comments: 112,
        shares: 287,
        postedAt: "2026-02-07T08:00:00Z",
        assignedDept: "Delhi Traffic Police",
        timeline: [
            { at: "2026-02-07T08:00:00Z", label: "Submitted by citizen", actor: "Rohit Kapoor" },
            { at: "2026-02-07T09:30:00Z", label: "Assigned to traffic dept", actor: "Officer" },
            { at: "2026-02-07T16:00:00Z", label: "Technician dispatched", actor: "Dept" },
        ],
    },
    {
        id: "CT-2408",
        title: "Industrial pollution choking lake ecosystem",
        description:
            "Factory outlet discharging coloured effluent into Bellandur lake at night. Photos attached. Fish kills reported.",
        category: "pollution",
        status: "assigned",
        urgency: "critical",
        photos: [imgWater],
        location: {
            address: "Bellandur Lake, East Bank",
            city: "Bengaluru",
            district: "Bengaluru Urban",
            state: "Karnataka",
            pincode: "560103",
            lat: 12.9331, lng: 77.6761,
        },
        reporter: { name: "Environment Collective", anonymous: false, avatar: avatar2, reputation: 2341 },
        upvotes: 3402,
        comments: 231,
        shares: 891,
        postedAt: "2026-02-01T22:15:00Z",
        assignedDept: "KSPCB",
        timeline: [
            { at: "2026-02-01T22:15:00Z", label: "Submitted by citizen group", actor: "E.C." },
            { at: "2026-02-02T11:00:00Z", label: "Under review", actor: "KSPCB" },
            { at: "2026-02-03T09:00:00Z", label: "Assigned to enforcement", actor: "KSPCB" },
        ],
    },
    {
        id: "CT-2409",
        title: "Primary health centre missing essential medicines for weeks",
        description:
            "PHC Kalaburagi has been out of paracetamol, ORS and insulin for 3 weeks. Patients being turned away.",
        category: "health",
        status: "under_review",
        urgency: "critical",
        photos: [imgPothole],
        location: {
            address: "PHC Kalaburagi Block",
            city: "Kalaburagi",
            district: "Kalaburagi",
            state: "Karnataka",
            pincode: "585101",
            lat: 17.3297, lng: 76.8343,
        },
        reporter: { name: "Anonymous", anonymous: true, avatar: null, reputation: 0 },
        upvotes: 967,
        comments: 78,
        shares: 234,
        postedAt: "2026-02-03T14:30:00Z",
        assignedDept: "District Health Office",
        timeline: [
            { at: "2026-02-03T14:30:00Z", label: "Submitted anonymously", actor: "Citizen" },
            { at: "2026-02-04T10:00:00Z", label: "Under review", actor: "DHO" },
        ],
    },
    {
        id: "CT-2410",
        title: "Ration card office demanding bribes for verification",
        description:
            "Multiple citizens report that the verification officer demands ₹500 'expedite fee' to process applications. Receipts never given.",
        category: "corruption",
        status: "under_review",
        urgency: "high",
        photos: [imgLight],
        location: {
            address: "Taluk Office, Ernakulam",
            city: "Kochi",
            district: "Ernakulam",
            state: "Kerala",
            pincode: "682011",
            lat: 9.9816, lng: 76.2999,
        },
        reporter: { name: "Anonymous", anonymous: true, avatar: null, reputation: 0 },
        upvotes: 1893,
        comments: 245,
        shares: 578,
        postedAt: "2026-02-06T10:00:00Z",
        assignedDept: "Vigilance Wing",
        timeline: [
            { at: "2026-02-06T10:00:00Z", label: "Submitted anonymously", actor: "Citizen" },
            { at: "2026-02-07T09:00:00Z", label: "Forwarded to Vigilance", actor: "SDM" },
        ],
    },
    {
        id: "CT-2411",
        title: "Government school roof collapsed partially — 200 students at risk",
        description:
            "The eastern wing roof of Zilla Parishad School has caved in. Classes moved outdoors. Monsoon due in 3 months.",
        category: "infrastructure",
        status: "assigned",
        urgency: "critical",
        photos: [imgPothole2],
        location: {
            address: "ZP School, Wardha",
            city: "Wardha",
            district: "Wardha",
            state: "Maharashtra",
            pincode: "442001",
            lat: 20.7453, lng: 78.6022,
        },
        reporter: { name: "Parents Association", anonymous: false, avatar: avatar1, reputation: 675 },
        upvotes: 2187,
        comments: 198,
        shares: 654,
        postedAt: "2026-02-04T08:00:00Z",
        assignedDept: "ZP Education Dept",
        timeline: [
            { at: "2026-02-04T08:00:00Z", label: "Submitted", actor: "PA" },
            { at: "2026-02-05T14:00:00Z", label: "Assigned", actor: "Collector Office" },
        ],
    },
    {
        id: "CT-2412",
        title: "Streetlight out for 3 months — women harassment incidents",
        description:
            "Stretch between bus stop and colony gate is pitch dark at night. Two eve-teasing incidents reported this month.",
        category: "safety",
        status: "in_progress",
        urgency: "critical",
        photos: [imgLight],
        location: {
            address: "DLF Phase 3",
            city: "Gurugram",
            district: "Gurugram",
            state: "Haryana",
            pincode: "122002",
            lat: 28.4929, lng: 77.0864,
        },
        reporter: { name: "Neighbourhood Watch", anonymous: false, avatar: avatar2, reputation: 1450 },
        upvotes: 2956,
        comments: 312,
        shares: 876,
        postedAt: "2026-02-01T20:00:00Z",
        assignedDept: "MCG + Police",
        timeline: [
            { at: "2026-02-01T20:00:00Z", label: "Submitted", actor: "NW" },
            { at: "2026-02-02T09:00:00Z", label: "Assigned", actor: "Ward Officer" },
            { at: "2026-02-04T15:00:00Z", label: "Police patrol increased", actor: "SHO" },
            { at: "2026-02-06T10:00:00Z", label: "Streetlight repair in progress", actor: "MCG" },
        ],
    },
];

export const PLATFORM_STATS = {
    total_reports: 247893,
    resolved: 168421,
    in_progress: 42107,
    pending: 37365,
    cities: 284,
    districts: 612,
    avg_resolution_days: 9.4,
    states_active: 28,
    citizens: 1840927,
    officials: 12480,
};

export const STATE_LEADERBOARD = [
    { state: "Kerala", score: 92, resolved: 18420, pending: 1680, avg_days: 5.2 },
    { state: "Telangana", score: 88, resolved: 22103, pending: 2980, avg_days: 6.1 },
    { state: "Karnataka", score: 85, resolved: 31245, pending: 5502, avg_days: 6.8 },
    { state: "Tamil Nadu", score: 83, resolved: 28910, pending: 5831, avg_days: 7.3 },
    { state: "Maharashtra", score: 79, resolved: 35012, pending: 9245, avg_days: 8.9 },
    { state: "Gujarat", score: 77, resolved: 19804, pending: 5912, avg_days: 9.4 },
    { state: "Delhi", score: 74, resolved: 12098, pending: 4213, avg_days: 9.8 },
    { state: "Punjab", score: 71, resolved: 9820, pending: 3914, avg_days: 10.5 },
    { state: "Rajasthan", score: 68, resolved: 14302, pending: 6701, avg_days: 11.2 },
    { state: "West Bengal", score: 66, resolved: 16412, pending: 8403, avg_days: 11.8 },
    { state: "Uttar Pradesh", score: 59, resolved: 21306, pending: 14512, avg_days: 14.1 },
    { state: "Bihar", score: 54, resolved: 11204, pending: 9512, avg_days: 15.6 },
];

export const MONTHLY_TRENDS = [
    { month: "Sep", reported: 18420, resolved: 14102 },
    { month: "Oct", reported: 21340, resolved: 17200 },
    { month: "Nov", reported: 19820, resolved: 16540 },
    { month: "Dec", reported: 22140, resolved: 18020 },
    { month: "Jan", reported: 24810, resolved: 20912 },
    { month: "Feb", reported: 15210, resolved: 12403 },
];

export const CATEGORY_BREAKDOWN = [
    { name: "Roads", value: 62340, color: "#FF9933" },
    { name: "Garbage", value: 48102, color: "#138808" },
    { name: "Water", value: 41220, color: "#3B82F6" },
    { name: "Streetlights", value: 28410, color: "#F59E0B" },
    { name: "Drainage", value: 19840, color: "#0EA5E9" },
    { name: "Others", value: 47981, color: "#64748B" },
];

export const DEPARTMENT_EFFICIENCY = [
    { dept: "Sanitation", sla: 94, resolved: 48102, avg_days: 3.8 },
    { dept: "Roads & PWD", sla: 72, resolved: 62340, avg_days: 11.2 },
    { dept: "Water Board", sla: 81, resolved: 41220, avg_days: 7.4 },
    { dept: "Electrical", sla: 88, resolved: 28410, avg_days: 5.2 },
    { dept: "Police", sla: 76, resolved: 14210, avg_days: 9.1 },
    { dept: "Health", sla: 69, resolved: 12908, avg_days: 12.4 },
];

export const TOP_CONTRIBUTORS = [
    { name: "Arjun Mehta", city: "Bengaluru", reports: 142, resolved: 118, points: 4860, avatar: avatar1 },
    { name: "Priya Sharma", city: "Gurugram", reports: 128, resolved: 102, points: 4120, avatar: avatar2 },
    { name: "Environment Collective", city: "Bengaluru", reports: 98, resolved: 81, points: 3890, avatar: avatar2 },
    { name: "Rohit Kapoor", city: "New Delhi", reports: 87, resolved: 72, points: 3410, avatar: avatar1 },
    { name: "Neighbourhood Watch", city: "Gurugram", reports: 81, resolved: 67, points: 3200, avatar: avatar2 },
];

export const LIVE_TICKER = [
    "Pothole fixed on MG Road, Bengaluru — 2 min ago",
    "Water leakage resolved in Sector 17, Chandigarh — 8 min ago",
    "New garbage complaint filed in Andheri, Mumbai — 12 min ago",
    "Streetlight restored on JNU Campus — 14 min ago",
    "Drainage cleaned in Salt Lake, Kolkata — 19 min ago",
    "Traffic signal fixed at HITEC City — 23 min ago",
    "Illegal construction halted in Indiranagar — 27 min ago",
    "Public hospital stocked with medicines in Warangal — 31 min ago",
];

// State centroids on a 1000x1000 canvas for stylized India SVG (legacy)
// Also includes real lat/lng for Leaflet map
export const STATE_MARKERS = [
    { state: "Jammu & Kashmir", x: 330, y: 90, lat: 34.0, lng: 76.5, issues: 842, resolved: 412 },
    { state: "Punjab", x: 310, y: 180, lat: 31.1, lng: 75.3, issues: 3914, resolved: 2810 },
    { state: "Haryana", x: 360, y: 210, lat: 29.0, lng: 76.5, issues: 4213, resolved: 3109 },
    { state: "Delhi", x: 375, y: 230, lat: 28.6139, lng: 77.2090, issues: 4213, resolved: 3098 },
    { state: "Rajasthan", x: 270, y: 290, lat: 27.0, lng: 74.2, issues: 6701, resolved: 4302 },
    { state: "Gujarat", x: 200, y: 370, lat: 22.7, lng: 71.6, issues: 5912, resolved: 4104 },
    { state: "Uttar Pradesh", x: 440, y: 260, lat: 27.0, lng: 80.9, issues: 14512, resolved: 9306 },
    { state: "Bihar", x: 570, y: 280, lat: 25.5, lng: 85.4, issues: 9512, resolved: 5204 },
    { state: "West Bengal", x: 640, y: 340, lat: 22.9, lng: 87.8, issues: 8403, resolved: 5412 },
    { state: "Odisha", x: 560, y: 420, lat: 20.5, lng: 85.1, issues: 4102, resolved: 2890 },
    { state: "Madhya Pradesh", x: 370, y: 370, lat: 23.5, lng: 78.5, issues: 7104, resolved: 4802 },
    { state: "Maharashtra", x: 300, y: 480, lat: 19.7, lng: 75.7, issues: 9245, resolved: 6801 },
    { state: "Telangana", x: 410, y: 550, lat: 18.1, lng: 79.0, issues: 2980, resolved: 2103 },
    { state: "Andhra Pradesh", x: 440, y: 620, lat: 15.9, lng: 79.7, issues: 3502, resolved: 2712 },
    { state: "Karnataka", x: 340, y: 620, lat: 15.3, lng: 75.7, issues: 5502, resolved: 4245 },
    { state: "Tamil Nadu", x: 410, y: 740, lat: 11.1, lng: 78.6, issues: 5831, resolved: 4810 },
    { state: "Kerala", x: 340, y: 780, lat: 10.8, lng: 76.3, issues: 1680, resolved: 1420 },
    { state: "Assam", x: 740, y: 260, lat: 26.2, lng: 92.9, issues: 2340, resolved: 1410 },
];

// Simplified/stylized India outline path on 1000x1000 viewBox
export const INDIA_PATH =
    "M300,60 L340,70 L370,100 L360,140 L330,160 L310,190 L340,210 L390,210 L430,240 L470,230 L520,210 L560,220 L600,250 L650,240 L700,230 L740,250 L790,270 L780,310 L740,330 L700,310 L660,330 L620,330 L600,360 L640,370 L640,410 L600,440 L560,430 L540,460 L520,500 L480,530 L460,580 L440,620 L420,680 L400,740 L390,790 L370,810 L340,790 L320,760 L300,720 L290,670 L270,620 L250,560 L230,500 L210,460 L200,420 L190,380 L180,340 L170,300 L190,260 L220,230 L240,200 L260,170 L270,130 L290,90 Z";

export const COMMENTS = [
    { user: "Divya R.", text: "I pass here every day and nearly slipped yesterday. Please escalate!", at: "2h ago", upvotes: 24 },
    { user: "Official — BBMP", text: "Inspection team dispatched. Will share update by EOD.", at: "5h ago", upvotes: 112, official: true },
    { user: "Vikram S.", text: "Third time reporting this spot. How is this still not fixed?", at: "1d ago", upvotes: 47 },
];

export const MODERATION_QUEUE = [
    { id: "M-1", type: "Spam", reports: 14, issue: "Advertisement post disguised as complaint", severity: "Medium" },
    { id: "M-2", type: "Duplicate", reports: 8, issue: "Same pothole reported 5 times in 2 hours", severity: "Low" },
    { id: "M-3", type: "Abuse", reports: 23, issue: "Personal attack on named official", severity: "High" },
    { id: "M-4", type: "Fake Photo", reports: 6, issue: "Stock photo uploaded as evidence", severity: "Medium" },
];
