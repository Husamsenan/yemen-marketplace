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
  const [mode, setMode] = useState<"login" | "register" | "verify">("login");
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? cities[0]);
  const [code, setCode] = useState("");
  const [pendingName, setPendingName] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submitAuth(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus("");
    try {
      if (mode === "register") {
        const response = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password, phone, city })
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Registration failed");
        setPendingName(name || email.split("@")[0]);
        setPendingEmail(email);
        setMode("verify");
        setStatus(payload.data?.demoCode ? `Demo code: ${payload.data.demoCode}` : "تم إرسال رمز التأكيد إلى بريدك الإلكتروني.");
        return;
      }

      if (mode === "verify") {
        const response = await fetch("/api/auth/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: pendingEmail || email, code })
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error ?? "Verification failed");
        login({
          name: pendingName || name || email.split("@")[0],
          email: pendingEmail || email,
          phone,
          city,
          verified: true,
          accessToken: payload.token
        });
        setAuthOpen(false);
        return;
      }

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Login failed");
      login({
        name: payload.data?.email?.split("@")[0] ?? email.split("@")[0],
        email,
        phone,
        city,
        verified: true,
        accessToken: payload.token
      });
      setAuthOpen(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    setLoading(true);
    setStatus("");
    try {
      const response = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail || email })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Could not resend code");
      setStatus(payload.data?.demoCode ? `Demo code: ${payload.data.demoCode}` : "تم إرسال رمز جديد.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
    }
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
              {user ? (language === "ar" ? "خروج" : "Logout") : language === "ar" ? "دخول / حساب" : "Login / Account"}
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
              <h2 className="text-xl font-black text-slate-950 dark:text-white">
                {mode === "register" ? "إنشاء حساب" : mode === "verify" ? "تأكيد البريد" : "تسجيل الدخول"}
              </h2>
              <button type="button" onClick={() => setAuthOpen(false)} className="rounded-lg border border-slate-200 px-3 py-1 font-bold dark:border-slate-700">
                إغلاق
              </button>
            </div>
            <div className="mb-4 grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setMode("login")} className={`min-h-10 rounded-lg border px-3 font-bold ${mode === "login" ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 dark:border-slate-700"}`}>
                دخول
              </button>
              <button type="button" onClick={() => setMode("register")} className={`min-h-10 rounded-lg border px-3 font-bold ${mode !== "login" ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-200 dark:border-slate-700"}`}>
                حساب جديد
              </button>
            </div>
            <div className="space-y-3">
              {mode === "register" ? (
                <input required value={name} onChange={(event) => setName(event.target.value)} className="min-h-12 w-full rounded-lg border border-slate-200 bg-transparent px-3 dark:border-slate-700" placeholder="الاسم الكامل" />
              ) : null}
              {mode === "verify" ? (
                <>
                  <div className="rounded-lg bg-slate-50 p-3 text-sm font-semibold text-slate-600 dark:bg-slate-950 dark:text-slate-300">
                    أدخل الرقم المرسل إلى: {pendingEmail || email}
                  </div>
                  <input required inputMode="numeric" maxLength={6} value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className="min-h-12 w-full rounded-lg border border-slate-200 bg-transparent px-3 text-center text-xl font-black tracking-widest dark:border-slate-700" placeholder="123456" />
                </>
              ) : (
                <>
                  <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="min-h-12 w-full rounded-lg border border-slate-200 bg-transparent px-3 dark:border-slate-700" placeholder="البريد الإلكتروني" />
                  <input required type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} className="min-h-12 w-full rounded-lg border border-slate-200 bg-transparent px-3 dark:border-slate-700" placeholder="كلمة المرور" />
                </>
              )}
              {mode === "register" ? (
                <>
                  <input value={phone} onChange={(event) => setPhone(event.target.value)} className="min-h-12 w-full rounded-lg border border-slate-200 bg-transparent px-3 dark:border-slate-700" placeholder="رقم الهاتف اختياري" />
                  <select value={city} onChange={(event) => setCity(event.target.value)} className="min-h-12 w-full rounded-lg border border-slate-200 bg-white px-3 dark:border-slate-700 dark:bg-slate-950">
                    {cities.map((item) => <option key={item}>{item}</option>)}
                  </select>
                </>
              ) : null}
              {status ? (
                <div className="rounded-lg border border-brand-100 bg-brand-50 p-3 text-sm font-bold text-brand-700 dark:border-slate-800 dark:bg-slate-950 dark:text-brand-100">
                  {status}
                </div>
              ) : null}
              <button disabled={loading} className="min-h-12 w-full rounded-lg bg-brand-600 font-bold text-white disabled:opacity-60">
                {loading ? "..." : mode === "register" ? "إنشاء حساب وإرسال الرمز" : mode === "verify" ? "تأكيد الحساب" : "دخول"}
              </button>
              {mode === "verify" ? (
                <button type="button" onClick={resendCode} disabled={loading} className="min-h-11 w-full rounded-lg border border-slate-200 font-bold dark:border-slate-700">
                  إرسال الرمز مرة أخرى
                </button>
              ) : null}
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">
              يتم إنشاء الحساب بعد تأكيد البريد الإلكتروني برمز رقمي. رقم الهاتف اختياري.
            </p>
          </form>
        </div>
      ) : null}
    </>
  );
}
