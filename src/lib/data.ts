import heroVillage from "@/assets/hero-village.jpg";
import villageJodhpur from "@/assets/village-jodhpur.jpg";
import villageBikaner from "@/assets/village-bikaner.jpg";
import villageUdaipur from "@/assets/village-udaipur.jpg";
import homestay1 from "@/assets/homestay-1.jpg";
import maker1 from "@/assets/maker-1.jpg";
import maker2 from "@/assets/maker-2.jpg";
import productPapad from "@/assets/product-papad.jpg";
import productSpices from "@/assets/product-spices.jpg";
import productCraft from "@/assets/product-craft.jpg";

export const images = {
  heroVillage,
  villageJodhpur,
  villageBikaner,
  villageUdaipur,
  homestay1,
  maker1,
  maker2,
  productPapad,
  productSpices,
  productCraft,
};

export type Bi = { en: string; hi: string };
export type Status = "approved" | "pending" | "rejected";

export type District = { id: string; name: Bi; villages: number };

export const districts: District[] = [
  { id: "udaipur", name: { en: "Udaipur", hi: "उदयपुर" }, villages: 2 },
  { id: "bikaner", name: { en: "Bikaner", hi: "बीकानेर" }, villages: 2 },
  { id: "jodhpur", name: { en: "Jodhpur", hi: "जोधपुर" }, villages: 2 },
];

export type Category = { id: string; name: Bi; emoji: string };

export const categories: Category[] = [
  { id: "papad", name: { en: "Papad & Badi", hi: "पापड़ व बड़ी" }, emoji: "🥟" },
  { id: "spices", name: { en: "Spices", hi: "मसाले" }, emoji: "🌶️" },
  { id: "handicraft", name: { en: "Handicrafts", hi: "हस्तशिल्प" }, emoji: "🧵" },
  { id: "homestay", name: { en: "Homestays", hi: "होमस्टे" }, emoji: "🏡" },
  { id: "experience", name: { en: "Experiences", hi: "अनुभव" }, emoji: "🪘" },
];

export type Village = {
  id: string;
  name: Bi;
  district: string;
  cover: string;
  tagline: Bi;
  story: Bi;
  crafts: Bi[];
  bestTime: Bi;
  status: Status;
};

export const villages: Village[] = [
  {
    id: "bishnoi",
    name: { en: "Bishnoi Village, Guda", hi: "बिश्नोई गाँव, गुड़ा" },
    district: "jodhpur",
    cover: villageJodhpur,
    tagline: { en: "Nature keepers of the Thar", hi: "थार के प्रकृति रक्षक" },
    story: {
      en: "For five centuries the Bishnoi community has protected blackbucks and khejri trees. Mornings begin with opium-free tea rituals, wool spinning and mud-plastered homes cooled by desert wind.",
      hi: "पाँच सदियों से बिश्नोई समुदाय काले हिरण और खेजड़ी के पेड़ों की रक्षा करता आया है। सुबह चाय की परंपरा, ऊन की कताई और मिट्टी के ठंडे घरों से शुरू होती है।",
    },
    crafts: [
      { en: "Wool weaving", hi: "ऊन बुनाई" },
      { en: "Terracotta", hi: "मिट्टी के बर्तन" },
    ],
    bestTime: { en: "Oct – Mar", hi: "अक्तूबर – मार्च" },
    status: "approved",
  },
  {
    id: "salawas",
    name: { en: "Salawas", hi: "सालावास" },
    district: "jodhpur",
    cover: heroVillage,
    tagline: { en: "The dhurrie weavers' village", hi: "दरी बुनकरों का गाँव" },
    story: {
      en: "Nearly every courtyard in Salawas holds a pit loom. Families weave punja dhurries in vegetable-dyed cotton, a craft handed down through six generations.",
      hi: "सालावास के लगभग हर आँगन में करघा है। परिवार सब्ज़ी रंगों से रंगी सूती पंजा दरी बुनते हैं — छह पीढ़ियों की विरासत।",
    },
    crafts: [
      { en: "Punja dhurrie", hi: "पंजा दरी" },
      { en: "Block print", hi: "ब्लॉक प्रिंट" },
    ],
    bestTime: { en: "Nov – Feb", hi: "नवंबर – फ़रवरी" },
    status: "approved",
  },
  {
    id: "raisar",
    name: { en: "Raisar", hi: "रायसर" },
    district: "bikaner",
    cover: villageBikaner,
    tagline: { en: "Where papad dries in the sun", hi: "जहाँ धूप में पापड़ सूखते हैं" },
    story: {
      en: "Raisar's women's self-help groups roll moth-bean papad and badi at dawn, drying them on woven mats before the desert heat peaks. Camel dairy and sand-dune sunsets complete the day.",
      hi: "रायसर की महिला स्वयं सहायता समूह भोर में मोठ की पापड़ और बड़ी बेलती हैं और गर्मी चढ़ने से पहले चटाइयों पर सुखाती हैं। शाम ऊँट के दूध और रेत के धोरों के सूरज ढलने के साथ पूरी होती है।",
    },
    crafts: [
      { en: "Papad & badi", hi: "पापड़ व बड़ी" },
      { en: "Camel leather", hi: "ऊँट चमड़ा" },
    ],
    bestTime: { en: "Oct – Feb", hi: "अक्तूबर – फ़रवरी" },
    status: "approved",
  },
  {
    id: "napasar",
    name: { en: "Napasar", hi: "नापासर" },
    district: "bikaner",
    cover: villageBikaner,
    tagline: { en: "Spice mills and folk music", hi: "मसाला चक्की और लोक संगीत" },
    story: {
      en: "Stone mills grind Bikaneri chilli and cumin here. Evenings belong to Manganiyar folk singers who perform in the village chaupal.",
      hi: "यहाँ पत्थर की चक्कियों में बीकानेरी मिर्च और जीरा पिसता है। शामें गाँव की चौपाल पर मांगणियार लोक गायकों की होती हैं।",
    },
    crafts: [
      { en: "Hand-ground spices", hi: "हाथ के पिसे मसाले" },
      { en: "Folk music", hi: "लोक संगीत" },
    ],
    bestTime: { en: "Nov – Mar", hi: "नवंबर – मार्च" },
    status: "approved",
  },
  {
    id: "kotra",
    name: { en: "Kotra", hi: "कोटड़ा" },
    district: "udaipur",
    cover: villageUdaipur,
    tagline: { en: "Tribal hills of the Aravalli", hi: "अरावली की आदिवासी पहाड़ियाँ" },
    story: {
      en: "Bhil and Garasia families farm terraced maize fields. Walls are painted with Mandana motifs before every festival and millet meals are cooked on wood fire.",
      hi: "भील और गरासिया परिवार सीढ़ीदार खेतों में मक्का उगाते हैं। हर त्योहार पर दीवारों पर माँडना बनता है और चूल्हे पर बाजरे का खाना पकता है।",
    },
    crafts: [
      { en: "Mandana wall art", hi: "माँडना भित्ति कला" },
      { en: "Bamboo craft", hi: "बाँस शिल्प" },
    ],
    bestTime: { en: "Jul – Mar", hi: "जुलाई – मार्च" },
    status: "approved",
  },
  {
    id: "delwara",
    name: { en: "Delwara", hi: "देलवाड़ा" },
    district: "udaipur",
    cover: villageUdaipur,
    tagline: { en: "Stepwells, temples and thali food", hi: "बावड़ी, मंदिर और थाली" },
    story: {
      en: "A heritage town of restored stepwells where women's collectives run walking tours, community kitchens and a small handicraft market.",
      hi: "पुनर्जीवित बावड़ियों का विरासत कस्बा, जहाँ महिला समूह पैदल यात्रा, सामुदायिक रसोई और छोटा हस्तशिल्प बाज़ार चलाते हैं।",
    },
    crafts: [
      { en: "Community kitchen", hi: "सामुदायिक रसोई" },
      { en: "Heritage walks", hi: "विरासत भ्रमण" },
    ],
    bestTime: { en: "Sep – Mar", hi: "सितंबर – मार्च" },
    status: "pending",
  },
];

export type Producer = {
  id: string;
  name: Bi;
  craft: Bi;
  villageId: string;
  photo: string;
  rating: number;
  reviews: number;
  followers: number;
  verified: boolean;
  story: Bi;
  shg: Bi;
  status: Status;
};

export const producers: Producer[] = [
  {
    id: "kumkum",
    name: { en: "Kumkum Devi", hi: "कुमकुम देवी" },
    craft: { en: "Potter & terracotta artisan", hi: "कुम्हार व टेराकोटा कारीगर" },
    villageId: "bishnoi",
    photo: maker1,
    rating: 4.8,
    reviews: 128,
    followers: 1240,
    verified: true,
    story: {
      en: "I learnt the wheel from my mother-in-law at nineteen. For years traders bought my pots for a few rupees and sold them in the city for ten times more. Today twenty-two women in our group price our own work, and travellers who visit our courtyard order again from their homes.",
      hi: "उन्नीस की उम्र में सास से चाक सीखा। सालों तक बिचौलिये मेरे बर्तन कुछ रुपयों में ले जाते और शहर में दस गुना बेचते। आज हमारे समूह की बाईस महिलाएँ अपनी कीमत खुद तय करती हैं, और जो यात्री आँगन तक आए वे घर से दोबारा ऑर्डर करते हैं।",
    },
    shg: { en: "Khejri Women's SHG", hi: "खेजड़ी महिला स्वयं सहायता समूह" },
    status: "approved",
  },
  {
    id: "sunita",
    name: { en: "Sunita Bishnoi", hi: "सुनीता बिश्नोई" },
    craft: { en: "Block print & embroidery", hi: "ब्लॉक प्रिंट व कढ़ाई" },
    villageId: "salawas",
    photo: maker2,
    rating: 4.9,
    reviews: 96,
    followers: 870,
    verified: true,
    story: {
      en: "Our courtyard loom never rests. I print with wooden blocks my grandfather carved and stitch mirror work in the evenings while the children study beside me.",
      hi: "हमारा आँगन का करघा कभी नहीं रुकता। दादाजी के बनाए लकड़ी के ठप्पों से छपाई करती हूँ और शाम को बच्चों के पढ़ते वक़्त शीशे की कढ़ाई करती हूँ।",
    },
    shg: { en: "Salawas Weavers Collective", hi: "सालावास बुनकर समूह" },
    status: "approved",
  },
  {
    id: "kamla",
    name: { en: "Kamla Devi", hi: "कमला देवी" },
    craft: { en: "Papad & badi maker", hi: "पापड़ व बड़ी निर्माता" },
    villageId: "raisar",
    photo: maker1,
    rating: 4.7,
    reviews: 212,
    followers: 2130,
    verified: true,
    story: {
      en: "Eighteen of us start rolling moth-bean papad at four in the morning. Every packet you order pays school fees in this street — that is the whole story.",
      hi: "हम अठारह महिलाएँ सुबह चार बजे मोठ के पापड़ बेलना शुरू करती हैं। आपका हर पैकेट इस गली के बच्चों की फ़ीस बनता है — कहानी बस इतनी है।",
    },
    shg: { en: "Raisar Mahila Udyog", hi: "रायसर महिला उद्योग" },
    status: "approved",
  },
  {
    id: "geeta",
    name: { en: "Geeta Sharma", hi: "गीता शर्मा" },
    craft: { en: "Stone-ground spices", hi: "पत्थर की चक्की के मसाले" },
    villageId: "napasar",
    photo: maker2,
    rating: 4.6,
    reviews: 74,
    followers: 540,
    verified: true,
    story: {
      en: "We grind chilli and cumin slowly on stone so the aroma stays. Nothing is added, nothing is coloured — you get exactly what our kitchen uses.",
      hi: "मिर्च और जीरा पत्थर पर धीरे पीसते हैं ताकि खुशबू बनी रहे। कुछ मिलाते नहीं, रंग डालते नहीं — जो हमारी रसोई में चलता है वही आपको मिलता है।",
    },
    shg: { en: "Napasar Spice Sangathan", hi: "नापासर मसाला संगठन" },
    status: "approved",
  },
  {
    id: "leela",
    name: { en: "Leela Garasia", hi: "लीला गरासिया" },
    craft: { en: "Bamboo & Mandana art", hi: "बाँस व माँडना कला" },
    villageId: "kotra",
    photo: maker2,
    rating: 4.5,
    reviews: 33,
    followers: 210,
    verified: false,
    story: {
      en: "I paint Mandana on our walls for festivals and now on cloth so it can travel. My daughter photographs each piece for the app.",
      hi: "त्योहारों पर दीवारों पर माँडना बनाती हूँ, अब कपड़े पर भी बनाती हूँ ताकि वह दूर तक जाए। बेटी हर टुकड़े की फ़ोटो ऐप के लिए खींचती है।",
    },
    shg: { en: "Kotra Adivasi Kala Samuh", hi: "कोटड़ा आदिवासी कला समूह" },
    status: "pending",
  },
];

export type Product = {
  id: string;
  name: Bi;
  category: string;
  price: number;
  unit: Bi;
  image: string;
  producerId: string;
  stock: number;
  story: Bi;
  status: Status;
};

export const products: Product[] = [
  {
    id: "p1",
    name: { en: "Moth Bean Papad", hi: "मोठ पापड़" },
    category: "papad",
    price: 180,
    unit: { en: "500 g pack", hi: "500 ग्राम पैक" },
    image: productPapad,
    producerId: "kamla",
    stock: 42,
    story: {
      en: "Hand-rolled at dawn, sun-dried on woven mats for two days, packed the same week.",
      hi: "भोर में हाथ से बेले, दो दिन धूप में चटाई पर सुखाए, उसी सप्ताह पैक किए।",
    },
    status: "approved",
  },
  {
    id: "p2",
    name: { en: "Moong Badi", hi: "मूँग बड़ी" },
    category: "papad",
    price: 220,
    unit: { en: "400 g pack", hi: "400 ग्राम पैक" },
    image: productPapad,
    producerId: "kamla",
    stock: 30,
    story: {
      en: "Soaked moong ground on stone, shaped by hand into small badi and shade-dried.",
      hi: "भिगोई मूँग पत्थर पर पीसी, हाथ से छोटी बड़ी बनाई और छाया में सुखाई।",
    },
    status: "approved",
  },
  {
    id: "p3",
    name: { en: "Bikaneri Red Chilli Powder", hi: "बीकानेरी लाल मिर्च पाउडर" },
    category: "spices",
    price: 240,
    unit: { en: "250 g jar", hi: "250 ग्राम डिब्बी" },
    image: productSpices,
    producerId: "geeta",
    stock: 55,
    story: {
      en: "Single-origin Mathania chilli, stone-ground in small batches. No colour added.",
      hi: "एक ही खेत की मथानिया मिर्च, छोटी मात्रा में पत्थर की चक्की पर पिसी। कोई रंग नहीं।",
    },
    status: "approved",
  },
  {
    id: "p4",
    name: { en: "Village Garam Masala", hi: "गाँव का गरम मसाला" },
    category: "spices",
    price: 195,
    unit: { en: "200 g pouch", hi: "200 ग्राम पाउच" },
    image: productSpices,
    producerId: "geeta",
    stock: 61,
    story: {
      en: "Our family blend of nine spices, roasted on a wood fire before grinding.",
      hi: "नौ मसालों का पारिवारिक मिश्रण, पीसने से पहले चूल्हे पर भूना।",
    },
    status: "approved",
  },
  {
    id: "p5",
    name: { en: "Punja Dhurrie Runner", hi: "पंजा दरी रनर" },
    category: "handicraft",
    price: 1850,
    unit: { en: "60 x 180 cm", hi: "60 x 180 सेमी" },
    image: productCraft,
    producerId: "sunita",
    stock: 6,
    story: {
      en: "Woven on a pit loom over eleven days in vegetable-dyed cotton yarn.",
      hi: "ग्यारह दिन में गड्ढे वाले करघे पर सब्ज़ी रंगों की सूती धागे से बुनी।",
    },
    status: "approved",
  },
  {
    id: "p6",
    name: { en: "Mirror-work Sling Bag", hi: "शीशा कढ़ाई स्लिंग बैग" },
    category: "handicraft",
    price: 890,
    unit: { en: "1 piece", hi: "1 पीस" },
    image: productCraft,
    producerId: "sunita",
    stock: 14,
    story: {
      en: "Hand-embroidered with mirror discs on block-printed cotton, lined with khadi.",
      hi: "ब्लॉक प्रिंट सूती कपड़े पर हाथ की शीशा कढ़ाई, अंदर खादी की लाइनिंग।",
    },
    status: "approved",
  },
  {
    id: "p7",
    name: { en: "Terracotta Water Kujo", hi: "टेराकोटा कूजो" },
    category: "handicraft",
    price: 650,
    unit: { en: "3 litre", hi: "3 लीटर" },
    image: productCraft,
    producerId: "kumkum",
    stock: 9,
    story: {
      en: "Thrown on a foot wheel from riverbed clay and fired in a village kiln.",
      hi: "नदी की मिट्टी से पैर के चाक पर बनाया और गाँव के भट्टे में पकाया।",
    },
    status: "approved",
  },
  {
    id: "p8",
    name: { en: "Mandana Painted Cloth", hi: "माँडना चित्रित कपड़ा" },
    category: "handicraft",
    price: 1200,
    unit: { en: "70 x 70 cm", hi: "70 x 70 सेमी" },
    image: productCraft,
    producerId: "leela",
    stock: 4,
    story: {
      en: "Traditional Mandana motifs painted with lime and geru on handspun cloth.",
      hi: "हाथ से बुने कपड़े पर चूने और गेरू से पारंपरिक माँडना।",
    },
    status: "pending",
  },
];

export type Homestay = {
  id: string;
  name: Bi;
  villageId: string;
  hostId: string;
  price: number;
  image: string;
  rooms: number;
  includes: Bi[];
  status: Status;
};

export const homestays: Homestay[] = [
  {
    id: "h1",
    name: { en: "Khejri Mud House", hi: "खेजड़ी मिट्टी घर" },
    villageId: "bishnoi",
    hostId: "kumkum",
    price: 1400,
    image: homestay1,
    rooms: 2,
    includes: [
      { en: "Home-cooked meals", hi: "घर का खाना" },
      { en: "Pottery session", hi: "मिट्टी कला सत्र" },
    ],
    status: "approved",
  },
  {
    id: "h2",
    name: { en: "Weaver's Courtyard", hi: "बुनकर का आँगन" },
    villageId: "salawas",
    hostId: "sunita",
    price: 1750,
    image: homestay1,
    rooms: 3,
    includes: [
      { en: "Loom demo", hi: "करघा प्रदर्शन" },
      { en: "Breakfast", hi: "नाश्ता" },
    ],
    status: "approved",
  },
  {
    id: "h3",
    name: { en: "Dune View Haveli", hi: "धोरा व्यू हवेली" },
    villageId: "raisar",
    hostId: "kamla",
    price: 2100,
    image: homestay1,
    rooms: 4,
    includes: [
      { en: "Sunset dune walk", hi: "धोरों पर सूर्यास्त" },
      { en: "Dinner", hi: "रात का भोजन" },
    ],
    status: "approved",
  },
  {
    id: "h4",
    name: { en: "Aravalli Stone Home", hi: "अरावली पत्थर घर" },
    villageId: "kotra",
    hostId: "leela",
    price: 1150,
    image: homestay1,
    rooms: 2,
    includes: [
      { en: "Millet thali", hi: "बाजरे की थाली" },
      { en: "Hill trail", hi: "पहाड़ी पगडंडी" },
    ],
    status: "pending",
  },
];

export type Experience = {
  id: string;
  name: Bi;
  villageId: string;
  hostId: string;
  price: number;
  duration: Bi;
  image: string;
  status: Status;
};

export const experiences: Experience[] = [
  {
    id: "e1",
    name: { en: "Pottery with Kumkum Devi", hi: "कुमकुम देवी के साथ मिट्टी कला" },
    villageId: "bishnoi",
    hostId: "kumkum",
    price: 450,
    duration: { en: "2 hours", hi: "2 घंटे" },
    image: maker1,
    status: "approved",
  },
  {
    id: "e2",
    name: { en: "Papad rolling morning", hi: "पापड़ बेलने की सुबह" },
    villageId: "raisar",
    hostId: "kamla",
    price: 350,
    duration: { en: "3 hours", hi: "3 घंटे" },
    image: productPapad,
    status: "approved",
  },
  {
    id: "e3",
    name: { en: "Dhurrie weaving workshop", hi: "दरी बुनाई कार्यशाला" },
    villageId: "salawas",
    hostId: "sunita",
    price: 600,
    duration: { en: "Half day", hi: "आधा दिन" },
    image: productCraft,
    status: "approved",
  },
  {
    id: "e4",
    name: { en: "Manganiyar folk evening", hi: "मांगणियार लोक संध्या" },
    villageId: "napasar",
    hostId: "geeta",
    price: 300,
    duration: { en: "90 minutes", hi: "90 मिनट" },
    image: villageBikaner,
    status: "approved",
  },
];

export const journeySteps: { title: Bi; note: Bi; icon: string }[] = [
  {
    title: { en: "Discover a village", hi: "गाँव खोजें" },
    note: { en: "Browse by district, craft or experience.", hi: "ज़िला, शिल्प या अनुभव से खोजें।" },
    icon: "compass",
  },
  {
    title: { en: "Book an experience", hi: "अनुभव बुक करें" },
    note: { en: "Homestay, workshop or folk evening.", hi: "होमस्टे, कार्यशाला या लोक संध्या।" },
    icon: "calendar",
  },
  {
    title: { en: "Meet the artisan", hi: "कारीगर से मिलें" },
    note: { en: "Sit in her courtyard, learn the craft.", hi: "उनके आँगन में बैठें, शिल्प सीखें।" },
    icon: "handshake",
  },
  {
    title: { en: "Buy direct", hi: "सीधे खरीदें" },
    note: { en: "No middlemen, fair price to her.", hi: "बिचौलिये नहीं, उन्हें पूरा दाम।" },
    icon: "bag",
  },
  {
    title: { en: "Follow the producer", hi: "प्रोड्यूसर फॉलो करें" },
    note: { en: "Stay connected after the trip.", hi: "यात्रा के बाद भी जुड़े रहें।" },
    icon: "heart",
  },
  {
    title: { en: "Re-order from home", hi: "घर से दोबारा ऑर्डर" },
    note: { en: "Shelf-stable goods shipped to you.", hi: "टिकाऊ सामान सीधे आपके घर।" },
    icon: "repeat",
  },
];

export const getVillage = (id: string) => villages.find((v) => v.id === id);
export const getProducer = (id: string) => producers.find((p) => p.id === id);
export const getProduct = (id: string) => products.find((p) => p.id === id);
export const districtName = (id: string) =>
  districts.find((d) => d.id === id)?.name ?? { en: id, hi: id };
