import Link from "next/link";
import { apiRoutes, categories, databaseTables, listings } from "./data";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { MobileNav } from "@/components/MobileNav";
import { Icon } from "@/components/Icons";

const stats = [
  ["14k+", "إعلان نشط"],
  ["8", "مدن رئيسية"],
  ["24/7", "مراقبة بلاغات"],
  ["PWA", "تعمل دون اتصال"]
];

const features = [
  "تسجيل ودخول برقم الهاتف أو البريد",
  "رفع صور مضغوطة وسريعة التحميل",
  "محادثات فورية وتنبيهات Push",
  "مفضلة ومشاركة مباشرة عبر واتساب",
  "حسابات موثقة ومراجعة بلاغات الاحتيال",
  "دعم عربي RTL وإنجليزي LTR"
];

export default function Home() {
  return (
    <main className="min-h-screen pb-24 dark:bg-slate-950">
      <Header />
      <section className="bg-white dark:bg-slate-950">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-[1.05fr_0.95fr] md:items-center md:py-14">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-brand-50 px-3 py-2 text-sm font-bold text-brand-700 dark:border-slate-800 dark:bg-slate-900 dark:text-brand-100">
              <Icon name="shield" className="h-4 w-4" />
              منصة إعلانات يمنية موثوقة وسريعة
            </div>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-black leading-tight text-slate-950 md:text-6xl dark:text-white">
                سوق اليمن
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
                بيع وشراء السيارات، الهواتف، العقارات، الوظائف، الطاقة الشمسية والأثاث بتجربة بسيطة تعمل بسرعة على الهواتف والإنترنت الضعيف.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/listings" className="flex min-h-12 items-center justify-center gap-2 rounded-lg bg-brand-600 px-6 font-bold text-white">
                <Icon name="search" />
                تصفح الإعلانات
              </Link>
              <Link href="/listings#new" className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-6 font-bold text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                <Icon name="plus" />
                انشر إعلانك
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <p className="text-xl font-black text-slate-950 dark:text-white">{value}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="rounded-lg bg-white p-3 dark:bg-slate-950">
              <div className="mb-3 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 dark:border-slate-800 dark:bg-slate-900">
                <Icon name="search" className="h-5 w-5 text-slate-400" />
                <span className="text-sm text-slate-500">ابحث عن سيارة، هاتف، شقة...</span>
              </div>
              <div className="grid gap-3">
                {listings.slice(0, 3).map((listing) => (
                  <div key={listing.id} className="flex gap-3 rounded-lg border border-slate-100 p-2 dark:border-slate-800">
                    <img src={listing.image} alt="" className="h-20 w-24 rounded-md object-cover" loading="lazy" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-950 dark:text-white">{listing.title}</p>
                      <p className="font-extrabold text-brand-700 dark:text-brand-100">{listing.price}</p>
                      <p className="text-sm text-slate-500">{listing.city} · {listing.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-5 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-950 dark:text-white">الفئات</h2>
            <p className="text-slate-500 dark:text-slate-400">تنقل سريع حسب احتياج المستخدم اليومي.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {categories.map((category) => (
            <Link key={category.name} href={`/listings?category=${category.en}`} className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <span className="text-2xl" aria-hidden>{category.icon}</span>
              <span className="mt-2 block font-bold text-slate-950 dark:text-white">{category.name}</span>
              <span className="text-xs text-slate-500">{category.en}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">إعلانات مميزة</h2>
          <Link href="/listings" className="font-bold text-brand-700 dark:text-brand-100">عرض الكل</Link>
        </div>
        <div className="grid card-grid gap-4">
          {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-8 lg:grid-cols-3">
        <InfoPanel title="تصميم وتجربة المستخدم" items={features} />
        <InfoPanel title="هيكل قاعدة البيانات" items={databaseTables} code />
        <InfoPanel title="API قابلة للتوسع" items={apiRoutes} code />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">نموذج الربح</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-4">
            {["إعلانات مميزة لمدة 7/30 يوم", "اشتراكات للمتاجر والبائعين", "رسوم اختيارية على التحقق", "إعلانات محلية غير مزعجة"].map((item) => (
              <div key={item} className="rounded-lg bg-slate-50 p-4 font-semibold text-slate-700 dark:bg-slate-950 dark:text-slate-200">{item}</div>
            ))}
          </div>
        </div>
      </section>
      <MobileNav />
    </main>
  );
}

function InfoPanel({ title, items, code = false }: { title: string; items: string[]; code?: boolean }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-xl font-black text-slate-950 dark:text-white">{title}</h2>
      <div className="mt-4 space-y-2">
        {items.map((item) => (
          <p key={item} className={`rounded-md bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-950 dark:text-slate-300 ${code ? "font-mono text-left direction-ltr" : ""}`}>
            {item}
          </p>
        ))}
      </div>
    </div>
  );
}
