# shoptet-assets

Verzovaný kód pro e-shop temperance.cz. JavaScript načítá Shoptet z CDN (jsDelivr) místo kódu vloženého v administraci. `<style>` v poli Záhlaví zůstává zatím vložený přímo ve Shoptetu a repo ho jen zrcadlí.

Repo je veřejné, protože jsDelivr servíruje jen veřejné repozitáře. Nepatří sem nic tajného.

## Soubory

- `src/head.js` – načítá se v poli Záhlaví (Vzhled a obsah → Editor → HTML kód).
- `shoptet-admin/head.html` – přesný obsah pole Záhlaví ve Shoptetu: inline `<style>` a `<script src>` na tento repozitář.

## Nasazení nové verze

1. Změnu commitnout na `main` a ve stejném commitu přepsat verzi v URL v `shoptet-admin/head.html` (`@v1.0.0` → `@v1.1.0`).
2. Commit označit tagem a odeslat: `git tag -a v1.1.0 -m "Version 1.1.0" && git push origin main v1.1.0`.
3. Ověřit, že URL z `head.html` vrací 200 (`curl -I <url>`). Teprve potom vložit `head.html` do pole Záhlaví ve Shoptetu a uložit.
4. Rollback je návrat na předchozí tag v URL ve Shoptetu.

Tag se nikdy nepřesouvá, jsDelivr ho drží v cache. Každá změna je nový tag. Na tag, který ještě není na GitHubu, se neodkazuje, jsDelivr si může zapamatovat chybu 404.
