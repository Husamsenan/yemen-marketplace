"use client";

import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { Icon } from "@/components/Icons";
import { useMarketplace } from "@/components/MarketplaceProvider";

export function AdminClient() {
  const { listings, reports, moderateListing, promoteListing } = useMarketplace();
  const pending = listings.filter((listing) => listing.status === "pending").length;
  const premium = listings.filter((listing) => listing.premium).length;
  const verified = listings.filter((listing) => listing.verified).length;

  return (
    <main className="min-h-screen pb-24 dark:bg-slate-950">
      <Header />
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black text-slate-950 dark:text-white">لوحة الإدارة</h1>
            <p className="mt-2 text-slate-500 dark:text-slate-400">مراقبة المحتوى، البلاغات، المدفوعات والأداء.</p>
          </div>
          <button className="flex min-h-12 items-center gap-2 rounded-lg bg-brand-600 px-5 font-bold text-white">
            <Icon name="gauge" />
            تقرير اليوم
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Metric label="بلاغات جديدة" value={String(reports.filter((report) => report.status === "open").length)} detail="Fraud, spam, duplicates" />
          <Metric label="بانتظار المراجعة" value={String(pending)} detail="Seller and image checks" />
          <Metric label="إعلانات Premium" value={String(premium)} detail="Revenue driver" />
          <Metric label="بائعون موثقون" value={String(verified)} detail="Trust layer" />
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="rounded-lg border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-200 p-5 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">مراجعة الإعلانات</h2>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {listings.map((listing) => (
                <div key={listing.id} className="grid gap-3 p-4 md:grid-cols-[1fr_140px_240px] md:items-center">
                  <div>
                    <p className="font-bold text-slate-950 dark:text-white">{listing.title}</p>
                    <p className="text-sm text-slate-500">{listing.city} · {listing.seller} · {listing.price}</p>
                  </div>
                  <span className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${listing.status === "active" ? "bg-green-50 text-green-700" : listing.status === "rejected" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>
                    {listing.status === "active" ? "نشط" : listing.status === "rejected" ? "مرفوض" : "قيد المراجعة"}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => moderateListing(listing.id, "active")} className="min-h-10 flex-1 rounded-lg bg-brand-600 px-3 text-sm font-bold text-white">قبول</button>
                    <button onClick={() => moderateListing(listing.id, "rejected")} className="min-h-10 flex-1 rounded-lg border border-red-200 px-3 text-sm font-bold text-red-600 dark:border-red-900">رفض</button>
                    <button onClick={() => promoteListing(listing.id)} className="min-h-10 flex-1 rounded-lg border border-slate-200 px-3 text-sm font-bold dark:border-slate-700">Premium</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">بلاغات المستخدمين</h2>
              <div className="mt-4 space-y-3">
                {reports.length ? reports.map((report) => {
                  const listing = listings.find((item) => item.id === report.listingId);
                  return (
                    <div key={report.id} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
                      <p className="font-bold text-slate-950 dark:text-white">{listing?.title ?? report.listingId}</p>
                      <p className="text-sm text-slate-500">{report.reason} · {report.details || "بدون تفاصيل"}</p>
                    </div>
                  );
                }) : <p className="text-sm text-slate-500">لا توجد بلاغات حاليا.</p>}
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">الأداء</h2>
              <div className="mt-4 space-y-3">
                <Bar label="LCP أقل من 2.5s" value="86%" width="86%" />
                <Bar label="صور WebP مضغوطة" value="94%" width="94%" />
                <Bar label="طلبات API من الكاش" value="71%" width="71%" />
              </div>
            </div>
          </aside>
        </div>
      </section>
      <MobileNav />
    </main>
  );
}

function Metric({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{value}</p>
      <p className="mt-2 text-xs text-slate-400">{detail}</p>
    </div>
  );
}

function Bar({ label, value, width }: { label: string; value: string; width: string }) {
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-semibold text-slate-600 dark:text-slate-300">{label}</span>
        <span className="font-bold text-brand-700 dark:text-brand-100">{value}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-950">
        <div className="h-2 rounded-full bg-brand-600" style={{ width }} />
      </div>
    </div>
  );
}
