# rx_operators

`rx_operators` je webová aplikace vytvářená k diplomové práci **Vývoj webové aplikace pro interaktivní samostudium
operátorů Reactive Extensions**. Cílem projektu je pomoci uživatelům pochopit základní principy reaktivního programování
a operátorů Reactive Extensions, hlavně knihovny RxJS. Aplikace má sloužit jako jednoduchý interaktivní výukový nástroj,
kde si uživatel vizuálně vyzkouší chování vybraných Rx operátorů, sleduje průchod hodnot datovým tokem a řeší krátké
cvičné úlohy. Projekt je zamýšlený jako funkční open-source prototyp pro diplomovou práci, který demonstruje hlavní
koncept: interaktivní vizualizaci Rx streamů a no-code skládání jednoduché pipeline operátorů.


## Technologie

Aktuální základ projektu:

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Radix UI
- Supabase Auth
- Supabase Database


## Lokální spuštění

Po naklonování repozitáře nainstalujte závislosti:

```powershell
npm install
```

Spuštění vývojového serveru:

```powershell
npm run dev
```

Kontrola kódu:

```powershell
npm run lint
```

Produkční build:

```powershell
npm run build
```

Náhled produkčního buildu:

```powershell
npm run preview
```

## Environment variables

Projekt používá Supabase. Lokální proměnné prostředí nastavte v souboru `.env` podle `.env.example`.

```text
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
VITE_SUPABASE_OAUTH_REDIRECT_TO=http://localhost:5173
```

Soubor `.env` není součástí repozitáře a neměl by obsahovat sdílené nebo produkční hodnoty.