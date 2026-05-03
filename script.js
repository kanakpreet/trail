import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, onSnapshot, getDocs, addDoc, doc, setDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBn4k9T1Ce0yli7YvieBP5a9ZpjuaYGp0M",
  authDomain: "tourism-app-c4fed.firebaseapp.com",
  projectId: "tourism-app-c4fed",
  storageBucket: "tourism-app-c4fed.firebasestorage.app",
  messagingSenderId: "168320142217",
  appId: "1:168320142217:web:ca469d2eef4ec196476f58",
  measurementId: "G-2NGLHY44XD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/* ═══════════════════════════════════════
   Localization Dictionary
   ═══════════════════════════════════════ */
const i18n = {
    en: {
        navExplore: "Explore",
        navSignIn: "Sign In",
        navSignOut: "Sign Out",
        heroTitlePre: "Explore",
        heroTitleSpan: "Uttarakhand",
        heroSub: "The land of gods, mountains, and timeless beauty.",
        modalSub: "Welcome back to Travelora.",
        modalTitleSign: "Sign In",
        modalTitleCreate: "Create Account",
        modalCreateSub: "Join Travelora to start planning your trip.",
        labelDarkMode: "Dark Mode",
        labelLanguage: "Language",
        filterShopping: "Shopping",
        filterFood: "Food",
        filterSpots: "Tourist Spots",
        filterTemples: "Temples & Monasteries",
        emptyMsg: "No places match — tick a category above.",
        cardCrowd: "Crowd",
        crowdLow: "Low", crowdMod: "Moderate", crowdHigh: "High",
        cardDir: "Get Directions",
        chatbotName: "Travelora AI",
        chatbotGreeting: "Namaste! Ask me about any place in Uttarakhand.",
        chatPlaceholder: "Ask something…",
        footerText: "© 2026 Travelora · Made for Uttarakhand Tourism"
    },
    hi: {
        navExplore: "खोजें",
        navSignIn: "साइन इन",
        navSignOut: "लॉग आउट",
        heroTitlePre: "खोजें",
        heroTitleSpan: "उत्तराखंड",
        heroSub: "देवताओं, पहाड़ों और शाश्वत सुंदरता की भूमि।",
        modalSub: "ट्रेवलोरा में वापसी पर स्वागत है।",
        modalTitleSign: "साइन इन करें",
        modalTitleCreate: "खाता बनाएं",
        modalCreateSub: "अपनी यात्रा की योजना बनाने के लिए ट्रेवलोरा से जुड़ें।",
        labelDarkMode: "डार्क मोड",
        labelLanguage: "भाषा",
        filterShopping: "खरीदारी",
        filterFood: "भोजन",
        filterSpots: "पर्यटक स्थल",
        filterTemples: "मंदिर और मठ",
        emptyMsg: "कोई भी स्थान मेल नहीं खाता — ऊपर एक श्रेणी चुनें।",
        cardCrowd: "भीड़",
        crowdLow: "कम", crowdMod: "मध्यम", crowdHigh: "ज्यादा",
        cardDir: "दिशानिर्देश प्राप्त करें",
        chatbotName: "ट्रेवलोरा एआई",
        chatbotGreeting: "नमस्ते! मुझसे उत्तराखंड के किसी भी स्थान के बारे में पूछें।",
        chatPlaceholder: "कुछ पूछें…",
        footerText: "© 2026 ट्रेवलोरा · उत्तराखंड पर्यटन के लिए निर्मित"
    },
    bn: {
        navExplore: "অন্বেষণ করুন",
        navSignIn: "সাইন ইন",
        navSignOut: "সাইন আউট",
        heroTitlePre: "অন্বেষণ করুন",
        heroTitleSpan: "উত্তরাখণ্ড",
        heroSub: "দেবতা, পর্বত এবং কালজয়ী সৌন্দর্যের দেশ।",
        modalSub: "ট্রাভেলোরায় আপনাকে আবার স্বাগত।",
        modalTitleSign: "সাইন ইন করুন",
        modalTitleCreate: "অ্যাকাউন্ট তৈরি করুন",
        modalCreateSub: "আপনার ভ্রমণের পরিকল্পনা করতে ট্রাভেলোরায় যোগ দিন।",
        labelDarkMode: "ডার্ক মোড",
        labelLanguage: "ভাষা",
        filterShopping: "কেনাকাটা",
        filterFood: "খাবার",
        filterSpots: "পর্যটন কেন্দ্র",
        filterTemples: "মন্দির ও মঠ",
        emptyMsg: "কোনো স্থান মেলেনি — উপরে একটি বিভাগ নির্বাচন করুন।",
        cardCrowd: "ভিড়",
        crowdLow: "কম", crowdMod: "মাঝারি", crowdHigh: "বেশি",
        cardDir: "দিকনির্দেশ পান",
        chatbotName: "ট্রাভেলোরা এআই",
        chatbotGreeting: "নমস্তে! আমাকে উত্তরাখণ্ডের যেকোনো স্থান সম্পর্কে জিজ্ঞাসা করুন।",
        chatPlaceholder: "কিছু জিজ্ঞাসা করুন…",
        footerText: "© ২০২৬ ট্রাভেলোরা · উত্তরাখণ্ড পর্যটনের জন্য তৈরি"
    },
    pa: {
        navExplore: "ਖੋਜੋ",
        navSignIn: "ਸਾਈਨ ਇਨ",
        navSignOut: "ਸਾਈਨ ਆਉਟ",
        heroTitlePre: "ਖੋਜੋ",
        heroTitleSpan: "ਉੱਤਰਾਖੰਡ",
        heroSub: "ਦੇਵਤਿਆਂ, ਪਹਾੜਾਂ ਅਤੇ ਸਦੀਵੀ ਸੁੰਦਰਤਾ ਦੀ ਧਰਤੀ।",
        modalSub: "ਟ੍ਰੈਵਲੋਰਾ ਵਿੱਚ ਵਾਪਸੀ 'ਤੇ ਸਵਾਗਤ ਹੈ।",
        modalTitleSign: "ਸਾਈਨ ਇਨ ਕਰੋ",
        modalTitleCreate: "ਖਾਤਾ ਬਣਾਓ",
        modalCreateSub: "ਆਪਣੀ ਯਾਤਰਾ ਦੀ ਯੋਜਨਾ ਬਣਾਉਣ ਲਈ ਟ੍ਰੈਵਲੋਰਾ ਵਿੱਚ ਸ਼ਾਮਲ ਹੋਵੋ।",
        labelDarkMode: "ਡਾਰਕ ਮੋਡ",
        labelLanguage: "ਭਾਸ਼ਾ",
        filterShopping: "ਖਰੀਦਦਾਰੀ",
        filterFood: "ਭੋਜਨ",
        filterSpots: "ਸੈਰ-ਸਪਾਟਾ ਸਥਾਨ",
        filterTemples: "ਮੰਦਰ ਅਤੇ ਮੱਠ",
        emptyMsg: "ਕੋਈ ਸਥਾਨ ਮੇਲ ਨਹੀਂ ਖਾਂਦਾ — ਉੱਪਰ ਇੱਕ ਸ਼੍ਰੇਣੀ ਚੁਣੋ।",
        cardCrowd: "ਭੀੜ",
        crowdLow: "ਘੱਟ", crowdMod: "ਮੱਧਮ", crowdHigh: "ਜ਼ਿਆਦਾ",
        cardDir: "ਦਿਸ਼ਾ ਨਿਰਦੇਸ਼ ਪ੍ਰਾਪਤ ਕਰੋ",
        chatbotName: "ਟ੍ਰੈਵਲੋਰਾ ਏ.ਆਈ",
        chatbotGreeting: "ਨਮਸਤੇ! ਮੈਨੂੰ ਉੱਤਰਾਖੰਡ ਦੀ ਕਿਸੇ ਵੀ ਜਗ੍ਹਾ ਬਾਰੇ ਪੁੱਛੋ।",
        chatPlaceholder: "ਕੁਝ ਪੁੱਛੋ…",
        footerText: "© 2026 ਟ੍ਰੈਵਲੋਰਾ · ਉੱਤਰਾਖੰਡ ਟੂਰਿਜ਼ਮ ਲਈ ਬਣਾਇਆ ਗਿਆ"
    },
    ta: {
        navExplore: "ஆராயுங்கள்",
        navSignIn: "உள்நுழைக",
        navSignOut: "வெளியேறு",
        heroTitlePre: "ஆராயுங்கள்",
        heroTitleSpan: "உத்தரகாண்ட்",
        heroSub: "கடவுள்கள், மலைகள் மற்றும் காலமற்ற அழகின் பூமி.",
        modalSub: "ட்ராவலோராவுக்கு மீண்டும் வரவேற்கிறோம்.",
        modalTitleSign: "உள்நுழைக",
        modalTitleCreate: "கணக்கை உருவாக்கு",
        modalCreateSub: "உங்கள் பயணத்தை திட்டமிட ட்ராவலோராவில் சேரவும்.",
        labelDarkMode: "டார்க் மோட்",
        labelLanguage: "மொழி",
        filterShopping: "ஷாப்பிங்",
        filterFood: "உணவு",
        filterSpots: "சுற்றுலா இடங்கள்",
        filterTemples: "கோயில்கள் மற்றும் மடங்கள்",
        emptyMsg: "எந்த இடமும் பொருந்தவில்லை — மேலே ஒரு வகையைத் தேர்ந்தெடுக்கவும்.",
        cardCrowd: "கூட்டம்",
        crowdLow: "குறைவு", crowdMod: "மிதமான", crowdHigh: "அதிகம்",
        cardDir: "வழிகளைக் கண்டறிக",
        chatbotName: "ட்ராவலோரா ஏஐ",
        chatbotGreeting: "நமஸ்தே! உத்தரகண்டில் உள்ள எந்த இடத்தை பற்றியும் என்னிடம் கேளுங்கள்.",
        chatPlaceholder: "ஏதாவது கேளுங்கள்…",
        footerText: "© 2026 ட்ராவலோரா · உத்தரகாண்ட் சுற்றுலாவுக்காக உருவாக்கப்பட்டது"
    },
    te: {
        navExplore: "అన్వేషించండి",
        navSignIn: "సైన్ ఇన్",
        navSignOut: "సైన్ అవుట్",
        heroTitlePre: "అన్వేషించండి",
        heroTitleSpan: "ఉత్తరాఖండ్",
        heroSub: "దేవతలు, పర్వతాలు మరియు శాశ్వతమైన అందం యొక్క భూమి.",
        modalSub: "ట్రావెలోరాకు తిరిగి స్వాగతం.",
        modalTitleSign: "సైన్ ఇన్ చేయండి",
        modalTitleCreate: "ఖాతాను సృష్టించండి",
        modalCreateSub: "మీ యాత్రను ప్లాన్ చేయడానికి ట్రావెలోరాలో చేరండి.",
        labelDarkMode: "డార్క్ మోడ్",
        labelLanguage: "భాష",
        filterShopping: "షాపింగ్",
        filterFood: "ఆహారం",
        filterSpots: "పర్యాటక ప్రదేశాలు",
        filterTemples: "దేవాలయాలు మరియు ఆరామాలు",
        emptyMsg: "ఏ ప్రదేశాలు సరిపోలలేదు — పైన ఒక వర్గాన్ని ఎంచుకోండి.",
        cardCrowd: "రద్దీ",
        crowdLow: "తక్కువ", crowdMod: "మధ్యస్థం", crowdHigh: "ఎక్కువ",
        cardDir: "దిశలను పొందండి",
        chatbotName: "ట్రావెలోరా AI",
        chatbotGreeting: "నమస్తే! ఉత్తరాఖండ్‌లోని ఏ ప్రదేశం గురించి అయినా నన్ను అడగండి.",
        chatPlaceholder: "ఏదైనా అడగండి…",
        footerText: "© 2026 ట్రావెలోరా · ఉత్తరాఖండ్ పర్యాటకం కోసం రూపొందించబడింది"
    }
};

let savedLang = localStorage.getItem('lang') || 'en';

/* ═══════════════════════════════════════
   Uttarakhand Places Data (Fallback / Seed)
   (with local guide contacts & simulated crowd levels)
   ═══════════════════════════════════════ */
const places = [
    // ── Shopping ──
    { title: "Paltan Bazaar, Dehradun",        cat: "shopping", desc: "Bustling market street for woollen shawls, basmati rice and local handicrafts.",        rating: 4.3, lat: 30.3255, lng: 78.0413, icon: "fa-bag-shopping",  guide: "Rajesh Negi",      guidePhone: "+91 94100 23456" },
    { title: "Mall Road, Mussoorie",            cat: "shopping", desc: "Hill-station promenade lined with souvenir shops, cafés and woollen goods.",            rating: 4.4, lat: 30.4548, lng: 78.0756, icon: "fa-store",         guide: "Sunita Rawat",     guidePhone: "+91 98370 12345" },
    { title: "Tibetan Market, Dehradun",        cat: "shopping", desc: "Pocket-friendly spot for jackets, bags and Tibetan artefacts.",                        rating: 4.2, lat: 30.3165, lng: 78.0322, icon: "fa-bag-shopping",  guide: "Tenzin Dorje",     guidePhone: "+91 87910 56789" },

    // ── Food ──
    { title: "Orchard, Mussoorie",              cat: "food", desc: "Iconic restaurant serving Garhwali thali, maggi and pahadi chai with valley views.",       rating: 4.6, lat: 30.4598, lng: 78.0649, icon: "fa-utensils",      guide: "Deepak Bisht",     guidePhone: "+91 97195 34567" },
    { title: "Café Ivy, Rishikesh",             cat: "food", desc: "Cozy riverside café known for Israeli and Italian food among backpackers.",                rating: 4.5, lat: 30.1086, lng: 78.2960, icon: "fa-mug-hot",       guide: "Priya Sharma",     guidePhone: "+91 94560 78901" },
    { title: "Chotiwala, Rishikesh",            cat: "food", desc: "Legendary vegetarian restaurant on the ghats — a Rishikesh landmark since 1958.",         rating: 4.4, lat: 30.1095, lng: 78.2935, icon: "fa-utensils",      guide: "Anil Pant",        guidePhone: "+91 98970 45612" },

    // ── Tourist Spots ──
    { title: "Valley of Flowers, Chamoli",      cat: "spots", desc: "UNESCO World Heritage site with 600+ species of wildflowers in a high-altitude valley.", rating: 4.9, lat: 30.7280, lng: 79.6050, icon: "fa-mountain-sun",  guide: "Mohan Bhatt",      guidePhone: "+91 94120 67890" },
    { title: "Nainital Lake",                   cat: "spots", desc: "Crescent-shaped freshwater lake surrounded by hills — heart of the Lake District.",       rating: 4.7, lat: 29.3919, lng: 79.4542, icon: "fa-water",         guide: "Kavita Joshi",     guidePhone: "+91 98080 23456" },
    { title: "Auli Ski Resort",                 cat: "spots", desc: "India's premier ski destination with panoramic views of Nanda Devi.",                     rating: 4.8, lat: 30.5269, lng: 79.5670, icon: "fa-person-skiing",  guide: "Vikram Singh",     guidePhone: "+91 97580 11223" },
    { title: "Rishikesh River Rafting",         cat: "spots", desc: "White-water rafting on the Ganges — Grade III & IV rapids with stunning gorge scenery.",  rating: 4.7, lat: 30.0869, lng: 78.2676, icon: "fa-water",         guide: "Sanjay Rana",      guidePhone: "+91 88260 99887" },

    // ── Temples & Monasteries ──
    { title: "Kedarnath Temple",                cat: "temples", desc: "One of the twelve Jyotirlingas, set at 3,583 m amidst snow-capped peaks.",              rating: 4.9, lat: 30.7352, lng: 79.0669, icon: "fa-om",            guide: "Pandit Ramesh",    guidePhone: "+91 94110 55667" },
    { title: "Badrinath Temple",                cat: "temples", desc: "Sacred Char Dham shrine dedicated to Lord Vishnu on the banks of Alaknanda.",           rating: 4.9, lat: 30.7433, lng: 79.4938, icon: "fa-om",            guide: "Govind Joshi",     guidePhone: "+91 98370 44556" },
    { title: "Mindrolling Monastery, Dehradun", cat: "temples", desc: "One of the largest Buddhist centres in India with a 60-m Great Stupa.",                 rating: 4.7, lat: 30.2863, lng: 78.0772, icon: "fa-vihara",        guide: "Lama Tsering",     guidePhone: "+91 87560 33221" },
    { title: "Har Ki Pauri, Haridwar",          cat: "temples", desc: "Ancient bathing ghat on the Ganges famous for the spectacular evening Ganga Aarti.",    rating: 4.8, lat: 29.9557, lng: 78.1690, icon: "fa-om",            guide: "Suresh Tiwari",    guidePhone: "+91 94570 77889" },

    // ── Shopping (additional) ──
    { title: "Bara Bazaar, Almora",             cat: "shopping", desc: "Century-old horseshoe-shaped market famous for copper utensils, Angora wool and Almora sweets.", rating: 4.3, lat: 29.5971, lng: 79.6591, icon: "fa-bag-shopping",  guide: "Harish Pandey",    guidePhone: "+91 94120 88321" },
    { title: "Nainital Mall Road",              cat: "shopping", desc: "Bustling lakeside stretch with candle shops, woollen boutiques and handmade jewellery stalls.", rating: 4.5, lat: 29.3803, lng: 79.4636, icon: "fa-store",         guide: "Meera Arya",       guidePhone: "+91 98370 55214" },
    { title: "Gandhi Chowk, Mussoorie",         cat: "shopping", desc: "Lively square with branded stores, local handicraft shops and street food vendors.",           rating: 4.2, lat: 30.4591, lng: 78.0686, icon: "fa-bag-shopping",  guide: "Pooja Semwal",     guidePhone: "+91 87560 41298" },
    { title: "Jhula Market, Haridwar",          cat: "shopping", desc: "Traditional market near Laxmi Jhula selling puja items, rudraksha beads and Ayurvedic herbs.", rating: 4.1, lat: 30.1212, lng: 78.3150, icon: "fa-store",         guide: "Ashok Nautiyal",   guidePhone: "+91 94100 62789" },

    // ── Food (additional) ──
    { title: "Sakley's, Landour",               cat: "food", desc: "Heritage bakehouse in Landour serving legendary plum cakes, pies and hot chocolate since 1930.",      rating: 4.7, lat: 30.4656, lng: 78.0816, icon: "fa-cake-candles",  guide: "Ritu Kapoor",      guidePhone: "+91 97190 23415" },
    { title: "Chandni Chowk, Haridwar",         cat: "food", desc: "Famous street-food lane for kachoris, chaat, jalebis and rabri — a vegetarian paradise.",             rating: 4.4, lat: 29.9485, lng: 78.1697, icon: "fa-utensils",      guide: "Manoj Gairola",    guidePhone: "+91 88267 34521" },
    { title: "Little Buddha Café, Rishikesh",   cat: "food", desc: "Rooftop café overlooking the Ganges with smoothie bowls, falafel wraps and live acoustic music.",    rating: 4.5, lat: 30.1120, lng: 78.3145, icon: "fa-mug-hot",       guide: "Neha Chauhan",     guidePhone: "+91 94560 12344" },
    { title: "Sonam Momos, Dehradun",           cat: "food", desc: "Iconic roadside stall serving steaming Tibetan momos with fiery red chutney since the 1980s.",       rating: 4.3, lat: 30.3197, lng: 78.0399, icon: "fa-utensils",      guide: "Tashi Lhamo",      guidePhone: "+91 87910 78560" },

    // ── Tourist Spots (additional) ──
    { title: "Chopta–Tungnath Trek",            cat: "spots", desc: "Mini Switzerland trek leading to the world's highest Shiva temple at 3,680 m.",                     rating: 4.8, lat: 30.4892, lng: 79.2178, icon: "fa-mountain-sun",  guide: "Bhupesh Rawat",    guidePhone: "+91 97580 44321" },
    { title: "Jim Corbett National Park",       cat: "spots", desc: "India's oldest national park — home to Bengal tigers, elephants and 600+ bird species.",             rating: 4.7, lat: 29.5300, lng: 78.7747, icon: "fa-paw",           guide: "Dinesh Bisht",     guidePhone: "+91 94120 99876" },
    { title: "Kempty Falls, Mussoorie",         cat: "spots", desc: "Spectacular 40-ft waterfall nestled in the hills — a popular picnic spot since the British era.",    rating: 4.4, lat: 30.4925, lng: 78.0264, icon: "fa-water",         guide: "Naveen Gusain",    guidePhone: "+91 98080 71234" },
    { title: "Roopkund Trek, Chamoli",          cat: "spots", desc: "Mysterious skeletal lake at 5,029 m surrounded by snow peaks — one of India's most thrilling treks.", rating: 4.9, lat: 30.2622, lng: 79.7314, icon: "fa-mountain-sun",  guide: "Ratan Singh",      guidePhone: "+91 88260 55678" },

    // ── Temples & Monasteries (additional) ──
    { title: "Tungnath Temple, Rudraprayag",    cat: "temples", desc: "Highest Panch Kedar shrine at 3,680 m — a 1,000-year-old temple amidst alpine meadows.",          rating: 4.8, lat: 30.4897, lng: 79.2183, icon: "fa-om",            guide: "Mahesh Juyal",     guidePhone: "+91 94110 23345" },
    { title: "Jageshwar Dham, Almora",          cat: "temples", desc: "Cluster of 124 ancient stone temples in a dense deodar forest — an archaeological gem.",           rating: 4.6, lat: 29.6377, lng: 79.8519, icon: "fa-om",            guide: "Prabhat Tewari",   guidePhone: "+91 98370 88990" },
    { title: "Naina Devi Temple, Nainital",     cat: "temples", desc: "Sacred Shakti Peetha on the northern shore of Nainital Lake with stunning lake views.",            rating: 4.5, lat: 29.3947, lng: 79.4556, icon: "fa-om",            guide: "Kamla Joshi",      guidePhone: "+91 87560 11234" },
];

let placesData = []; // Will be populated from Firestore

/* ═══════════════════════════════════════
   Simulated Crowd Tracker
   ═══════════════════════════════════════ */
function predictCrowdLevel(place) {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const month = now.getMonth();
    const hash = place.title.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    let score = 30;
    // Time-of-day
    if (hour >= 10 && hour <= 16) score += 20;
    else if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) score += 10;
    else score -= 5;
    // Weekend
    if (day === 0 || day === 6) score += 15;
    // Season
    if (month >= 4 && month <= 5) score += 18;
    if (month >= 8 && month <= 9) score += 12;
    if (month === 11 || month === 0 || month === 1) score -= 8;
    // Category patterns
    if (place.cat === 'temples') { if (month >= 4 && month <= 9) score += 10; if (day === 0) score += 8; }
    if (place.cat === 'spots') { if (month >= 4 && month <= 6) score += 12; }
    if (place.cat === 'food') { if (hour >= 12 && hour <= 14) score += 15; if (hour >= 19 && hour <= 21) score += 12; }
    if (place.cat === 'shopping') { if (hour >= 11 && hour <= 18) score += 8; if (day === 0 || day === 6) score += 10; }
    // Rating-based popularity
    score += Math.round((place.rating - 4.0) * 10);
    // Per-place deterministic jitter
    score += (hash % 13) - 6;
    score = Math.max(5, Math.min(95, score));
    let label, color;
    if (score < 35) { label = "Low"; color = "#16a34a"; }
    else if (score < 65) { label = "Moderate"; color = "#f59e0b"; }
    else { label = "High"; color = "#ef4444"; }
    return { label, color, percent: score };
}

/* ═══════════════════════════════════════
   Helper for Images
   ═══════════════════════════════════════ */
function getImageForCategory(cat, title) {
    const t = title.toLowerCase();
    if (t.includes('auli') || t.includes('roopkund') || t.includes('ski')) return 'images/auli.png';
    if (t.includes('corbett') || t.includes('safari')) return 'images/safari.png';
    if (cat === 'temples') return 'images/temple.png';
    if (cat === 'spots') return 'images/hero.png';
    // Fallbacks
    if (cat === 'shopping') return 'images/hero.png';
    if (cat === 'food') return 'images/auli.png';
    return 'images/hero.png';
}

/* ═══════════════════════════════════════
   Render Grid
   ═══════════════════════════════════════ */
const grid = document.getElementById('grid');

function render(selectedCats) {
    // Determine which array to render (Firestore data if ready, else local fallback)
    const dataToRender = placesData.length > 0 ? placesData : places;
    const list = dataToRender.filter(p => selectedCats.includes(p.cat));
    if (list.length === 0) {
        const emptyMsg = i18n[savedLang] ? i18n[savedLang].emptyMsg : i18n.en.emptyMsg;
        grid.innerHTML = `<p class="empty-msg">${emptyMsg}</p>`;
        return;
    }
    
    const dict = i18n[savedLang] || i18n.en;
    
    grid.innerHTML = list.map(p => {
        const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
        const crowd = predictCrowdLevel(p);
        
        let crowdLabel = crowd.label;
        if (crowd.label === "Low") crowdLabel = dict.crowdLow || "Low";
        if (crowd.label === "Moderate") crowdLabel = dict.crowdMod || "Moderate";
        if (crowd.label === "High") crowdLabel = dict.crowdHigh || "High";

        return `
        <div class="card">
            <div class="card-img-container">
                <img src="${getImageForCategory(p.cat, p.title)}" class="card-img" alt="${p.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <i class="fa-solid ${p.icon} card-fallback-icon" style="display:none;"></i>
            </div>
            <div class="card-body">
                <div class="meta">
                    <span>${label(p.cat, dict)}</span>
                    <span class="rating"><i class="fa-solid fa-star"></i> ${p.rating}</span>
                </div>
                <h3>${p.title}</h3>
                <p class="desc">${p.desc}</p>

                <!-- Crowd Level -->
                <div class="crowd-bar">
                    <div class="crowd-info">
                        <span><i class="fa-solid fa-users"></i> ${dict.cardCrowd}</span>
                        <span class="crowd-label" style="color:${crowd.color}">${crowdLabel} (${crowd.percent}%)</span>
                    </div>
                    <div class="crowd-track"><div class="crowd-fill" style="width:${crowd.percent}%;background:${crowd.color}"></div></div>
                </div>

                <!-- Local Guide -->
                <div class="guide-info">
                    <i class="fa-solid fa-user-tie"></i>
                    <div>
                        <span class="guide-name">${p.guide}</span>
                        <a href="tel:${p.guidePhone}" class="guide-phone">${p.guidePhone}</a>
                    </div>
                </div>

                <div class="card-actions">
                    <a href="${mapUrl}" target="_blank" class="dir-btn" data-dir-cat="${p.cat}">
                        <i class="fa-solid fa-diamond-turn-right"></i> ${dict.cardDir}
                    </a>
                    <button class="trip-add-btn" data-trip-title="${p.title}">
                        <i class="fa-solid fa-plus"></i> Add to Trip
                    </button>
                </div>
            </div>
        </div>`;
    }).join('');
}

function label(cat, dict) {
    const map = { shopping: dict.filterShopping, food: dict.filterFood, spots: dict.filterSpots, temples: dict.filterTemples };
    return map[cat] || cat;
}

/* ═══════════════════════════════════════
   Checkbox Filters & Category Cards
   ═══════════════════════════════════════ */
const checkboxes = document.querySelectorAll('.checkbox-filters input[type="checkbox"]');

function getSelected() {
    return [...checkboxes].filter(cb => cb.checked).map(cb => cb.value);
}

checkboxes.forEach(cb => {
    cb.addEventListener('change', () => render(getSelected()));
});

// Category cards interactivity
document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const cat = card.getAttribute('data-category');
        if (cat) {
            // Uncheck all except the selected one
            checkboxes.forEach(cb => {
                cb.checked = (cb.value === cat);
            });
            render(getSelected());
            
            // Scroll to the explore section smoothly
            document.getElementById('explore').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Initial render (will be empty until DB loads)
render(getSelected());

// Refresh crowd levels every 30 seconds
setInterval(() => render(getSelected()), 30000);

/* ═══════════════════════════════════════
   Firestore Database Sync
   ═══════════════════════════════════════ */
const placesRef = collection(db, 'places');

let seedingInProgress = false;

// Listen for real-time updates from Firestore
onSnapshot(placesRef, async (snapshot) => {
    if (snapshot.empty && !seedingInProgress) {
        seedingInProgress = true;
        console.log("No places found in DB. Seeding all places...");
        for (const place of places) {
            await addDoc(placesRef, place);
        }
        console.log("Database seeded with", places.length, "places.");
        seedingInProgress = false;
    } else if (!snapshot.empty) {
        placesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Auto-seed any missing places (e.g. newly added ones) — once per load
        if (!seedingInProgress) {
            const existingTitles = new Set(placesData.map(p => p.title));
            const missing = places.filter(p => !existingTitles.has(p.title));
            if (missing.length > 0) {
                seedingInProgress = true;
                console.log(`Adding ${missing.length} new places to database...`);
                for (const place of missing) {
                    await addDoc(placesRef, place);
                }
                console.log("New places seeded successfully!");
                seedingInProgress = false;
            }
        }

        render(getSelected());
    }
}, (error) => {
    console.warn("Firestore permission error, using local data:", error.message);
    render(getSelected());
});

// Utility to seed initial data (Run only once if DB is empty)
window.seedDatabase = async () => {
    console.log("Seeding database...");
    for (const place of places) {
        await addDoc(placesRef, place);
    }
    console.log("Database seeded successfully!");
};

/* ═══════════════════════════════════════
   Login Modal
   ═══════════════════════════════════════ */
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const modalTitle = document.getElementById('modalTitle');
const modalSub = document.getElementById('modalSub');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const toggleAuthMode = document.getElementById('toggleAuthMode');

let isSignUp = false;

// Toggle between Sign In and Sign Up
toggleAuthMode.addEventListener('click', (e) => {
    e.preventDefault();
    isSignUp = !isSignUp;
    if (isSignUp) {
        modalTitle.textContent = "Create Account";
        modalSub.textContent = "Join Travelora to start planning your trip.";
        authSubmitBtn.textContent = "Sign Up";
        toggleAuthMode.innerHTML = `Already have an account? <a href="#" style="color: var(--accent);">Sign In</a>`;
    } else {
        modalTitle.textContent = "Sign In";
        modalSub.textContent = "Welcome back to Travelora.";
        authSubmitBtn.textContent = "Sign In";
        toggleAuthMode.innerHTML = `Don't have an account? <a href="#" style="color: var(--accent);">Sign Up</a>`;
    }
});

loginBtn.addEventListener('click', () => {
    if (auth.currentUser) {
        signOut(auth);
    } else {
        loginModal.classList.add('show');
    }
});

document.getElementById('modalClose').addEventListener('click', () => {
    if (!document.body.classList.contains('auth-gate')) loginModal.classList.remove('show');
});
loginModal.addEventListener('click', e => {
    if (e.target === loginModal && !document.body.classList.contains('auth-gate')) loginModal.classList.remove('show');
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    
    try {
        if (isSignUp) {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log("Account created:", userCredential.user.email);
        } else {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in:", userCredential.user.email);
        }
        loginModal.classList.remove('show');
        loginForm.reset();
    } catch (error) {
        console.error("Auth error:", error.code, error.message);
        if (error.code === 'auth/invalid-credential') {
            alert("Login failed! That account doesn't exist or wrong password.\nTry clicking 'Sign Up' below instead.");
        } else if (error.code === 'auth/email-already-in-use') {
            alert("An account already exists with that email. Try signing in.");
        } else {
            alert("Error: " + error.message);
        }
    }
});

onAuthStateChanged(auth, (user) => {
    const dict = i18n[savedLang] || i18n.en;
    if (user) {
        loginBtn.textContent = dict.navSignOut + ' (' + user.email.split('@')[0] + ')';
        // User is signed in — unlock the explore page
        loginModal.classList.remove('show');
        document.body.classList.remove('auth-gate');
    } else {
        loginBtn.textContent = dict.navSignIn;
        // User is signed out — show auth gate
        loginModal.classList.add('show');
        document.body.classList.add('auth-gate');
    }
});

// Show login modal immediately on page load (auth gate)
loginModal.classList.add('show');
document.body.classList.add('auth-gate');

/* ═══════════════════════════════════════
   Guide Registration Modal
   ═══════════════════════════════════════ */
const guideModal = document.getElementById('guideModal');
const guideRegForm = document.getElementById('guideRegForm');

document.getElementById('openGuideReg').addEventListener('click', (e) => {
    e.preventDefault();
    loginModal.classList.remove('show');
    guideModal.classList.add('show');
});

document.getElementById('guideModalClose').addEventListener('click', () => guideModal.classList.remove('show'));
guideModal.addEventListener('click', e => { if (e.target === guideModal) guideModal.classList.remove('show'); });

guideRegForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('guideName').value;
    const email = document.getElementById('guideEmail').value;
    const password = document.getElementById('guidePassword').value;
    const phone = document.getElementById('guidePhone').value;

    const btn = document.getElementById('guideSubmitBtn');
    btn.textContent = 'Registering...';
    btn.disabled = true;

    try {
        // 1. Create the user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Save the guide details to a Firestore 'guides' collection
        await setDoc(doc(db, "guides", user.uid), {
            uid: user.uid,
            name: name,
            email: email,
            phone: phone,
            role: 'guide',
            registeredAt: new Date().toISOString()
        });

        console.log("Guide account created strictly:", user.email);
        alert(`Welcome, ${name}! Your guide account has been created.`);
        
        guideModal.classList.remove('show');
        guideRegForm.reset();
        btn.textContent = 'Register';
        btn.disabled = false;
        
    } catch (error) {
        console.error("Guide Auth error:", error.code, error.message);
        alert("Error during registration: " + error.message);
        btn.textContent = 'Register';
        btn.disabled = false;
    }
});

/* ═══════════════════════════════════════
   Settings Modal (Theme & Language)
   ═══════════════════════════════════════ */
const settingsModal = document.getElementById('settingsModal');
document.getElementById('settingsBtn').addEventListener('click', () => settingsModal.classList.add('show'));
document.getElementById('settingsClose').addEventListener('click', () => settingsModal.classList.remove('show'));
settingsModal.addEventListener('click', e => { if (e.target === settingsModal) settingsModal.classList.remove('show'); });

// Dark Mode
const darkModeToggle = document.getElementById('darkModeToggle');
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    darkModeToggle.checked = true;
}
darkModeToggle.addEventListener('change', (e) => {
    if (e.target.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
});

// Settings Initialization
const langSelect = document.getElementById('languageSelect');
langSelect.value = savedLang;

function updateLanguage(lang) {
    savedLang = lang;
    const dict = i18n[lang] || i18n.en;
    
    document.getElementById('navExplore').textContent = dict.navExplore;
    if (!auth.currentUser) {
        document.getElementById('loginBtn').textContent = dict.navSignIn;
    } else {
        document.getElementById('loginBtn').textContent = dict.navSignOut + ' (' + auth.currentUser.email.split('@')[0] + ')';
    }
    document.getElementById('heroH1').innerHTML = `${dict.heroTitlePre} <span>${dict.heroTitleSpan}</span>`;
    document.getElementById('heroP').textContent = dict.heroSub;
    
    if (isSignUp) {
        document.getElementById('modalTitle').textContent = dict.modalTitleCreate;
        document.getElementById('modalSub').textContent = dict.modalCreateSub;
        document.getElementById('authSubmitBtn').textContent = dict.modalTitleCreate;
    } else {
        document.getElementById('modalTitle').textContent = dict.modalTitleSign;
        document.getElementById('modalSub').textContent = dict.modalSub;
        document.getElementById('authSubmitBtn').textContent = dict.modalTitleSign;
    }
    
    document.getElementById('labelDarkMode').textContent = dict.labelDarkMode;
    document.getElementById('labelLanguage').textContent = dict.labelLanguage;
    document.getElementById('filterShopping').textContent = dict.filterShopping;
    document.getElementById('filterFood').textContent = dict.filterFood;
    document.getElementById('filterSpots').textContent = dict.filterSpots;
    document.getElementById('filterTemples').textContent = dict.filterTemples;
    document.getElementById('footerText').textContent = dict.footerText;
    
    document.getElementById('chatTitle').innerHTML = `<i class="fa-solid fa-robot"></i> ${dict.chatbotName}`;
    const initialGreeting = document.getElementById('chatGreeting');
    if(initialGreeting) initialGreeting.textContent = dict.chatbotGreeting;
    document.getElementById('chatInput').placeholder = dict.chatPlaceholder;
    
    localStorage.setItem('lang', lang);
    render(getSelected()); // Re-render cards to translate categories/buttons
}
updateLanguage(savedLang);

langSelect.addEventListener('change', (e) => {
    updateLanguage(e.target.value);
});

/* ═══════════════════════════════════════
   Chatbot
   ═══════════════════════════════════════ */
const chatWindow = document.getElementById('chatWindow');
document.getElementById('chatToggle').addEventListener('click', () => chatWindow.classList.toggle('hide'));
document.getElementById('chatClose').addEventListener('click', () => chatWindow.classList.add('hide'));

const chatBody = document.getElementById('chatBody');

document.getElementById('chatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('chatInput');
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, 'user');
    input.value = '';
    // Track chatbot topic
    const lt = text.toLowerCase();
    if (/shop|market|buy/i.test(lt)) trackInteraction('shopping', 'chat');
    if (/food|eat|restaurant|cafe/i.test(lt)) trackInteraction('food', 'chat');
    if (/temple|monastery|shrine|dham/i.test(lt)) trackInteraction('temples', 'chat');
    if (/trek|hike|valley|lake|park|waterfall|ski/i.test(lt)) trackInteraction('spots', 'chat');
    // Show typing indicator
    const typingEl = document.createElement('div');
    typingEl.className = 'typing-indicator';
    typingEl.innerHTML = '<span></span><span></span><span></span>';
    chatBody.appendChild(typingEl);
    chatBody.scrollTop = chatBody.scrollHeight;
    const reply = await geminiReply(text);
    typingEl.remove();
    addMsg(reply, 'bot');
});

function addMsg(text, who) {
    const d = document.createElement('div');
    d.className = `msg ${who}`;
    d.textContent = text;
    chatBody.appendChild(d);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function botReplyFallback(q) {
    const t = q.toLowerCase();
    if (/kedarnath/i.test(t))        return "Kedarnath Temple sits at 3,583 m — open May to November. Prepare for a 16 km trek from Gaurikund!";
    if (/badrinath/i.test(t))        return "Badrinath is one of the Char Dhams. Best visited May–June or Sep–Oct.";
    if (/rishikesh/i.test(t))        return "Rishikesh is the yoga capital of the world! Try river rafting, visit Laxman Jhula, and enjoy café culture.";
    if (/mussoorie/i.test(t))        return "Mussoorie — the Queen of Hills! Don't miss Kempty Falls, Gun Hill Point and Mall Road shopping.";
    if (/nainital/i.test(t))         return "Nainital's emerald lake is stunning. Boat rides, Naina Devi Temple, and Snow View Point are must-dos.";
    if (/auli/i.test(t))             return "Auli is India's top ski destination. Visit Jan–Mar for skiing or Sep–Nov for meadow treks.";
    if (/valley.*flower/i.test(t))   return "Valley of Flowers is a UNESCO site. It blooms July–September — a paradise of alpine wildflowers.";
    if (/haridwar/i.test(t))         return "Haridwar's Ganga Aarti at Har Ki Pauri is magical. Best visited year-round but avoid the monsoon.";
    if (/shop/i.test(t))             return "For shopping, check out Paltan Bazaar in Dehradun or Mall Road in Mussoorie for woollens and local crafts.";
    if (/food|eat|restaurant/i.test(t)) return "Try Chotiwala in Rishikesh for iconic vegetarian food, or Café Ivy for continental riverside dining.";
    if (/temple|monastery/i.test(t)) return "Uttarakhand is Devbhoomi! Key temples: Kedarnath, Badrinath, Har Ki Pauri. For monasteries, visit Mindrolling in Dehradun.";
    if (/trek|hike/i.test(t))        return "Popular treks: Roopkund, Chopta-Tungnath, Valley of Flowers, and Har Ki Dun. Best season: May–June & Sep–Oct.";
    if (/crowd/i.test(t))            return "Crowd levels are predicted using time, season, and place type. For quieter visits, try early mornings or weekdays.";
    if (/guide/i.test(t))            return "Every place card shows a local guide's contact number. Hiring local guides supports the community!";
    if (/hi|hello|hey/i.test(t))     return "Namaste! 🙏 Ask me about any place in Uttarakhand — temples, treks, food, shopping, anything!";
    return "I can help you with Uttarakhand travel — ask about places, food, temples, treks or shopping!";
}

async function geminiReply(query) {
    const apiKey = localStorage.getItem('geminiApiKey');
    if (!apiKey) return botReplyFallback(query);

    const dataToUse = placesData.length > 0 ? placesData : places;
    const context = dataToUse.map(p =>
        `${p.title} [${p.cat}] — ${p.desc} (Rating: ${p.rating}, Guide: ${p.guide}, Phone: ${p.guidePhone})`
    ).join('\n');

    const systemPrompt = `You are Travelora AI, a friendly travel assistant for Uttarakhand, India. Here are places in our database:\n${context}\n\nRules: Keep responses concise (2-3 sentences). Be warm and enthusiastic. Mention guide contacts when relevant. If unrelated to Uttarakhand tourism, politely redirect.`;

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    system_instruction: { parts: [{ text: systemPrompt }] },
                    contents: [{ role: 'user', parts: [{ text: query }] }],
                    generationConfig: { maxOutputTokens: 200, temperature: 0.7 }
                })
            }
        );
        if (!response.ok) throw new Error(`API ${response.status}`);
        const data = await response.json();
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            return data.candidates[0].content.parts[0].text.trim();
        }
        return botReplyFallback(query);
    } catch (err) {
        console.warn('Gemini fallback:', err.message);
        return botReplyFallback(query);
    }
}

/* ═══════════════════════════════════════
   Gemini API Key Management
   ═══════════════════════════════════════ */
const geminiKeyInput = document.getElementById('geminiKeyInput');
geminiKeyInput.value = localStorage.getItem('geminiApiKey') || '';
geminiKeyInput.addEventListener('change', (e) => {
    localStorage.setItem('geminiApiKey', e.target.value.trim());
});

/* ═══════════════════════════════════════
   Interaction Tracking & Recommendations
   ═══════════════════════════════════════ */
function trackInteraction(category, type = 'view') {
    const prefs = JSON.parse(localStorage.getItem('userPrefs') || '{}');
    const weight = type === 'direction' ? 3 : type === 'trip' ? 5 : type === 'chat' ? 2 : 1;
    prefs[category] = (prefs[category] || 0) + weight;
    localStorage.setItem('userPrefs', JSON.stringify(prefs));
    renderRecommendations();
}

function getRecommendations() {
    const prefs = JSON.parse(localStorage.getItem('userPrefs') || '{}');
    const total = Object.values(prefs).reduce((a, b) => a + b, 0);
    if (total < 2) return [];
    const dataToUse = placesData.length > 0 ? placesData : places;
    return dataToUse
        .map(p => ({ ...p, score: ((prefs[p.cat] || 0) + 1) * p.rating }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
}

function renderRecommendations() {
    const recs = getRecommendations();
    const section = document.getElementById('recommendedSection');
    const recGrid = document.getElementById('recGrid');
    if (recs.length === 0) { section.style.display = 'none'; return; }
    section.style.display = 'block';
    const dict = i18n[savedLang] || i18n.en;
    recGrid.innerHTML = recs.map(p => {
        const mapUrl = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
        const crowd = predictCrowdLevel(p);
        let crowdLabel = crowd.label;
        if (crowd.label === "Low") crowdLabel = dict.crowdLow || "Low";
        if (crowd.label === "Moderate") crowdLabel = dict.crowdMod || "Moderate";
        if (crowd.label === "High") crowdLabel = dict.crowdHigh || "High";
        return `
        <div class="card rec-card">
            <div class="card-img-container">
                <img src="${getImageForCategory(p.cat, p.title)}" class="card-img" alt="${p.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                <i class="fa-solid ${p.icon} card-fallback-icon" style="display:none;"></i>
            </div>
            <div class="card-body">
                <div class="meta">
                    <span>${label(p.cat, dict)}</span>
                    <span class="rating"><i class="fa-solid fa-star"></i> ${p.rating}</span>
                </div>
                <h3>${p.title}</h3>
                <p class="desc">${p.desc}</p>
                <div class="crowd-bar">
                    <div class="crowd-info">
                        <span><i class="fa-solid fa-users"></i> ${dict.cardCrowd}</span>
                        <span class="crowd-label" style="color:${crowd.color}">${crowdLabel} (${crowd.percent}%)</span>
                    </div>
                    <div class="crowd-track"><div class="crowd-fill" style="width:${crowd.percent}%;background:${crowd.color}"></div></div>
                </div>
                <div class="card-actions">
                    <a href="${mapUrl}" target="_blank" class="dir-btn" data-dir-cat="${p.cat}">
                        <i class="fa-solid fa-diamond-turn-right"></i> ${dict.cardDir}
                    </a>
                </div>
            </div>
        </div>`;
    }).join('');
}

/* ═══════════════════════════════════════
   Floating Action Buttons (Chat & Trip)
   ═══════════════════════════════════════ */
const chatToggle = document.getElementById('chatToggle');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');

if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hide');
    });
    chatClose.addEventListener('click', () => {
        chatWindow.classList.add('hide');
    });
}

const tripToggleBtn = document.getElementById('tripToggle');
const tripPanel = document.getElementById('tripPanel');
const tripCloseBtn = document.getElementById('tripClose');

if (tripToggleBtn && tripPanel) {
    // Show the button initially
    tripToggleBtn.style.display = 'flex';
    
    tripToggleBtn.addEventListener('click', () => {
        tripPanel.classList.add('show');
    });
    tripCloseBtn.addEventListener('click', () => {
        tripPanel.classList.remove('show');
    });
}

/* ═══════════════════════════════════════
   Trip Cost Calculator API Integration
   ═══════════════════════════════════════ */
const costCalcModal = document.getElementById('costCalcModal');
const openCostCalcBtn = document.getElementById('openCostCalc');
const costCalcClose = document.getElementById('costCalcClose');
const costCalcForm = document.getElementById('costCalcForm');
const calcResult = document.getElementById('calcResult');
const calcResultVal = document.getElementById('calcResultVal');
const calcSubmitBtn = document.getElementById('calcSubmitBtn');

if (openCostCalcBtn) {
    openCostCalcBtn.addEventListener('click', () => {
        costCalcModal.classList.add('show');
    });
}

if (costCalcClose) {
    costCalcClose.addEventListener('click', () => {
        costCalcModal.classList.remove('show');
    });
}

if (costCalcModal) {
    costCalcModal.addEventListener('click', (e) => {
        if (e.target === costCalcModal) costCalcModal.classList.remove('show');
    });
}

if (costCalcForm) {
    costCalcForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        calcSubmitBtn.textContent = 'Calculating...';
        calcSubmitBtn.disabled = true;
        calcResult.style.display = 'none';

        const payload = {
            source_city: document.getElementById('calcSource').value,
            destination_city: document.getElementById('calcDest').value,
            transport_type: document.getElementById('calcTransport').value,
            hotel_type: document.getElementById('calcHotel').value,
            season: document.getElementById('calcSeason').value,
            distance_km: document.getElementById('calcDistance').value,
            days: document.getElementById('calcDays').value,
            people: document.getElementById('calcPeople').value
        };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/predict_cost', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) throw new Error(`Server returned ${response.status}`);
            
            const data = await response.json();
            
            if (data.success) {
                // Format as Indian Rupee
                const formattedCost = new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                }).format(data.predicted_cost);
                
                calcResultVal.textContent = formattedCost;
                calcResult.style.display = 'block';
            } else {
                alert("Error: " + (data.error || "Unknown error occurred"));
            }
        } catch (err) {
            console.error("Cost Prediction Error:", err);
            alert("Could not connect to the Cost Prediction AI. Ensure the Python backend is running.");
        } finally {
            calcSubmitBtn.textContent = 'Calculate Estimate';
            calcSubmitBtn.disabled = false;
        }
    });
}

// Event delegation for direction clicks
document.addEventListener('click', (e) => {
    const dirBtn = e.target.closest('.dir-btn');
    if (dirBtn && dirBtn.dataset.dirCat) {
        trackInteraction(dirBtn.dataset.dirCat, 'direction');
    }
    const tripBtn = e.target.closest('.trip-add-btn');
    if (tripBtn) {
        toggleTripPlace(tripBtn.dataset.tripTitle, tripBtn);
    }
});

renderRecommendations();

/* ═══════════════════════════════════════
   Trip Planner & Route Optimization
   ═══════════════════════════════════════ */
let tripPlaces = JSON.parse(localStorage.getItem('tripPlaces') || '[]');
const tripPanel = document.getElementById('tripPanel');
const tripToggle = document.getElementById('tripToggle');
const tripBadge = document.getElementById('tripBadge');
const tripBody = document.getElementById('tripBody');
const tripFooter = document.getElementById('tripFooter');

tripToggle.addEventListener('click', () => tripPanel.classList.toggle('open'));
document.getElementById('tripClose').addEventListener('click', () => tripPanel.classList.remove('open'));

function toggleTripPlace(title, btnEl) {
    const idx = tripPlaces.findIndex(t => t.title === title);
    if (idx > -1) {
        tripPlaces.splice(idx, 1);
        if (btnEl) { btnEl.classList.remove('added'); btnEl.innerHTML = '<i class="fa-solid fa-plus"></i> Add to Trip'; }
    } else {
        const allPlaces = placesData.length > 0 ? placesData : places;
        const place = allPlaces.find(p => p.title === title);
        if (place) {
            tripPlaces.push({ title: place.title, lat: place.lat, lng: place.lng, cat: place.cat, icon: place.icon });
            if (btnEl) { btnEl.classList.add('added'); btnEl.innerHTML = '<i class="fa-solid fa-check"></i> Added'; }
            trackInteraction(place.cat, 'trip');
        }
    }
    localStorage.setItem('tripPlaces', JSON.stringify(tripPlaces));
    renderTripPanel();
}

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function calculateTotalDistance(stops) {
    let dist = 0;
    for (let i = 1; i < stops.length; i++) {
        dist += haversineDistance(stops[i-1].lat, stops[i-1].lng, stops[i].lat, stops[i].lng);
    }
    return dist;
}

function optimizeRoute(stops) {
    if (stops.length <= 2) return { order: [...stops], distance: calculateTotalDistance(stops) };
    // Nearest-neighbor TSP heuristic
    const unvisited = [...stops];
    const route = [unvisited.shift()];
    let totalDist = 0;
    while (unvisited.length > 0) {
        const last = route[route.length - 1];
        let nearestIdx = 0, minDist = Infinity;
        unvisited.forEach((p, i) => {
            const d = haversineDistance(last.lat, last.lng, p.lat, p.lng);
            if (d < minDist) { minDist = d; nearestIdx = i; }
        });
        totalDist += minDist;
        route.push(unvisited.splice(nearestIdx, 1)[0]);
    }
    return { order: route, distance: totalDist };
}

function renderTripPanel() {
    const count = tripPlaces.length;
    tripBadge.textContent = count;
    tripToggle.style.display = count > 0 ? 'flex' : 'none';
    if (count === 0) {
        tripBody.innerHTML = '<p class="trip-empty">Add places from the cards below to plan your route.</p>';
        tripFooter.style.display = 'none';
        return;
    }
    tripFooter.style.display = 'block';
    const totalDist = calculateTotalDistance(tripPlaces);
    document.getElementById('tripDistance').innerHTML = `<i class="fa-solid fa-road"></i> ${totalDist.toFixed(1)} km`;
    document.getElementById('tripStops').innerHTML = `<i class="fa-solid fa-location-dot"></i> ${count} stops`;

    tripBody.innerHTML = tripPlaces.map((p, i) => {
        const dist = i > 0 ? haversineDistance(tripPlaces[i-1].lat, tripPlaces[i-1].lng, p.lat, p.lng).toFixed(1) : null;
        return `
        <div class="trip-item">
            <span class="trip-item-num">${i + 1}</span>
            <div class="trip-item-info">
                <span class="trip-item-title">${p.title}</span>
                <span class="trip-item-dist">${dist ? dist + ' km from previous' : 'Starting point'}</span>
            </div>
            <button class="trip-item-remove" data-remove-title="${p.title}" title="Remove">
                <i class="fa-solid fa-xmark"></i>
            </button>
        </div>`;
    }).join('');

    // Google Maps multi-stop URL
    const waypoints = tripPlaces.map(p => `${p.lat},${p.lng}`);
    const origin = waypoints[0];
    const destination = waypoints[waypoints.length - 1];
    const middle = waypoints.slice(1, -1).join('|');
    let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
    if (middle) mapsUrl += `&waypoints=${middle}`;
    document.getElementById('tripMapsLink').href = mapsUrl;
}

document.getElementById('tripOptimize').addEventListener('click', () => {
    if (tripPlaces.length < 3) { alert('Add at least 3 places to optimize!'); return; }
    const result = optimizeRoute(tripPlaces);
    tripPlaces = result.order;
    localStorage.setItem('tripPlaces', JSON.stringify(tripPlaces));
    renderTripPanel();
    const btn = document.getElementById('tripOptimize');
    btn.textContent = '✓ Route Optimized!';
    setTimeout(() => { btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Optimize Route'; }, 1500);
});

tripBody.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.trip-item-remove');
    if (removeBtn) {
        const title = removeBtn.dataset.removeTitle;
        tripPlaces = tripPlaces.filter(p => p.title !== title);
        localStorage.setItem('tripPlaces', JSON.stringify(tripPlaces));
        const gridBtn = document.querySelector(`.trip-add-btn[data-trip-title="${title}"]`);
        if (gridBtn) { gridBtn.classList.remove('added'); gridBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add to Trip'; }
        renderTripPanel();
    }
});

// Restore trip button states when grid re-renders
function restoreTripButtonStates() {
    tripPlaces.forEach(tp => {
        const btn = document.querySelector(`.trip-add-btn[data-trip-title="${tp.title}"]`);
        if (btn) { btn.classList.add('added'); btn.innerHTML = '<i class="fa-solid fa-check"></i> Added'; }
    });
}
const gridObserver = new MutationObserver(() => restoreTripButtonStates());
gridObserver.observe(grid, { childList: true });

renderTripPanel();

