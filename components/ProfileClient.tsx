"use client";

import { Header } from "@/components/Header";
import { ListingCard } from "@/components/ListingCard";
import { MobileNav } from "@/components/MobileNav";
import { Icon } from "@/components/Icons";
import { useMarketplace } from "@/components/MarketplaceProvider";

export function ProfileClient() {
  const { listings, favorites, messages, user, promoteListing } = useMarketplace();
  const favoriteListings = listings.filter((listing) => favorites.includes(listing.id));
  const myListings = listings.filter((listing) => listing.seller === user?.name);
  const latestChats = messages.slice(-6).reverse();

  return (
    <main className="min-h-screen pb-24 dark:bg-slate-950">
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center gap-3">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-brand-50 text-3xl font-black text-brand-700 dark:bg-slate-950 dark:text-brand-100">
                  {(user?.name ?? "ز").slice(0, 1)}
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-950 dark:text-white">{user?.name ?? "زائر"}</h1>
                  <p className="flex items-center gap-1 text-sm text-slate-500">
                    {user?.verified ? <Icon name="shield" className="h-4 w-4 text-brand-600" /> : null}
                    {user?.verified ? "بائع موثق" : "سجل الدخول للتوثيق"}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <Metric value={String(myListings.length)} label="إعلاناتي" />
                <Metric value={String(favorites.length)} label="مفضلة" />
                <Metric value={String(messages.length)} label="رسائل" />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">الإعدادات</h2>
              <div className="mt-4 space-y-3">
                {[`المدينة الافتراضية: ${user?.city ?? "غير محددة"}`, "تنبيهات Push جاهزة للتفعيل", "PWA تعمل كتطبيق مثبت", "Offline cache للبيانات الأخيرة"].map((item) => (
                  <div key={item} className="rounded-md bg-slate-50 p-3 text-sm font-semibold text-slate-600 dark:bg-slate-950 dark:text-slate-300">{item}</div>
                ))}
              </div>
            </div>
          </aside>

          <div className="space-y-5">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-950 dark:text-white">المحادثات</h2>
                <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-bold text-brand-700 dark:bg-slate-950 dark:text-brand-100">Realtime Demo</span>
              </div>
              <div className="grid gap-3 md:grid-cols-3">
                {latestChats.map((message) => {
                  const listing = listings.find((item) => item.id === message.listingId);
                  return (
                    <a key={message.id} href={`/listings/${message.listingId}`} className="rounded-lg border border-slate-200 p-4 text-right dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-950 dark:text-white">{listing?.seller ?? "محادثة"}</span>
                        <span className="text-xs text-slate-400">{message.at}</span>
                      </div>
                      <p className="mt-2 truncate text-sm text-slate-500">{message.body}</p>
                    </a>
                  );
                })}
              </div>
            </div>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-950 dark:text-white">إعلاناتي</h2>
                <button onClick={() => myListings[0] && promoteListing(myListings[0].id)} className="rounded-lg border border-slate-200 px-4 py-2 font-bold dark:border-slate-700">ترقية أول إعلان</button>
              </div>
              <div className="grid card-grid gap-4">
                {(myListings.length ? myListings : listings.slice(0, 3)).map((listing) => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-black text-slate-950 dark:text-white">المفضلة</h2>
              <div className="grid card-grid gap-4">
                {favoriteListings.length ? favoriteListings.map((listing) => <ListingCard key={listing.id} listing={listing} />) : (
                  <div className="rounded-lg border border-slate-200 bg-white p-5 text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                    لم تحفظ أي إعلان بعد.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </section>
      <MobileNav />
    </main>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
      <p className="font-black text-slate-950 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500">{label}</p>
    </div>
  );
}
