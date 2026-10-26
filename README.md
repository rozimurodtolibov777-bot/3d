# STRIKEPOINT — 3D Web FPS

Three.js asosidagi brauzer FPS prototipi. Kompyuter va Android telefon brauzerlarida ishlash uchun tayyorlangan.

## GitHub Pages orqali ishga tushirish

Ushbu loyiha `https://rozimurodtolibov777-bot.github.io/3/` manziliga moslab sozlangan (`vite.config.js` ichida `base: '/3/'`).

1. ZIP arxivini oching.
2. Ichidagi `strikepoint_fps` papkasining **ichidagi barcha fayl va papkalarni** GitHub repozitoriyingiz `3` ning ildiziga yuklang. `package.json`, `index.html`, `vite.config.js`, `src/` va `.github/` repozitoriy ildizida turishi kerak.
3. Commit qiling. GitHub’da **Settings → Pages → Build and deployment → Source** bo‘limida **GitHub Actions** ni tanlang.
4. **Actions** bo‘limiga o‘ting va `Deploy STRIKEPOINT FPS to GitHub Pages` jarayoni yashil belgi bilan tugashini kuting.
5. Saytni oching: `https://rozimurodtolibov777-bot.github.io/3/`.

> Muhim: fayllarni repozitoriy ichida yana `strikepoint_fps/` degan ichki papkaga joylamang. Ular repozitoriy ildizida bo‘lishi kerak. Agar repozitoriy nomi `3` bo‘lmasa, `vite.config.js` ichidagi `base` qiymatini `'/REPO-NOMI/'` qilib almashtiring.

## Kompyuterda lokal ishga tushirish

Node.js 20.19+ yoki 22.12+ o‘rnating, loyiha papkasida terminal ochib:

```bash
npm install
npm run dev
```

Terminal bergan `http://localhost:5173` manzilini brauzerda oching.

## Boshqaruv

- WASD — yurish
- Sichqoncha — qarash/nishonga olish
- Sichqonchaning chap tugmasi — o‘q uzish
- R — qayta o‘qlash
- Shift — tez yurish
- Esc yoki pauza tugmasi — pauza
- Android’da chap joystick — yurish; ekranning o‘ng tomonini surish — qarash; FIRE — o‘q uzish; ↻ — qayta o‘qlash

## Prototip haqida

Trening maydoni, HUD, dushman nishonlari, o‘q-dori, sog‘liq va g‘alaba/yutqazish holatlari mavjud. Bu procedural grafikaga ega o‘ynaladigan prototip; fotorealistik tashqi assetlar va multiplayer kiritilmagan.
