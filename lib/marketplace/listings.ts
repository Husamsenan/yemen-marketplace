export type ListingRow = {
  id: string;
  title: string;
  title_en: string | null;
  description: string;
  price: number | null;
  currency: string;
  whatsapp: string | null;
  status: "active" | "pending" | "rejected" | "draft" | "sold" | "removed";
  premium_until: string | null;
  view_count: number;
  created_at: string;
  categories: { name_ar: string; name_en: string; slug: string } | null;
  cities: { name_ar: string; name_en: string; slug: string } | null;
  profiles: { display_name: string; verified: boolean } | null;
  listing_images: { public_url: string; sort_order: number }[] | null;
};

export const listingSelect =
  "id,title,title_en,description,price,currency,whatsapp,status,premium_until,view_count,created_at,categories(name_ar,name_en,slug),cities(name_ar,name_en,slug),profiles(display_name,verified),listing_images(public_url,sort_order)";

export function mapListingRow(listing: ListingRow) {
  return {
    id: listing.id,
    title: listing.title,
    titleEn: listing.title_en ?? listing.title,
    price: listing.price ? `${Number(listing.price).toLocaleString("en-US")} ${listing.currency}` : "قابل للتفاوض",
    city: listing.cities?.name_ar ?? "",
    category: listing.categories?.name_ar ?? "",
    image:
      listing.listing_images?.sort((a, b) => a.sort_order - b.sort_order)[0]?.public_url ??
      "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=900&q=70",
    seller: listing.profiles?.display_name ?? "مستخدم",
    verified: Boolean(listing.profiles?.verified),
    premium: listing.premium_until ? new Date(listing.premium_until) > new Date() : false,
    description: listing.description,
    posted: new Intl.DateTimeFormat("ar", { dateStyle: "medium" }).format(new Date(listing.created_at)),
    whatsapp: listing.whatsapp ?? "",
    status: listing.status,
    views: listing.view_count
  };
}
