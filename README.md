# سوق اليمن - Yemen Marketplace

Modern mobile-first Kleinanzeigen-Plattform fuer den Jemen mit arabischem RTL-Layout, englischer Zweitsprache und Startup-tauglicher Architektur.

Die vollstaendige Produkt- und Systemarchitektur liegt in [`docs/product-architecture.md`](docs/product-architecture.md).

## Screens

- Landingpage: `/`
- Anzeigenuebersicht mit Suche, Filtern und Anzeigenformular: `/listings`
- Detailseite: `/listings/solar-01`, `/listings/car-01`, `/listings/phone-01`, `/listings/home-01`
- Nutzerprofil mit Chat-Vorschau: `/profile`
- Admin Dashboard: `/admin`
- Mobile App: `apps/mobile`

## Produktumfang

- Mobile App: Flutter fuer Android und iOS
- Website: Next.js + Tailwind CSS, SEO und PWA
- Backend: Supabase, PostgreSQL, Auth, Realtime, Storage und Push-Integration
- Kategorien: Autos, Immobilien, Handys, Elektronik, Jobs, Moebel, Solarprodukte und Dienstleistungen
- Kernfunktionen: Anzeigen, Suche, Filter, Favoriten, Chat, WhatsApp-Kontakt, Reports, Premium-Anzeigen und Admin-Moderation

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS
- Mobile: Flutter App in `apps/mobile`
- Backend-Empfehlung: Supabase
- Storage: Supabase Storage mit clientseitiger Bildkompression zu WebP
- Realtime: Supabase Realtime fuer Chat und Admin-Moderation
- Auth: Supabase Auth mit OTP per Telefon oder E-Mail
- PWA: `manifest.json`, spaeter Service Worker fuer Offline-Caching

## Datenbankstruktur

```sql
users(
  id uuid primary key,
  name text not null,
  phone text unique,
  email text unique,
  city text,
  avatar_url text,
  verified boolean default false,
  language text default 'ar',
  created_at timestamptz default now()
);

categories(
  id uuid primary key,
  name_ar text not null,
  name_en text not null,
  slug text unique not null
);

listings(
  id uuid primary key,
  user_id uuid references users(id),
  category_id uuid references categories(id),
  title text not null,
  description text not null,
  price numeric,
  currency text default 'YER',
  city text not null,
  status text default 'pending',
  premium_until timestamptz,
  created_at timestamptz default now()
);

listing_images(
  id uuid primary key,
  listing_id uuid references listings(id) on delete cascade,
  url text not null,
  sort_order int default 0
);

favorites(
  user_id uuid references users(id),
  listing_id uuid references listings(id) on delete cascade,
  created_at timestamptz default now(),
  primary key(user_id, listing_id)
);

conversations(
  id uuid primary key,
  listing_id uuid references listings(id),
  buyer_id uuid references users(id),
  seller_id uuid references users(id),
  updated_at timestamptz default now()
);

messages(
  id uuid primary key,
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references users(id),
  body text,
  image_url text,
  read_at timestamptz,
  created_at timestamptz default now()
);

reports(
  id uuid primary key,
  listing_id uuid references listings(id),
  reporter_id uuid references users(id),
  reason text not null,
  details text,
  status text default 'open',
  created_at timestamptz default now()
);

payments(
  id uuid primary key,
  user_id uuid references users(id),
  listing_id uuid references listings(id),
  plan text not null,
  amount numeric not null,
  provider text,
  status text default 'pending',
  created_at timestamptz default now()
);

push_subscriptions(
  id uuid primary key,
  user_id uuid references users(id),
  endpoint text not null,
  keys jsonb not null,
  created_at timestamptz default now()
);
```

## API-Struktur

```txt
POST   /api/auth/register
POST   /api/auth/login
GET    /api/listings?city=&category=&q=&min=&max=
POST   /api/listings
POST   /api/listings/:id/images
GET    /api/listings/:id
PATCH  /api/listings/:id
POST   /api/listings/:id/favorite
POST   /api/listings/:id/report
GET    /api/conversations
POST   /api/conversations/:id/messages
POST   /api/payments/premium
GET    /api/admin/overview
PATCH  /api/admin/listings/:id/moderate
```

## Monetarisierung

- Premium-Anzeigen: 7 oder 30 Tage hervorgehoben.
- Shop-Abos: monatliche Plaene fuer Haendler mit mehr Uploads und Analytics.
- Verifizierte Verkaeufer: optionale bezahlte Identitaets- und Shop-Pruefung.
- Lokale Werbung: dezente Banner in Kategorie- oder Stadtseiten.
- B2B-Pakete: Autohandel, Immobilienbueros, Solaranbieter und Jobanbieter.

## Performance-Plan

- Server-rendered Listing-Seiten fuer SEO und schnelle erste Darstellung.
- Kleine mobile Karten, lazy-loaded Bilder und remote WebP/AVIF.
- Pagination oder infinite loading mit kleinem Payload.
- Supabase Storage Image Transformations oder CDN.
- Offline-freundliche PWA fuer zuletzt gesehene Anzeigen und Entwuerfe.
- Edge caching fuer Kategorien, Staedte und oeffentliche Listing-Feeds.

## Lokal testen

Website:

```bash
npm run dev
```

Mobile App:

```bash
cd apps/mobile
flutter pub get
flutter run
```
