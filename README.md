# shoptet-assets

Verzovaný kód pro e-shop temperance.cz. JavaScript načítá Shoptet z CDN (jsDelivr) místo kódu vloženého v administraci. `<style>` v poli Záhlaví zůstává zatím vložený přímo ve Shoptetu a repo ho jen zrcadlí.

Repo je veřejné, protože jsDelivr servíruje jen veřejné repozitáře. Nepatří sem nic tajného.

## Soubory

- `src/head.js` – načítá se v poli Záhlaví (Vzhled a obsah → Editor → HTML kód).
- `shoptet-admin/head.html` – přesný obsah pole Záhlaví ve Shoptetu: inline `<style>` a `<script src>` na tento repozitář.

## Vánoční balíčky (`src/head.js`)

Strom: `/--vanocni-balicky/` → Pro muže / Pro ženy → koncové kategorie (Pro manželku, Pro maminku, …).

- **Větve stromu** (kategorie s dlaždicemi podkategorií, i když mají přiřazené produkty) nezobrazují produkty, filtry ani hlášku „Produkty teprve připravujeme“. Dlaždice podkategorií jsou větší a text se nezkracuje. Koncové kategorie zůstávají beze změny, i prázdné s hláškou. Strom se pozná podle drobečkové navigace.
- **Výběr „Zařadit ZDARMA do Vánočního balíčku“** (parametr příplatku 113) je skrytý. Skrývá se jen on a jeho popisek, celý seznam příplatků zmizí, jen když v něm nic jiného není. Příplatek je nepovinný, bez výběru jde produkt do košíku (ověřeno na živém e-shopu 2026-10-28), takže skrytý výběr nic neblokuje.
- **Zobrazí se**, když zákazník přišel ze stránky, jejíž první segment adresy odpovídá některé možnosti výběru (`/pro-manzelku/` ↔ „Pro manželku +0 Kč“). Ta možnost se předvybere a ostatní se z výběru odeberou. Skript neověřuje, že stránka patří do stromu Vánočních balíčků, rozhoduje jen shoda jména.
- **Kategorie a možnost se propojují jen jménem:** slug kategorie se musí rovnat slugu textu možnosti bez ceny za plusem. Pro novou koncovou kategorii stačí u produktů založit stejně pojmenovanou možnost, skript se nemění. Nesedí-li jméno, výběr zůstane skrytý.
- **Odkud zákazník přišel**, zjišťuje skript z `document.referrer`. Zákazník, který přijde ze záložky, e-mailu nebo vyhledávače, výběr neuvidí. Filtr značky (`/pro-manzelku:coreana/`) ani stránkování (`/pro-manzelku/strana-2/`) to nenaruší.
- Výběr, který se na stránce objeví až po jejím načtení (AJAX), skript nezamkne a zůstane skrytý.
- Skrývání produktů ve větvích stromu a skrytí prázdného seznamu příplatků používá `:has()`. V prohlížečích bez něj (Firefox před 121, Safari před 15.4) ve větvích zůstanou vidět produkty a po skrytí výběru zbyde prázdný seznam příplatků. Samotný výběr a jeho popisek se skryjí i tam.

## Nasazení nové verze

1. Změnu commitnout na `main` a ve stejném commitu přepsat verzi v URL v `shoptet-admin/head.html` (`@v1.0.0` → `@v1.1.0`).
2. Commit označit tagem a odeslat: `git tag -a v1.1.0 -m "Version 1.1.0" && git push origin main v1.1.0`.
3. Ověřit, že URL z `head.html` vrací 200 (`curl -I <url>`). Teprve potom vložit `head.html` do pole Záhlaví ve Shoptetu a uložit.
4. Rollback je návrat na předchozí tag v URL ve Shoptetu.

Tag se nikdy nepřesouvá, jsDelivr ho drží v cache. Každá změna je nový tag. Na tag, který ještě není na GitHubu, se neodkazuje, jsDelivr si může zapamatovat chybu 404.
