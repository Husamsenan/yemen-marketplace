# Supabase Setup

Diese Anleitung richtet die gemeinsame Datenbank fuer Website und Flutter-App ein.

## 1. Supabase Projekt erstellen

1. In Supabase ein neues Projekt erstellen.
2. Region moeglichst nah an deiner Zielgruppe waehlen.
3. Project URL und API Keys aus `Project Settings -> API` kopieren.
4. In diesem Repo `.env.local` aus `.env.example` erstellen.

```bash
cp .env.example .env.local
```

Dann eintragen:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## 2. SQL ausfuehren

Im Supabase Dashboard:

1. `SQL Editor` oeffnen.
2. Inhalt von `supabase/migrations/20260510183000_initial_schema.sql` ausfuehren.
3. Danach Inhalt von `supabase/seed.sql` ausfuehren.

Das erstellt:

- Kategorien und Staedte
- Profile, Anzeigen, Bilder, Favoriten
- Chat-Tabellen
- Reports und Moderation
- Premium Orders
- Push Device Tokens
- Seller Verification
- Storage Buckets
- Row Level Security Policies

## 3. Auth konfigurieren

In Supabase:

- `Authentication -> Providers`: Email aktivieren.
- Spaeter Telefon/OTP aktivieren, falls ein SMS-Provider angebunden wird.
- `Authentication -> URL Configuration`:
  - Site URL: `http://127.0.0.1:3000`
  - Redirect URLs: `http://127.0.0.1:3000`, `http://localhost:3000`

## 4. Storage pruefen

Buckets:

- `listing-images`: public
- `avatars`: public
- `verification-docs`: private

Uploads laufen authentifiziert. Listing-Bilder sollten im Pfad `user-id/listing-id/file.webp` gespeichert werden.

## 5. Lokal starten

Website:

```bash
npm run dev
```

Flutter Web:

```bash
cd apps/mobile
/Users/husamsenan/flutter/bin/flutter run -d chrome
```

## 6. Naechster Implementierungsschritt

Aktuell nutzt die Demo UI lokale Seed-Daten. Als naechstes werden die API-Routen von Demo-Daten auf Supabase umgestellt:

- Listings lesen/schreiben
- Auth Session
- Favoriten
- Reports
- Chat Realtime
- Bild-Upload zu Supabase Storage
