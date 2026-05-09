"use client";

import Link from "next/link";
import { useState } from "react";
import type React from "react";
import { cities } from "@/app/data";
import { Icon } from "./Icons";
import { useMarketplace } from "./MarketplaceProvider";

export function Header() {
  const { darkMode, toggleDarkMode, language, setLanguage, user, login, logout } = useMarketplace();
  const [authOpen, setAuthOpen] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? cities[0]);

  function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login({ name: name || "مستخدم جديد", phone: phone || "967700000000", city, verified: true });
    setAuthOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-600 font-black text-white">ي</span>
            <span>
              <span className="block text-lg font-black text-slate-950 dark:text-white">
                {language === "ar" ? "سوق اليمن" : "Yemen Market"}
              </span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">
                {language === "ar" ? "Yemen Marketplace" : "سوق اليمن"}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <Link className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800" href="/listings">
              {language === "ar" ? "الإعلانات" : "Listings"}
            </Link>
            <Link className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800" href="/profile">
              {language === "ar" ? "حسابي" : "Profile"}
            </Link>
            <Link className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800" href="/admin">
              {language === "ar" ? "الإدارة" : "Admin"}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="grid h-10 min-w-10 place-items-center rounded-lg border border-slate-200 px-2 text-sm font-black dark:border-slate-700"
              aria-label="تغيير اللغة"
            >
              {language === "ar" ? "EN" : "AR"}
            </button>
            <button
              onClick={toggleDarkMode}
              className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 dark:border-slate-700"
              aria-label="الوضع الليلي"
              title={darkMode ? "Light mode" : "Dark mode"}
            >
              <Icon name="moon" />
            </button>
            <button
              onClick={() => {
                if (user) {
                  logout();
                  return;
                }
                setAuthOpen(true);
              }}
              className="hidden h-10 items-center rounded-lg border border-slate-200 px-3 text-sm font-bold dark:border-slate-700 sm:flex"
            >
              {user ? (language === "ar" ? "خروج" : "Logout") : language === "ar" ? "دخول" : "Login"}
            </button>
            <Link href="/listings#new" className="flex h-10 items-center gap-2 rounded-lg bg-brand-600 px-4 text-sm font-bold text-white">
              <Icon name="plus" className="h-4 w-4" />
              <span className="hidden sm:inline">{language === "ar" ? "أضف إعلان" : "Post"}</span>
            </Link>
          </div>
        </div>
      </header>

      {authOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4">
          <form onSubmit={submitAuth} className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-soft dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">تسجيل الدخول</h2>
              <button type="button" onClick={() => setAuthOpen(false)} className="rounded-lg border border-slate-200 px-3 py-1 font-bold dark:border-slate-700">
                إغلاق
              </button>
            </div>
            <div className="space-y-3">
              <input value={name} onChange={(event) => setName(event.target.value)} className="min-h-12 w-full rounded-lg border border-slate-200 bg-transparent px-3 dark:border-slate-700" placeholder="الاسم" />
              <input value={phone} onChange={(event) => setPhone(event.target.value)} className="min-h-12 w-full rounded-lg border border-slate-200 bg-transparent px-3 dark:border-slate-700" placeholder="رقم الهاتف" />
              <select value={city} onChange={(event) => setCity(event.target.value)} className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
                {cities.map((item) => <option key={item}>{item}</option>)}
              </select>
              <button className="min-h-12 w-full rounded-lg bg-brand-600 font-bold text-white">
                دخول / إنشاء حساب
              </button>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              Demo محلية: يتم حفظ الحساب في localStorage. لاحقا يتم استبدالها بـ Supabase OTP.
            </p>
          </form>
        </div>
      ) : null}
    </>
  );
}
