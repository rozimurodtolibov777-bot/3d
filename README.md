# STRIKEPOINT — 3D Web FPS

Brauzerda ishlaydigan, Three.js asosidagi birinchi shaxs ko‘rinishidagi FPS prototipi. Desktop va Android uchun boshqaruv, HUD, missiya ekrani, dushmanlar, o‘q-dori, qayta o‘qlash, sog‘liq va g‘alaba/yutqazish holatlari mavjud.

## Talablar
- Node.js 20.19+ yoki 22.12+
- Internet (birinchi marta `npm install` va Three.js paketini olish uchun)
- WebGL qo‘llaydigan zamonaviy brauzer

## Ishga tushirish
1. ZIP arxivini oching.
2. Loyiha papkasida terminal oching.
3. Quyidagilarni bajaring:

```bash
npm install
npm run dev
```

4. Terminal ko‘rsatgan lokal manzilni kompyuter brauzerida oching (odatda `http://localhost:5173`).

### Android telefonda sinash
Telefon va kompyuter bir xil Wi-Fi tarmog‘ida bo‘lsin. Kompyuterda `npm run dev -- --host 0.0.0.0` buyrug‘ini ishga tushiring. Terminalda ko‘rsatilgan lokal IP manzilni telefon brauzerida `http://KOMPYUTER_IP:5173` shaklida oching. Firewall Vite portiga ruxsat berishi kerak. Hostingga joylanganda oddiy HTTPS manzil orqali ochiladi.

## Boshqaruv

### Kompyuter
- **W / A / S / D** — yurish
- **Sichqoncha** — qarash va nishonga olish
- **Sichqonchaning chap tugmasi** — o‘q uzish
- **R** — qayta o‘qlash
- **Shift** — tezroq yurish
- **Esc / II** — pauza

### Android
- Chap pastdagi virtual joystick — yurish
- Ekranning o‘ng qismida barmoqni surish — qarash/nishonga olish
- **FIRE** — o‘q uzish
- **↻** — qayta o‘qlash
- Yuqoridagi **Ⅱ** — pauza

## O‘yin haqida
- 5 ta nishonli trening missiyasi
- Procedural 3D sahna: cho‘l bazasi, binolar, qum qoplari, bochkalar, qutilar, tog‘ tizmasi, soyalar va tuman
- HUD: nishonlar, sog‘liq, o‘q-dori, missiya holati
- Natija oynasi: zararsizlantirilgan nishonlar va aniqlik

## Muhim eslatma
Bu — o‘ynaladigan prototip. Hozircha tashqi fotorealistik asset paketlari, haqiqiy multiplayer, audio, murakkab dushman AI, server va doimiy saqlash kiritilmagan. Ko‘rinish Three.js geometriyasi va procedural teksturalar bilan yaratilgan; internetga joylash uchun Vite build chiqishini ishlatish mumkin.

## Production build
```bash
npm run build
npm run preview
```
Yaratilgan tayyor sayt fayllari `dist/` papkasiga tushadi. `dist/` papkasini statik hostingga (masalan, Netlify, Vercel yoki GitHub Pages konfiguratsiyasi moslangan holda) joylash mumkin.
