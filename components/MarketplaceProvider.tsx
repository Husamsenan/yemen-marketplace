"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type React from "react";
import { listings as seedListings, type Listing } from "@/app/data";

type User = {
  name: string;
  phone: string;
  city: string;
  verified: boolean;
};

type Message = {
  id: string;
  listingId: string;
  from: "me" | "seller";
  body: string;
  at: string;
};

type Report = {
  id: string;
  listingId: string;
  reason: string;
  details: string;
  status: "open" | "reviewed";
};

type ListingDraft = {
  title: string;
  titleEn?: string;
  price: string;
  city: string;
  category: string;
  description: string;
  whatsapp: string;
  image?: string;
};

type MarketplaceContextValue = {
  listings: Listing[];
  favorites: string[];
  reports: Report[];
  messages: Message[];
  user: User | null;
  language: "ar" | "en";
  darkMode: boolean;
  login: (user: User) => void;
  logout: () => void;
  setLanguage: (language: "ar" | "en") => void;
  toggleDarkMode: () => void;
  toggleFavorite: (listingId: string) => void;
  addListing: (draft: ListingDraft) => Listing;
  sendMessage: (listingId: string, body: string) => void;
  reportListing: (listingId: string, reason: string, details: string) => void;
  promoteListing: (listingId: string) => void;
  moderateListing: (listingId: string, status: "active" | "rejected") => void;
};

const MarketplaceContext = createContext<MarketplaceContextValue | null>(null);
const STORAGE_VERSION = 2;

const fallbackUser: User = {
  name: "محمد السناني",
  phone: "967700123456",
  city: "صنعاء",
  verified: true
};

export function MarketplaceProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(seedListings);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    { id: "m1", listingId: "solar-01", from: "seller", body: "النظام متوفر ويمكن معاينته اليوم.", at: "12:40" },
    { id: "m2", listingId: "car-01", from: "seller", body: "السيارة موجودة في كريتر.", at: "أمس" }
  ]);
  const [user, setUser] = useState<User | null>(fallbackUser);
  const [language, setLanguageState] = useState<"ar" | "en">("ar");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("ymarket-state");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as Partial<{
        version: number;
        listings: Listing[];
        favorites: string[];
        reports: Report[];
        messages: Message[];
        user: User | null;
        language: "ar" | "en";
        darkMode: boolean;
      }>;
      if (parsed.version !== STORAGE_VERSION) {
        window.localStorage.removeItem("ymarket-state");
        return;
      }
      setListings(parsed.listings?.length ? parsed.listings : seedListings);
      setFavorites(parsed.favorites ?? []);
      setReports(parsed.reports ?? []);
      setMessages(parsed.messages?.length ? parsed.messages : messages);
      setUser(parsed.user ?? fallbackUser);
      setLanguageState(parsed.language ?? "ar");
      setDarkMode(Boolean(parsed.darkMode));
    } catch {
      window.localStorage.removeItem("ymarket-state");
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [darkMode, language]);

  useEffect(() => {
    window.localStorage.setItem(
      "ymarket-state",
      JSON.stringify({ version: STORAGE_VERSION, listings, favorites, reports, messages, user, language, darkMode })
    );
  }, [listings, favorites, reports, messages, user, language, darkMode]);

  const value = useMemo<MarketplaceContextValue>(
    () => ({
      listings,
      favorites,
      reports,
      messages,
      user,
      language,
      darkMode,
      login: (nextUser) => setUser(nextUser),
      logout: () => setUser(null),
      setLanguage: setLanguageState,
      toggleDarkMode: () => setDarkMode((current) => !current),
      toggleFavorite: (listingId) =>
        setFavorites((current) =>
          current.includes(listingId) ? current.filter((id) => id !== listingId) : [...current, listingId]
        ),
      addListing: (draft) => {
        const listing: Listing = {
          id: `local-${Date.now()}`,
          title: draft.title,
          titleEn: draft.titleEn || draft.title,
          price: draft.price,
          city: draft.city,
          category: draft.category,
          image:
            draft.image ||
            "https://images.unsplash.com/photo-1556155092-490a1ba16284?auto=format&fit=crop&w=900&q=70",
          seller: user?.name ?? "مستخدم جديد",
          verified: Boolean(user?.verified),
          description: draft.description,
          posted: "الآن",
          whatsapp: draft.whatsapp,
          status: "pending",
          views: 0
        };
        setListings((current) => [listing, ...current]);
        return listing;
      },
      sendMessage: (listingId, body) => {
        if (!body.trim()) return;
        const message: Message = {
          id: `msg-${Date.now()}`,
          listingId,
          from: "me",
          body: body.trim(),
          at: "الآن"
        };
        const reply: Message = {
          id: `msg-reply-${Date.now()}`,
          listingId,
          from: "seller",
          body: "شكرا لتواصلك. سأرد عليك بالتفاصيل قريبا.",
          at: "الآن"
        };
        setMessages((current) => [...current, message, reply]);
      },
      reportListing: (listingId, reason, details) =>
        setReports((current) => [
          { id: `report-${Date.now()}`, listingId, reason, details, status: "open" },
          ...current
        ]),
      promoteListing: (listingId) =>
        setListings((current) =>
          current.map((listing) => (listing.id === listingId ? { ...listing, premium: true } : listing))
        ),
      moderateListing: (listingId, status) =>
        setListings((current) =>
          current.map((listing) => (listing.id === listingId ? { ...listing, status } : listing))
        )
    }),
    [darkMode, favorites, language, listings, messages, reports, user]
  );

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
}

export function useMarketplace() {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used inside MarketplaceProvider");
  }
  return context;
}
