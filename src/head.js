// Přepis "Vyberte příplatek" ve výběru vánočního balíčku a odstranění prefixu "Příplatky:".
var VANOCNI_BALICEK_PRVNI_VERZE = '— pro koho —';

new MutationObserver(function (mutations, observer) {
    document.querySelectorAll('.surcharge-parameter option[data-choose="true"]').forEach(function (option) {
        if (option.textContent !== VANOCNI_BALICEK_PRVNI_VERZE) {
            option.textContent = VANOCNI_BALICEK_PRVNI_VERZE;
        }
    });
    if (document.readyState !== 'loading') {
        observer.disconnect();
    }
}).observe(document.documentElement, { childList: true, subtree: true });

function replaceSurchargeLabel() {
    document.querySelectorAll('.main-link-surcharges').forEach(function (el) {
        var text = el.textContent;
        if (text.indexOf('Příplatky:') === 0) {
            el.textContent = text.replace('Příplatky:', '').trim();
        }
    });
}

new MutationObserver(function () {
    replaceSurchargeLabel();
}).observe(document.documentElement, { childList: true, subtree: true });

replaceSurchargeLabel();

// Vánoční balíčky: kategorie /--vanocni-balicky/ → Pro muže / Pro ženy → koncové kategorie (Pro manželku, ...).
(function () {
    var CHRISTMAS_ROOT_SLUG = '--vanocni-balicky';
    var SURCHARGE_PARAMETER_ID = '113';
    var TREE_CLASS = 'christmas-tree';
    var SHOWN_CLASS = 'christmas-surcharge-shown';
    var LOCKED_CLASS = 'christmas-surcharge-locked';
    var SELECT_SELECTOR = 'select.surcharge-parameter[data-parameter-id="' + SURCHARGE_PARAMETER_ID + '"]';
    var HIDDEN_SELECT_SELECTOR = SELECT_SELECTOR + ':not(.' + SHOWN_CLASS + ')';
    var SUBCATEGORIES_SELECTOR = 'html.' + TREE_CLASS + ' .category-top ul.subcategories';

    var STYLES = [
        'html.' + TREE_CLASS + ' .category-top:has(ul.subcategories) { border-bottom: 0; margin-bottom: 0; }',
        'html.' + TREE_CLASS + ' .category-top:has(ul.subcategories) ~ .category-content-wrapper { display: none; }',
        'html.' + TREE_CLASS + ' .category-top:has(ul.subcategories) .products-top-wrapper { display: none; }',
        SUBCATEGORIES_SELECTOR + ' { display: flex; flex-wrap: wrap; justify-content: center; gap: 16px; }',
        SUBCATEGORIES_SELECTOR + ' li { float: none; width: auto; flex: 0 1 300px; padding: 0; }',
        '@media (max-width: 575px) { ' + SUBCATEGORIES_SELECTOR + ' li { flex-basis: 100%; } }',
        SUBCATEGORIES_SELECTOR + ' li a { height: auto; min-height: 72px; }',
        SUBCATEGORIES_SELECTOR + ' li .text { white-space: normal; overflow: visible; text-overflow: clip; font-size: 18px; line-height: 1.3; }',
        // Výběr je skrytý, dokud ho skript nepovolí. Celý seznam příplatků se skryje jen tehdy, když je v něm jen tento výběr.
        HIDDEN_SELECT_SELECTOR + ' { display: none; }',
        'label.surcharge-label[for="surcharge-parameter-id-' + SURCHARGE_PARAMETER_ID + '"]:not(.' + SHOWN_CLASS + ') { display: none; }',
        '.surcharge-list:has(' + HIDDEN_SELECT_SELECTOR + '):not(:has(select.surcharge-parameter:not([data-parameter-id="' + SURCHARGE_PARAMETER_ID + '"]))) { display: none; }',
        'select.' + LOCKED_CLASS + ' { pointer-events: none; }'
    ];

    // Cesty kategorií jsou ploché, kategorii určuje jen první segment. Filtr značky se připojuje za dvojtečku
    // (/pro-manzelku:coreana/), stránkování je další segment (/pro-manzelku/strana-2/).
    function categorySlug(pathname) {
        return (pathname.split('/')[1] || '').split(':')[0];
    }

    function referrerCategorySlug() {
        try {
            var referrer = new URL(document.referrer);
            return referrer.origin === location.origin ? categorySlug(referrer.pathname) : '';
        } catch (error) {
            return '';
        }
    }

    // Rozsah složených znamének (U+0300–U+036F) je sestavený z kódů, aby soubor zůstal parsovatelný i ve starých prohlížečích.
    var COMBINING_MARKS = new RegExp('[' + String.fromCharCode(0x300) + '-' + String.fromCharCode(0x36f) + ']', 'g');

    function slugify(text) {
        return text.normalize('NFD').replace(COMBINING_MARKS, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    // Text možnosti nese za plusem cenu příplatku: "Pro manželku +0 Kč".
    function optionLabel(option) {
        return option.textContent.replace(/\s*\+[^+]*$/, '').trim();
    }

    // Koncová kategorie a její možnost příplatku se propojují jen jménem: slug kategorie = slug textu možnosti.
    function findOptionForCategory(select, categorySlugValue) {
        var found = null;
        select.querySelectorAll('option').forEach(function (option) {
            if (option.value !== '' && slugify(optionLabel(option)) === categorySlugValue) {
                found = option;
            }
        });
        return found;
    }

    function lockSurcharge(select, wantedOption) {
        var initialValue = select.value;
        Array.prototype.slice.call(select.options).forEach(function (option) {
            if (option !== wantedOption) {
                option.remove();
            }
        });
        select.value = wantedOption.value;
        select.classList.add(SHOWN_CLASS, LOCKED_CLASS);
        var label = document.querySelector('label.surcharge-label[for="' + select.id + '"]');
        if (label) {
            label.classList.add(SHOWN_CLASS);
        }
        // Před načtením stránky změnu vybrané hodnoty hlásí Shoptet sám, ve svém handleru události "load".
        if (select.value !== initialValue && document.readyState === 'complete') {
            select.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    var root = document.documentElement;
    var referrerSlug = referrerCategorySlug();
    var treeChecked = false;

    function isInChristmasTree() {
        return categorySlug(location.pathname) === CHRISTMAS_ROOT_SLUG
            || document.querySelector('.breadcrumbs a[href$="/' + CHRISTMAS_ROOT_SLUG + '/"]') !== null;
    }

    function update() {
        if (!treeChecked) {
            if (isInChristmasTree()) {
                root.classList.add(TREE_CLASS);
                treeChecked = true;
            } else if (document.readyState !== 'loading') {
                treeChecked = true;
            }
        }
        if (referrerSlug) {
            document.querySelectorAll(SELECT_SELECTOR).forEach(function (select) {
                var wantedOption = findOptionForCategory(select, referrerSlug);
                if (wantedOption) {
                    lockSurcharge(select, wantedOption);
                }
            });
        }
        var surchargeWatchDone = !referrerSlug || (document.readyState === 'complete' && !document.querySelector(SELECT_SELECTOR));
        if (treeChecked && surchargeWatchDone) {
            observer.disconnect();
        }
    }

    var observer = new MutationObserver(update);

    var style = document.createElement('style');
    style.textContent = STYLES.join('\n');
    (document.head || root).appendChild(style);

    observer.observe(root, { childList: true, subtree: true });
    document.addEventListener('DOMContentLoaded', update);
    window.addEventListener('load', update);
    update();
})();
