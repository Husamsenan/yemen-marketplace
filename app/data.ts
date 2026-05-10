export type Listing = {
  id: string;
  title: string;
  titleEn: string;
  price: string;
  city: string;
  category: string;
  image: string;
  seller: string;
  verified: boolean;
  premium?: boolean;
  description: string;
  posted: string;
  whatsapp: string;
  status?: "active" | "pending" | "rejected";
  views?: number;
};

export const cities = ["صنعاء", "عدن", "تعز", "الحديدة", "إب", "حضرموت", "المكلا", "ذمار"];

export const categories = [
  { name: "سيارات", en: "Cars", icon: "🚗" },
  { name: "هواتف", en: "Phones", icon: "📱" },
  { name: "عقارات", en: "Real Estate", icon: "🏠" },
  { name: "وظائف", en: "Jobs", icon: "💼" },
  { name: "إلكترونيات", en: "Electronics", icon: "💻" },
  { name: "طاقة شمسية", en: "Solar", icon: "☀️" },
  { name: "أثاث", en: "Furniture", icon: "🪑" },
  { name: "خدمات", en: "Services", icon: "🛠️" }
];

export const listings: Listing[] = [
  {
    id: "solar-01",
    title: "منظومة طاقة شمسية 5 كيلو",
    titleEn: "5 kW solar system",
    price: "1,250,000 ريال",
    city: "صنعاء",
    category: "طاقة شمسية",
    image:
      "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=900&q=70",
    seller: "شركة النور للطاقة",
    verified: true,
    premium: true,
    description:
      "نظام كامل مع ألواح، انفرتر وبطاريات مناسبة للمنازل والمتاجر. يشمل فحص وتركيب داخل صنعاء.",
    posted: "اليوم",
    whatsapp: "967700000000",
    status: "active",
    views: 324
  },
  {
    id: "car-01",
    title: "تويوتا كورولا 2014 نظيفة",
    titleEn: "Toyota Corolla 2014",
    price: "6,800 دولار",
    city: "عدن",
    category: "سيارات",
    image:
      "https://images.unsplash.com/photo-1542362567-b07e54358753?auto=format&fit=crop&w=900&q=70",
    seller: "أحمد علي",
    verified: true,
    description: "سيارة بحالة ممتازة، جمارك، فحص كامل، استخدام شخصي وبدون حوادث.",
    posted: "قبل ساعتين",
    whatsapp: "967711111111",
    status: "active",
    views: 188
  },
  {
    id: "phone-01",
    title: "آيفون 13 برو 256 جيجا",
    titleEn: "iPhone 13 Pro 256 GB",
    price: "460 دولار",
    city: "تعز",
    category: "هواتف",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=70",
    seller: "متجر التقنية",
    verified: false,
    description: "جهاز نظيف، بطارية جيدة، مع الشاحن والكرتون. قابل للتفاوض البسيط.",
    posted: "أمس",
    whatsapp: "967722222222",
    status: "pending",
    views: 91
  },
  {
    id: "home-01",
    title: "شقة للإيجار قرب الجامعة",
    titleEn: "Apartment near university",
    price: "180,000 ريال / شهر",
    city: "إب",
    category: "عقارات",
    image:
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=900&q=70",
    seller: "مكتب السكن",
    verified: true,
    premium: true,
    description: "ثلاث غرف وصالة، مطبخ، حمامين، ماء متوفر وموقع قريب من الخدمات.",
    posted: "قبل 3 أيام",
    whatsapp: "967733333333",
    status: "active",
    views: 216
  }
];

export const databaseTables = [
  "users(id, name, phone, email, city, avatar_url, verified, language, created_at)",
  "listings(id, user_id, category_id, title, description, price, city, status, premium_until, created_at)",
  "listing_images(id, listing_id, url, sort_order)",
  "categories(id, name_ar, name_en, slug)",
  "favorites(user_id, listing_id, created_at)",
  "messages(id, conversation_id, sender_id, body, image_url, read_at, created_at)",
  "conversations(id, listing_id, buyer_id, seller_id, updated_at)",
  "reports(id, listing_id, reporter_id, reason, details, status, created_at)",
  "payments(id, user_id, listing_id, plan, amount, provider, status, created_at)",
  "push_subscriptions(id, user_id, endpoint, keys, created_at)"
];

export const apiRoutes = [
  "POST /api/auth/register",
  "POST /api/auth/login",
  "GET /api/listings?city=&category=&q=&min=&max=",
  "POST /api/listings",
  "POST /api/listings/:id/images",
  "GET /api/listings/:id",
  "POST /api/listings/:id/favorite",
  "POST /api/listings/:id/report",
  "GET /api/conversations",
  "POST /api/conversations/:id/messages",
  "POST /api/payments/premium",
  "GET /api/admin/overview",
  "PATCH /api/admin/listings/:id/moderate"
];
