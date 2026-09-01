import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "hi" | "en" | "mr" | "gu";

export const LANGUAGES: { code: Lang; label: string; native: string; note: string }[] = [
  { code: "hi", label: "Hindi", native: "हिंदी", note: "भारत की राजभाषा" },
  { code: "en", label: "English", native: "English", note: "International" },
  { code: "mr", label: "Marwari", native: "मारवाड़ी", note: "राजस्थानी बोली" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી", note: "પડોશી રાજ્ય" },
];

type Dict = Record<string, Partial<Record<Lang, string>> & { en: string; hi: string }>;

export const strings: Dict = {
  brand: { en: "MARUDHARA", hi: "मरुधरा", mr: "मरुधरा", gu: "મરુધરા" },
  tagline: {
    en: "Discover Rajasthan. Experience Local. Buy Direct.",
    hi: "राजस्थान खोजें। गाँव जिएँ। सीधे खरीदें।",
    mr: "राजस्थान खोजो। गाँव जियो। सीधो खरीदो।",
    gu: "રાજસ્થાન શોધો. ગામ જીવો. સીધું ખરીદો.",
  },
  chooseLanguage: { en: "Choose your language", hi: "अपनी भाषा चुनें", mr: "आपरी भाषा चुणो", gu: "તમારી ભાષા પસંદ કરો" },
  chooseLanguageSub: {
    en: "You can change this later from your profile.",
    hi: "इसे बाद में प्रोफ़ाइल से बदल सकते हैं।",
    mr: "इणने पछै प्रोफाइल सूं बदल सको।",
    gu: "તમે પછીથી પ્રોફાઇલમાંથી બદલી શકો છો.",
  },
  continue: { en: "Continue", hi: "आगे बढ़ें", mr: "आगै बढ़ो", gu: "આગળ વધો" },
  home: { en: "Home", hi: "होम", mr: "होम", gu: "હોમ" },
  explore: { en: "Explore", hi: "खोजें", mr: "खोजो", gu: "શોધો" },
  shop: { en: "Shop", hi: "दुकान", mr: "हाट", gu: "દુકાન" },
  orders: { en: "Orders", hi: "ऑर्डर", mr: "ऑर्डर", gu: "ઓર્ડર" },
  profile: { en: "Profile", hi: "प्रोफ़ाइल", mr: "प्रोफाइल", gu: "પ્રોફાઇલ" },
  searchPlaceholder: {
    en: "Search village, product or experience",
    hi: "गाँव, उत्पाद या अनुभव खोजें",
    mr: "गाँव, माल या अनुभव खोजो",
    gu: "ગામ, ઉત્પાદન કે અનુભવ શોધો",
  },
  district: { en: "District", hi: "ज़िला", mr: "जिलो", gu: "જિલ્લો" },
  allDistricts: { en: "All districts", hi: "सभी ज़िले", mr: "सगळा जिला", gu: "બધા જિલ્લા" },
  categories: { en: "Categories", hi: "श्रेणियाँ", mr: "श्रेणी", gu: "શ્રેણીઓ" },
  all: { en: "All", hi: "सभी", mr: "सगळा", gu: "બધા" },
  journey: { en: "How Marudhara works", hi: "मरुधरा कैसे काम करता है", mr: "मरुधरा कियां काम करै", gu: "મરુધરા કેવી રીતે કામ કરે" },
  journeySub: {
    en: "One trip becomes a lifelong connection.",
    hi: "एक यात्रा, जीवन भर का रिश्ता।",
    mr: "एक जातरा, जिंदगी भर रो नातो।",
    gu: "એક યાત્રા, જીવનભરનો સંબંધ.",
  },
  villages: { en: "Villages", hi: "गाँव", mr: "गाँव", gu: "ગામ" },
  villageDirectory: { en: "Village Directory", hi: "गाँव निर्देशिका", mr: "गाँव सूची", gu: "ગામ ડિરેક્ટરી" },
  exploreVillage: { en: "Explore Village", hi: "गाँव देखें", mr: "गाँव देखो", gu: "ગામ જુઓ" },
  homestays: { en: "Homestays", hi: "होमस्टे", mr: "होमस्टे", gu: "હોમસ્ટે" },
  experiences: { en: "Experiences", hi: "अनुभव", mr: "अनुभव", gu: "અનુભવ" },
  products: { en: "Products", hi: "उत्पाद", mr: "माल", gu: "ઉત્પાદનો" },
  makers: { en: "Meet the Makers", hi: "कारीगरों से मिलें", mr: "कारीगरां सूं मिलो", gu: "કારીગરોને મળો" },
  meetTheMaker: { en: "Meet the Maker", hi: "कारीगर से मिलें", mr: "कारीगर सूं मिलो", gu: "કારીગરને મળો" },
  followProducer: { en: "Follow Producer", hi: "प्रोड्यूसर फॉलो करें", mr: "प्रोड्यूसर फॉलो करो", gu: "પ્રોડ્યુસર ફોલો કરો" },
  following: { en: "Following", hi: "फॉलो कर रहे हैं", mr: "फॉलो करै हो", gu: "ફોલો કરી રહ્યા છો" },
  story: { en: "Her story", hi: "उनकी कहानी", mr: "उणारी कहाणी", gu: "તેમની વાર્તા" },
  addToCart: { en: "Add to cart", hi: "कार्ट में डालें", mr: "कार्ट में घालो", gu: "કાર્ટમાં ઉમેરો" },
  cart: { en: "Cart", hi: "कार्ट", mr: "कार्ट", gu: "કાર્ટ" },
  cartEmpty: { en: "Your cart is empty", hi: "आपका कार्ट खाली है", mr: "कार्ट खाली है", gu: "તમારું કાર્ટ ખાલી છે" },
  checkout: { en: "Checkout", hi: "भुगतान करें", mr: "भुगतान करो", gu: "ચેકઆઉટ" },
  subtotal: { en: "Subtotal", hi: "उप-योग", mr: "उप-जोड़", gu: "સબટોટલ" },
  delivery: { en: "Delivery", hi: "डिलीवरी", mr: "डिलीवरी", gu: "ડિલિવરી" },
  platformFee: { en: "Platform fee", hi: "प्लेटफ़ॉर्म शुल्क", mr: "प्लेटफार्म शुल्क", gu: "પ્લેટફોર્મ ફી" },
  total: { en: "Total", hi: "कुल", mr: "कुल", gu: "કુલ" },
  placeOrder: { en: "Place order", hi: "ऑर्डर करें", mr: "ऑर्डर करो", gu: "ઓર્ડર કરો" },
  bookNow: { en: "Book now", hi: "बुक करें", mr: "बुक करो", gu: "બુક કરો" },
  perNight: { en: "per night", hi: "प्रति रात", mr: "एक रात रो", gu: "પ્રતિ રાત" },
  perPerson: { en: "per person", hi: "प्रति व्यक्ति", mr: "एक जणा रो", gu: "પ્રતિ વ્યક્તિ" },
  myOrders: { en: "My orders", hi: "मेरे ऑर्डर", mr: "म्हारा ऑर्डर", gu: "મારા ઓર્ડર" },
  myBookings: { en: "My bookings", hi: "मेरी बुकिंग", mr: "म्हारी बुकिंग", gu: "મારી બુકિંગ" },
  noOrders: { en: "No orders yet", hi: "अभी कोई ऑर्डर नहीं", mr: "अजै कोई ऑर्डर नीं", gu: "હજી કોઈ ઓર્ડર નથી" },
  reorder: { en: "Re-order", hi: "दोबारा ऑर्डर", mr: "फेर सूं ऑर्डर", gu: "ફરી ઓર્ડર" },
  pending: { en: "Pending", hi: "प्रतीक्षा में", mr: "बाकी", gu: "બાકી" },
  shipped: { en: "Shipped", hi: "भेजा गया", mr: "भेज्यो", gu: "મોકલ્યું" },
  completed: { en: "Completed", hi: "पूर्ण", mr: "पूरो", gu: "પૂર્ણ" },
  confirmed: { en: "Confirmed", hi: "पुष्ट", mr: "पक्को", gu: "પુષ્ટ" },
  approved: { en: "Approved", hi: "स्वीकृत", mr: "मंजूर", gu: "મંજૂર" },
  rejected: { en: "Rejected", hi: "अस्वीकृत", mr: "नामंजूर", gu: "નામંજૂર" },
  role: { en: "I am a", hi: "मैं हूँ", mr: "म्हूं हूँ", gu: "હું છું" },
  tourist: { en: "Tourist / Customer", hi: "पर्यटक / ग्राहक", mr: "पर्यटक / ग्राहक", gu: "પર્યટક / ગ્રાહક" },
  producer: { en: "Producer / Host", hi: "कारीगर / होस्ट", mr: "कारीगर / होस्ट", gu: "કારીગર / હોસ્ટ" },
  admin: { en: "Admin", hi: "एडमिन", mr: "एडमिन", gu: "એડમિન" },
  producerDashboard: { en: "Producer dashboard", hi: "कारीगर डैशबोर्ड", mr: "कारीगर डैशबोर्ड", gu: "કારીગર ડેશબોર્ડ" },
  adminDashboard: { en: "Admin dashboard", hi: "एडमिन डैशबोर्ड", mr: "एडमिन डैशबोर्ड", gu: "એડમિન ડેશબોર્ડ" },
  earnings: { en: "Earnings this month", hi: "इस माह की कमाई", mr: "आ महीनै री कमाई", gu: "આ મહિનાની કમાણી" },
  language: { en: "Language", hi: "भाषा", mr: "भाषा", gu: "ભાષા" },
  back: { en: "Back", hi: "पीछे", mr: "पाछै", gu: "પાછળ" },
  save: { en: "Save", hi: "सहेजें", mr: "सहेजो", gu: "સાચવો" },
  submitForReview: { en: "Submit for review", hi: "समीक्षा के लिए भेजें", mr: "जाँच नै भेजो", gu: "સમીક્ષા માટે મોકલો" },
};

export function tr(key: string, lang: Lang): string {
  const e = strings[key];
  if (!e) return key;
  return e[lang] ?? (lang === "mr" ? e.hi : e.en);
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string; chosen: boolean };
const LangCtx = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("hi");
  const [chosen, setChosen] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("marudhara.lang") as Lang | null;
    if (saved) setLangState(saved);
    else setChosen(false);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    setChosen(true);
    localStorage.setItem("marudhara.lang", l);
  };

  return (
    <LangCtx.Provider value={{ lang, setLang, t: (k) => tr(k, lang), chosen }}>
      {children}
    </LangCtx.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

/** Pick a localized value from bilingual demo content. */
export function useLocal() {
  const { lang } = useLang();
  return (value: { en: string; hi: string }) => (lang === "en" ? value.en : value.hi);
}
