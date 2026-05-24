# Svenska Grammatik — Pluggsida för ordklasser

Interaktiv webb-app för att lära sig de nio ordklasserna i svenska grammatik inför prov.

## Kom igång

```bash
cd grammatik-plugg
npm install
npm run dev
```

Öppna [http://localhost:5173](http://localhost:5173) i webbläsaren.

## Sidor

| Sida | Väg | Beskrivning |
|------|-----|-------------|
| Hem | `/` | Dashboard med streak, XP och progress-ringar per ordklass |
| Lär dig | `/lar-dig` | Teori för alla 9 ordklasser med flashcards |
| Ordklass-jakten | `/ordklass-jakten` | Identifiera ordklassen för markerat ord i mening |
| Böj rätt | `/boj-ratt` | Lucktext — tempus, komparation, var/vart, de/dem, sin/hans m.m. |
| Framsteg | `/framsteg` | Stapeldiagram, streak-kalender och statistik |

## Funktioner

- 70 övningsmeningar med korrekt markering, förklaring och svårighetsgrad
- 27 luckmeningar i 7 kategorier (tempus, komparation, var/vart, de/dem, sin/hans, kongruens, supinum)
- Flashcards för alla ordklasser — klicka för att vända
- Combo-system och XP för rätta svar, konfetti vid 10 rätt i rad
- Timer-läge (60 sekunder) i Ordklass-jakten
- Svårighetsgrader: Lätt (4 alternativ) / Medel / Svår
- Mörkt läge med toggle
- Ljud (ding/buzz) med mute-knapp
- localStorage sparar all progress, streaks och rekord
- Mobile-first — fungerar med tummen på telefon

## Teknik

- Vite + React + TypeScript
- Tailwind CSS v4 (@tailwindcss/vite)
- Framer Motion (animationer)
- lucide-react (ikoner)
- react-router-dom v7

## Bygga för produktion

```bash
npm run build
```

Output hamnar i `dist/`.
