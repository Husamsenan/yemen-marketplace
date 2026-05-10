# Yemen Marketplace Mobile

Flutter-App fuer Android und iOS. Die App teilt sich spaeter Supabase Auth, PostgreSQL, Storage, Realtime Chat und Push Notifications mit der Next.js-Website.

## Starten

Flutter installieren:

- macOS: `brew install --cask flutter`
- Danach: `flutter doctor`
- Android: Android Studio + Android Emulator installieren
- iPhone Simulator: Xcode installieren

App starten:

```bash
cd apps/mobile
flutter pub get
flutter run
```

## Enthaltene Screens

- Home Feed mit Suche, Stadt- und Kategorie-Filter
- Anzeige erstellen
- Favoriten
- Chat Inbox
- Profil, Sprache und Dark Mode

## Backend-Anbindung

Aktuell nutzt die App lokale Demo-Daten. Fuer Supabase werden spaeter diese Pakete ergaenzt:

- `supabase_flutter`
- `firebase_messaging`
- `flutter_local_notifications`
- `image_picker`
- `cached_network_image`
- `go_router`
