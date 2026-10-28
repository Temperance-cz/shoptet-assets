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
