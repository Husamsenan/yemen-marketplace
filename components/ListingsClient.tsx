"use client";

import { useMemo, useState } from "react";
import type React from "react";
import { categories, cities } from "@/app/data";
import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { MobileNav } from "@/components/MobileNav";
import { Icon } from "@/components/Icons";
import { useMarketplace } from "@/components/MarketplaceProvider";

export function ListingsClient() {
  const { listings, addListing, language, user } = useMarketplace();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("premium");
  const [toast, setToast] = useState("");
  const [preview, setPreview] = useState<string>("");
  const [form, setForm] = useState({
    title: "",
    price: "",
    city: cities[0],
    category: categories[0].name,
    description: "",
    whatsapp: "967700000000"
  });

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return listings
      .filter((listing) => listing.status !== "rejected")
      .filter((listing) => city === "all" || listing.city === city)
      .filter((listing) => category === "all" || listing.category === category)
      .filter((listing) => {
        if (!normalizedQuery) return true;
        return [listing.title, listing.titleEn, listing.description, listing.seller]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => {
        if (sort === "premium") return Number(Boolean(b.premium)) - Number(Boolean(a.premium));
        if (sort === "views") return (b.views ?? 0) - (a.views ?? 0);
        return b.id.localeCompare(a.id);
      });
  }, [category, city, listings, query, sort]);

  function readImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
  }

  function submitListing(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) {
      setToast("يجب إنشاء حساب وتأكيد البريد الإلكتروني قبل نشر إعلان.");
      return;
    }
    if (!form.title || !form.price || !form.description) {
      setToast("يرجى تعبئة العنوان والسعر والوصف.");
      return;
    }
    addListing({ ...form, image: preview });
    setToast("تم نشر الإعلان محليا وإرساله للمراجعة.");
    setForm({ title: "", price: "", city: cities[0], category: categories[0].name, description: "", whatsapp: "967700000000" });
    setPreview("");
  }

  return (
    <main className="min-h-screen pb-24 dark:bg-slate-950">
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5">
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">
            {language === "ar" ? "الإعلانات" : "Listings"}
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {language === "ar" ? "بحث سريع، فلاتر واضحة، وبطاقات خفيفة مناسبة للاتصال البطيء." : "Fast search, useful filters, and lightweight listing cards."}
          </p>
        </div>

        <div className="sticky top-[65px] z-30 mb-5 rounded-lg border border-slate-200 bg-white p-3 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-3 md:grid-cols-[1fr_160px_170px_140px_110px]">
            <label className="flex min-h-12 items-center gap-2 rounded-lg border border-slate-200 px-3 dark:border-slate-700">
              <Icon name="search" className="h-5 w-5 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="w-full bg-transparent outline-none" placeholder="ابحث عن إعلان..." />
            </label>
            <select value={city} onChange={(event) => setCity(event.target.value)} className="min-h-12 rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
              <option value="all">كل المدن</option>
              {cities.map((item) => <option key={item}>{item}</option>)}
            </select>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="min-h-12 rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
              <option value="all">كل الفئات</option>
              {categories.map((item) => <option key={item.name}>{item.name}</option>)}
            </select>
            <select value={sort} onChange={(event) => setSort(event.target.value)} className="min-h-12 rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
              <option value="premium">المميز أولا</option>
              <option value="views">الأكثر مشاهدة</option>
              <option value="new">الأحدث</option>
            </select>
            <button onClick={() => setQuery("")} className="min-h-12 rounded-lg bg-brand-600 px-5 font-bold text-white">مسح</button>
          </div>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
          <button onClick={() => setCategory("all")} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold ${category === "all" ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"}`}>
            الكل
          </button>
          {categories.map((item) => (
            <button key={item.name} onClick={() => setCategory(item.name)} className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold ${category === item.name ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900"}`}>
              {item.icon} {item.name}
            </button>
          ))}
        </div>

        {toast ? (
          <div className="mb-5 rounded-lg border border-brand-100 bg-brand-50 p-3 font-bold text-brand-700 dark:border-slate-800 dark:bg-slate-900 dark:text-brand-100">
            {toast}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="mb-3 text-sm font-bold text-slate-500">{filtered.length} إعلان</div>
            <div className="grid card-grid gap-4">
              {filtered.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
            </div>
          </div>

          <aside id="new" className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">إنشاء إعلان</h2>
            {!user ? (
              <div className="mt-4 rounded-lg border border-brand-100 bg-brand-50 p-3 text-sm font-bold text-brand-700 dark:border-slate-800 dark:bg-slate-950 dark:text-brand-100">
                تحتاج إلى حساب مؤكد بالبريد الإلكتروني قبل نشر إعلان.
              </div>
            ) : null}
            <form onSubmit={submitListing} className="mt-4 space-y-3">
              <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="min-h-12 w-full rounded-lg border border-slate-200 bg-transparent px-3 dark:border-slate-700" placeholder="عنوان الإعلان" />
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
                {categories.map((item) => <option key={item.name}>{item.name}</option>)}
              </select>
              <select value={form.city} onChange={(event) => setForm({ ...form, city: event.target.value })} className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
                {cities.map((item) => <option key={item}>{item}</option>)}
              </select>
              <input value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} className="min-h-12 w-full rounded-lg border border-slate-200 bg-transparent px-3 dark:border-slate-700" placeholder="السعر" />
              <input value={form.whatsapp} onChange={(event) => setForm({ ...form, whatsapp: event.target.value })} className="min-h-12 w-full rounded-lg border border-slate-200 bg-transparent px-3 dark:border-slate-700" placeholder="رقم واتساب" />
              <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="min-h-28 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-3 dark:border-slate-700" placeholder="الوصف" />
              <label className="flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 text-center text-sm font-bold text-slate-500 dark:border-slate-700">
                {preview ? <img src={preview} alt="" className="mb-3 h-28 w-full rounded-md object-cover" /> : null}
                رفع الصور
                <span className="mt-1 text-xs font-normal">معاينة محلية، ثم WebP/Supabase Storage لاحقا</span>
                <input onChange={readImage} type="file" accept="image/*" className="sr-only" />
              </label>
              <button className="min-h-12 w-full rounded-lg bg-brand-600 font-bold text-white">نشر الإعلان</button>
            </form>
          </aside>
        </div>
      </section>
      <MobileNav />
    </main>
  );
}
