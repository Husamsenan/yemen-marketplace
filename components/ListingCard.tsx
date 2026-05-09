"use client";

import Link from "next/link";
import type { Listing } from "@/app/data";
import { Icon } from "./Icons";
import { useMarketplace } from "./MarketplaceProvider";

export function ListingCard({ listing }: { listing: Listing }) {
  const { favorites, toggleFavorite, promoteListing } = useMarketplace();
  const isFavorite = favorites.includes(listing.id);

  return (
    <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-soft transition hover:-translate-y-0.5 hover:border-brand-100 dark:border-slate-800 dark:bg-slate-900">
      <Link href={`/listings/${listing.id}`} className="block">
        <div className="relative aspect-[4/3] bg-slate-100">
          <img src={listing.image} alt={listing.title} className="h-full w-full object-cover" loading="lazy" />
          {listing.premium ? (
            <span className="absolute right-3 top-3 rounded-md bg-brand-600 px-2 py-1 text-xs font-bold text-white">
              مميز
            </span>
          ) : null}
          {listing.status === "pending" ? (
            <span className="absolute left-3 top-3 rounded-md bg-amber-500 px-2 py-1 text-xs font-bold text-white">
              قيد المراجعة
            </span>
          ) : null}
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <Link href={`/listings/${listing.id}`} className="font-bold text-slate-950 dark:text-white">
              {listing.title}
            </Link>
            <button
              onClick={() => toggleFavorite(listing.id)}
              className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border text-slate-500 dark:border-slate-700 ${isFavorite ? "border-red-200 bg-red-50 text-red-600" : "border-slate-200"}`}
              aria-label="حفظ"
            >
              <Icon name="heart" className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1 text-lg font-extrabold text-brand-700 dark:text-brand-100">{listing.price}</p>
        </div>
        <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
          <span>{listing.category}</span>
          <span className="flex items-center gap-1">
            <Icon name="map" className="h-4 w-4" />
            {listing.city}
          </span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm dark:border-slate-800">
          <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
            {listing.verified ? <Icon name="shield" className="h-4 w-4 text-brand-600" /> : null}
            {listing.seller}
          </span>
          <button onClick={() => promoteListing(listing.id)} className="rounded-md bg-brand-50 px-2 py-1 text-xs font-bold text-brand-700 dark:bg-slate-950 dark:text-brand-100">
            Premium
          </button>
        </div>
      </div>
    </article>
  );
}
