import Link from "next/link";
import { Icon } from "./Icons";

export function MobileNav() {
  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white px-3 pt-2 md:hidden dark:border-slate-800 dark:bg-slate-950">
      <div className="grid grid-cols-5 gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
        <Link href="/" className="flex flex-col items-center gap-1 rounded-md p-2">
          <Icon name="gauge" className="h-5 w-5" />
          الرئيسية
        </Link>
        <Link href="/listings" className="flex flex-col items-center gap-1 rounded-md p-2">
          <Icon name="search" className="h-5 w-5" />
          بحث
        </Link>
        <Link href="/listings#new" className="-mt-5 flex flex-col items-center gap-1 rounded-md p-2 text-brand-700">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-600 text-white shadow-soft">
            <Icon name="plus" className="h-6 w-6" />
          </span>
          إضافة
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 rounded-md p-2">
          <Icon name="chat" className="h-5 w-5" />
          محادثات
        </Link>
        <Link href="/profile" className="flex flex-col items-center gap-1 rounded-md p-2">
          <Icon name="user" className="h-5 w-5" />
          حسابي
        </Link>
      </div>
    </nav>
  );
}
