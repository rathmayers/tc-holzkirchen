# TC Holzkirchen – Website

Moderne Vereinswebsite für den **Tennisclub Holzkirchen**, gebaut mit [Astro](https://astro.build), Tailwind CSS und React.

## 🚀 Schnellstart

```bash
# Abhängigkeiten installieren
npm install

# Entwicklungsserver starten (http://localhost:4321)
npm run dev

# Produktions-Build erstellen
npm run build

# Build lokal testen
npm run preview
```

## 📁 Projektstruktur

```
tc-holzkirchen/
├── public/
│   ├── favicon.svg
│   └── images/           ← Bilder hier ablegen
│       └── news/         ← News-Bilder
│
├── src/
│   ├── components/
│   │   ├── Header.astro  ← Navigation (sticky, responsive)
│   │   ├── Footer.astro  ← Footer mit Links & Kontakt
│   │   ├── Hero.astro    ← Großes Titelbild Startseite
│   │   └── NewsCard.astro ← Wiederverwendbare News-Karte
│   │
│   ├── content/
│   │   ├── config.ts     ← Schema-Definition für News
│   │   └── news/         ← 📝 NEWS HIER ALS .mdx DATEIEN
│   │
│   ├── layouts/
│   │   └── BaseLayout.astro ← HTML-Grundgerüst mit SEO
│   │
│   ├── pages/
│   │   ├── index.astro           ← Startseite
│   │   ├── news/
│   │   │   ├── index.astro       ← News-Übersicht mit Filter
│   │   │   └── [slug].astro      ← Einzelner Beitrag
│   │   ├── platzbuchung/
│   │   │   └── index.astro       ← Platzbuchung (vorbereitet)
│   │   └── admin/
│   │       ├── index.astro       ← Login
│   │       └── news-erstellen.astro ← MDX-Generator
│   │
│   └── styles/
│       └── global.css    ← Tailwind + Fonts + Custom CSS
│
├── astro.config.mjs
├── tailwind.config.mjs
└── tsconfig.json
```

## ✍️ News veröffentlichen

### Option A: Direkt (Developer-Workflow)

1. Neue Datei anlegen: `src/content/news/YYYY-MM-DD-titel.mdx`
2. Frontmatter ausfüllen (Pflichtfelder: `title`, `summary`, `date`, `author`, `category`)
3. Inhalt als Markdown schreiben
4. `npm run build` + Deployment

### Option B: Admin-Interface

1. Unter `/admin` einloggen (Demo: `admin` / `tennis2025`)
2. Formular ausfüllen
3. Generierte MDX-Datei kopieren und unter `src/content/news/` speichern
4. Build + Deploy

### Kategorie-Optionen

| Wert | Beschreibung |
|------|-------------|
| `Vereinsnews` | Allgemeine Club-Ankündigungen |
| `Mannschaft`  | Spielberichte & Mannschafts-News |
| `Turnier`     | Turniere & Wettbewerbe |
| `Jugend`      | Jugend & Kinder |
| `Platzbuchung`| Platz-Infos & Buchungshinweise |
| `Allgemein`   | Sonstiges |

### Frontmatter-Referenz

```yaml
---
title: "Titel des Beitrags"       # Pflicht
summary: "Kurzbeschreibung"       # Pflicht (für News-Karten)
date: 2025-05-01                  # Pflicht (YYYY-MM-DD)
author: "Max Mustermann"          # Pflicht
category: "Vereinsnews"           # Pflicht (siehe oben)
image: "/images/news/bild.jpg"    # Optional
imageAlt: "Bildbeschreibung"      # Optional (SEO)
featured: true                    # Optional (prominent dargestellt)
published: true                   # false = Entwurf (nicht angezeigt)
---
```

## 🎨 Design-System

### Farben

| Name    | Hex       | Verwendung |
|---------|-----------|------------|
| `clay`  | `#C45C2A` | Akzentfarbe, CTAs, Highlights |
| `court` | `#1A3A2A` | Dunkelgrün, Hintergründe |
| `sand`  | `#F5ECD8` | Helle Bereiche, Karten |
| `chalk` | `#FAFAF8` | Seitenhintergrund |

### Schriften

- **Bebas Neue** – Display/Überschriften (Google Fonts)
- **DM Sans** – Body-Text
- **DM Mono** – Labels, Metadaten, Code

## 🔮 Geplante Erweiterungen

- [ ] **Platzbuchungssystem** – Kalenderbasiert, mit Mitglieder-Login
- [ ] **CMS-Integration** – z.B. [Keystatic](https://keystatic.com) oder [Decap CMS](https://decapcms.org) für visuelles Bearbeiten
- [ ] **Mitgliederbereich** – Geschützte Seiten mit Login
- [ ] **Veranstaltungskalender** – Events mit ICS-Export
- [ ] **Mannschaften-Seite** – Aktuelle Ergebnisse (Anbindung an Tennis-Verbands-API)

## 🚀 Deployment

### Empfehlung: Netlify oder Vercel

```bash
# Netlify
npm run build
# dist/ Ordner deployen

# Oder: GitHub-Push → Netlify baut automatisch
```

### Umgebungsvariablen (für spätere Features)

```env
# .env (nicht ins Git committen!)
ADMIN_PASSWORD=sicheres-passwort-hier
AUTH_SECRET=zufaelliger-geheimer-schluessel
```

## 📝 Lizenz

Internes Projekt TC Holzkirchen e.V.
