"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { Icon } from "@/components/Icons";
import { useMarketplace } from "@/components/MarketplaceProvider";

export function ListingDetailClient({ id }: { id: string }) {
  const { listings, favorites, toggleFavorite, sendMessage, messages, reportListing, promoteListing } = useMarketplace();
  const listing = listings.find((item) => item.id === id) ?? listings[0];
  const [chatBody, setChatBody] = useState("");
  const [reportReason, setReportReason] = useState("spam");
  const [reportDetails, setReportDetails] = useState("");
  const [notice, setNotice] = useState("");
  const shareText = encodeURIComponent(`${listing.title} - ${listing.price} http://localhost:3000/listings/${listing.id}`);
  const listingMessages = useMemo(() => messages.filter((message) => message.listingId === listing.id), [listing.id, messages]);
  const isFavorite = favorites.includes(listing.id);

  function submitMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    sendMessage(listing.id, chatBody);
    setChatBody("");
    setNotice("تم إرسال الرسالة في المحادثة المحلية.");
  }

  function submitReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    reportListing(listing.id, reportReason, reportDetails);
    setReportDetails("");
    setNotice("تم إرسال البلاغ للمراجعة.");
  }

  return (
    <main className="min-h-screen pb-24 dark:bg-slate-950">
      <Header />
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-5">
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-soft md:aspect-[16/9] dark:border-slate-800">
            <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" />
          </div>
          <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-brand-700 dark:text-brand-100">{listing.category} · {listing.city}</p>
                <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{listing.title}</h1>
                <p className="mt-2 text-2xl font-black text-brand-700 dark:text-brand-100">{listing.price}</p>
              </div>
              <button onClick={() => toggleFavorite(listing.id)} className={`grid h-11 w-11 place-items-center rounded-lg border dark:border-slate-700 ${isFavorite ? "border-red-200 bg-red-50 text-red-600" : "border-slate-200"}`} aria-label="حفظ">
                <Icon name="heart" />
              </button>
            </div>
            <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">{listing.description}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Info label="تاريخ النشر" value={listing.posted} />
              <Info label="المشاهدات" value={String(listing.views ?? 0)} />
              <Info label="الحالة" value={listing.premium ? "إعلان مميز" : listing.status === "pending" ? "قيد المراجعة" : "عادي"} />
            </div>
          </article>

          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">محادثة فورية</h2>
            <div className="mt-4 max-h-72 space-y-3 overflow-y-auto rounded-lg bg-slate-50 p-3 dark:bg-slate-950">
              {listingMessages.length ? listingMessages.map((message) => (
                <div key={message.id} className={`max-w-[80%] rounded-lg p-3 text-sm ${message.from === "me" ? "mr-auto bg-brand-600 text-white" : "bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200"}`}>
                  <p>{message.body}</p>
                  <p className="mt-1 text-xs opacity-70">{message.at}</p>
                </div>
              )) : <p className="text-sm text-slate-500">لا توجد رسائل بعد.</p>}
            </div>
            <form onSubmit={submitMessage} className="mt-3 flex gap-2">
              <input value={chatBody} onChange={(event) => setChatBody(event.target.value)} className="min-h-12 flex-1 rounded-lg border border-slate-200 bg-transparent px-3 dark:border-slate-700" placeholder="اكتب رسالة..." />
              <button className="min-h-12 rounded-lg bg-brand-600 px-5 font-bold text-white">إرسال</button>
            </form>
          </section>
        </div>

        <aside className="space-y-4">
          {notice ? <div className="rounded-lg bg-brand-50 p-3 font-bold text-brand-700 dark:bg-slate-900 dark:text-brand-100">{notice}</div> : null}
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-brand-50 text-xl font-black text-brand-700 dark:bg-slate-950 dark:text-brand-100">
                {listing.seller.slice(0, 1)}
              </div>
              <div>
                <h2 className="font-black text-slate-950 dark:text-white">{listing.seller}</h2>
                <p className="flex items-center gap-1 text-sm text-slate-500">
                  {listing.verified ? <Icon name="shield" className="h-4 w-4 text-brand-600" /> : null}
                  {listing.verified ? "بائع موثق" : "غير موثق"}
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3">
              <Link href={`https://wa.me/${listing.whatsapp}?text=${shareText}`} className="flex min-h-12 items-center justify-center rounded-lg bg-green-600 font-bold text-white">
                تواصل عبر واتساب
              </Link>
              <Link href={`https://wa.me/?text=${shareText}`} className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-slate-200 font-bold dark:border-slate-700">
                <Icon name="share" />
                مشاركة الإعلان
              </Link>
              <button onClick={() => promoteListing(listing.id)} className="flex min-h-12 items-center justify-center gap-2 rounded-lg border border-brand-100 bg-brand-50 font-bold text-brand-700 dark:border-slate-800 dark:bg-slate-950 dark:text-brand-100">
                Premium لمدة 7 أيام
              </button>
            </div>
          </div>

          <form onSubmit={submitReport} className="rounded-lg border border-red-200 bg-white p-5 shadow-soft dark:border-red-900 dark:bg-slate-900">
            <h2 className="font-black text-slate-950 dark:text-white">إبلاغ عن مشكلة</h2>
            <select value={reportReason} onChange={(event) => setReportReason(event.target.value)} className="mt-3 min-h-12 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
              <option value="spam">Spam</option>
              <option value="fraud">احتيال</option>
              <option value="duplicate">إعلان مكرر</option>
              <option value="wrong-category">تصنيف خاطئ</option>
            </select>
            <textarea value={reportDetails} onChange={(event) => setReportDetails(event.target.value)} className="mt-3 min-h-24 w-full rounded-lg border border-slate-200 bg-transparent px-3 py-3 dark:border-slate-700" placeholder="تفاصيل اختيارية" />
            <button className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-lg border border-red-200 font-bold text-red-600 dark:border-red-900">
              <Icon name="flag" />
              إرسال البلاغ
            </button>
          </form>
        </aside>
      </section>
      <MobileNav />
    </main>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4 dark:bg-slate-950">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-bold text-slate-950 dark:text-white">{value}</p>
    </div>
  );
}
