var $ = jQuery.noConflict();
var this_js_script = $('script[src*=accessibilitymenu]'); // or better regexp to get the file name..

var debugMode = false;

//var lang = this_js_script.attr('data-language');
//if (typeof lang === "undefined") {
//    var lang = 'heb';
//}

var lang = getScriptAttribute(this_js_script, "language", "eng");
var accessibilitySign = getScriptAttribute(this_js_script, "sign", "classic");
var sourceMenu = getScriptAttribute(this_js_script, "oemsource", "regular");

if (sourceMenu == "accessible+") {
    if (typeof curLang != "undefined") {
        if (debugMode) console.log(curLang);
        lang = curLang;
    } else {
        switch (lang) {
            case "heb":
                lang = "he_IL";
                break;
            case "eng":
                lang = "en_US";
        }
    }
} else {
    switch (lang) {
        case "heb":
            lang = "he_IL";
            break;
        case "eng":
            lang = "en_US";
    }
}

var accessibilityIconStr = (accessibilitySign === "classic") ? 'images/accessibility.png' : 'http://shakedwebdesign.com/plugins/accessibility-menu/access.png';

if (debugMode) console.log("loaded with language: " + lang);

var accessibilityShown = false;
var textSizeBigger = false;
var areLinksYellow = false;
var isGrayscale = false;
var isHighContrast = false;
var areLinksUnderlined = false;


var delimiter = "|";
var cookieName = "accessibility";

var init = true;

prepMenu();
setAccessibityFromCookie();
makeAccessible();

function getScriptAttribute(scriptObject, attributeName, defaultValue) {
    var tmp = scriptObject.attr('data-' + attributeName);
    if (typeof tmp === "undefined") {
        var tmp = defaultValue;
    }
    return tmp;
}

function prepMenu() {

    $("body").prepend("<div id='slideout'></div>");
    var menuHTML = "";

    switch (lang) {
        case "he_IL":
            menuHTML = "<button class='transparentButton' onclick='toggleAccessibilityMenu()'><img class='accessibilityimage' src='" + accessibilityIconStr + "' alt='Accessibility Menu Icon' role='navigation' title='×ª×¤×¨×™×˜ × ×’×™×©×•×ª'/></button>";
            menuHTML += "<div id='slideout_inner'>";
            menuHTML += "<ul class='rtl'>";
            menuHTML += "<button class='accessibilityMenuButton alignRight' id='btnTextSizeOn' onclick='setTextSize(true);'><i class='fa fa-text-height' aria-hidden='true'></i>&nbsp;&nbsp;×’×•×“×œ ×’×•×¤×Ÿ ×’×“×•×œ</button>";
            menuHTML += "<button class='accessibilityMenuButton alignRight' id='btnTextSizeOff' onclick='setTextSize(false);'><i class='fa fa-font' aria-hidden='true'></i>&nbsp;&nbsp;×’×•×“×œ ×’×•×¤×Ÿ ×¨×’×™×œ </button>";
            menuHTML += "<button class='accessibilityMenuButton alignRight' id='btnHighContrastOn' onclick='ToggleHighContrastMode(true);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;×ž×¦×‘ × ×™×’×•×“×™×•×ª ×’×‘×•×”×”</button>";
            menuHTML += "<button class='accessibilityMenuButton alignRight' id='btnHighContrastOff' onclick='ToggleHighContrastMode(false);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;×ž×¦×‘ × ×™×’×•×“×™×•×ª ×¨×’×™×œ×”</button>";
            menuHTML += "<button class='accessibilityMenuButton alignRight' id='btnYellowLinksOn'onclick='ToggleLinksYellow(true);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;×”×“×’×© ×§×™×©×•×¨×™× ×‘×¦×”×•×‘</button>";
            menuHTML += "<button class='accessibilityMenuButton alignRight' id='btnYellowLinksOff' onclick='ToggleLinksYellow(false);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;×”×¦×’ ×§×™×©×•×¨×™× ×›×¨×’×™×œ</button>";
            menuHTML += "<button class='accessibilityMenuButton alignRight' id='btnGrayscaleOn' onclick='ToggleGrayscaleMode(true);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;×ž×¦×‘ ×’×•×•× ×™ ××¤×•×¨</button>";
            menuHTML += "<button class='accessibilityMenuButton alignRight' id='btnGrayscaleOff' onclick='ToggleGrayscaleMode(false);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;×ž×¦×‘ ×¦×‘×¢ ×¨×’×™×œ</button>";
            menuHTML += "<button class='accessibilityMenuButton alignRight' id='btnLinksOn' onclick='ToggleUnderlineLinks(true);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;×”×¦×’ ×§×• ×ª×—×ª ×§×™×©×•×¨×™×</button>";
            menuHTML += "<button class='accessibilityMenuButton alignRight' id='btnLinksOff' onclick='ToggleUnderlineLinks(false);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;×”×¦×’ ×§×™×©×•×¨×™× ×›×¨×’×™×œ</button>";
            break;
        case "en_US":
            menuHTML = "<button class='transparentButton' onclick='toggleAccessibilityMenu()'><img class='accessibilityimage' src='" + accessibilityIconStr + "' alt='Accessibility Menu Icon' role='navigation' /></button>";
            menuHTML += "<div id='slideout_inner'>";
            menuHTML += "<ul class='ltr'>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOn' onclick='setTextSize(true);'><i class='fa fa-text-height' aria-hidden='true'></i>&nbsp;&nbsp;large font</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOff' onclick='setTextSize(false);'><i class='fa fa-font' aria-hidden='true'></i>&nbsp;&nbsp;normal font </button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOn' onclick='ToggleHighContrastMode(true);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;high contrast mode</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOff' onclick='ToggleHighContrastMode(false);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;regular contrast mode</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOn'onclick='ToggleLinksYellow(true);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;yellow colored links</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOff' onclick='ToggleLinksYellow(false);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;normal colored links</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOn' onclick='ToggleGrayscaleMode(true);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;grayscale color mode</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOff' onclick='ToggleGrayscaleMode(false);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;regular color mode</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOn' onclick='ToggleUnderlineLinks(true);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;underline links</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOff' onclick='ToggleUnderlineLinks(false);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;default links</button>";

            break;
        case "es_ES":
            menuHTML = "<button class='transparentButton' onclick='toggleAccessibilityMenu()'><img class='accessibilityimage' src='http://shakedwebdesign.com/plugins/accessibility-menu/accessibility.png' alt='Icono del menÃº Accesibilidad' role='navigation' title='MenÃº accesibilidad'/></button>";
            menuHTML += "<div id='slideout_inner'>";
            menuHTML += "<ul class='ltr'>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOn' onclick='setTextSize(true);'><i class='fa fa-text-height' aria-hidden='true'></i>&nbsp;&nbsp;letra grande</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOff' onclick='setTextSize(false);'><i class='fa fa-font' aria-hidden='true'></i>&nbsp;&nbsp;letra normal</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOn' onclick='ToggleHighContrastMode(true);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;modo de contraste alto</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOff' onclick='ToggleHighContrastMode(false);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;modo de contraste regulares</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOn'onclick='ToggleLinksYellow(true);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;amarillo eslabones de color</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOff' onclick='ToggleLinksYellow(false);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;eslabones de color normales</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOn' onclick='ToggleGrayscaleMode(true);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;modo de color en escala de grises</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOff' onclick='ToggleGrayscaleMode(false);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;modo de color normal</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOn' onclick='ToggleUnderlineLinks(true);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;subrayar los enlaces</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOff' onclick='ToggleUnderlineLinks(false);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;enlaces normales</button>";
            break;
        case "pt_PT":
            menuHTML = "<button class='transparentButton' onclick='toggleAccessibilityMenu()'><img class='accessibilityimage' src='http://shakedwebdesign.com/plugins/accessibility-menu/accessibility.png' alt='Ã­cone do menu de acessibilidade' role='navigation' title='menu de acessibilidade'/></button>";
            menuHTML += "<div id='slideout_inner'>";
            menuHTML += "<ul class='ltr'>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOn' onclick='setTextSize(true);'><i class='fa fa-text-height' aria-hidden='true'></i>&nbsp;&nbsp;letra grande</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOff' onclick='setTextSize(false);'><i class='fa fa-font' aria-hidden='true'></i>&nbsp;&nbsp;fonte normal</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOn' onclick='ToggleHighContrastMode(true);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;modo de alto contraste</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOff' onclick='ToggleHighContrastMode(false);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;modo de contraste regulares</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOn'onclick='ToggleLinksYellow(true);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;ligaÃ§Ãµes de cor amarela</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOff' onclick='ToggleLinksYellow(false);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;ligaÃ§Ãµes coloridas normais</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOn' onclick='ToggleGrayscaleMode(true);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;modo de cor em tons de cinza</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOff' onclick='ToggleGrayscaleMode(false);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;modo de cor normal</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOn' onclick='ToggleUnderlineLinks(true);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;sublinhar os links</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOff' onclick='ToggleUnderlineLinks(false);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;ligaÃ§Ãµes normais</button>";
            break;
        case "ja_JP":
            menuHTML = "<button class='transparentButton' onclick='toggleAccessibilityMenu()'><img class='accessibilityimage' src='http://shakedwebdesign.com/plugins/accessibility-menu/accessibility.png' alt='ã‚¢ã‚¯ã‚»ã‚·ãƒ“ãƒªãƒ†ã‚£ãƒ¡ãƒ‹ãƒ¥ãƒ¼ã‚¢ã‚¤ã‚³ãƒ³' role='navigation' title='ã‚¢ã‚¯ã‚»ã‚·ãƒ“ãƒªãƒ†ã‚£ãƒ¡ãƒ‹ãƒ¥ãƒ¼'/></button>";
            menuHTML += "<div id='slideout_inner'>";
            menuHTML += "<ul class='ltr'>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOn' onclick='setTextSize(true);'><i class='fa fa-text-height' aria-hidden='true'></i>&nbsp;&nbsp;å¤§ããªãƒ•ã‚©ãƒ³ãƒˆ</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOff' onclick='setTextSize(false);'><i class='fa fa-font' aria-hidden='true'></i>&nbsp;&nbsp;é€šå¸¸ã®ãƒ•ã‚©ãƒ³ãƒˆ </button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOn' onclick='ToggleHighContrastMode(true);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;ãƒã‚¤ã‚³ãƒ³ãƒˆãƒ©ã‚¹ãƒˆãƒ¢ãƒ¼ãƒ‰</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOff' onclick='ToggleHighContrastMode(false);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;å®šæœŸçš„ãªã‚³ãƒ³ãƒˆãƒ©ã‚¹ãƒˆãƒ¢ãƒ¼ãƒ‰</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOn'onclick='ToggleLinksYellow(true);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;é»„è‰²ã®ãƒªãƒ³ã‚¯</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOff' onclick='ToggleLinksYellow(false);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;é€šå¸¸ã®ç€è‰²ã•ã‚ŒãŸãƒªãƒ³ã‚¯</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOn' onclick='ToggleGrayscaleMode(true);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;ã‚°ãƒ¬ãƒ¼ã‚¹ã‚±ãƒ¼ãƒ«ã‚«ãƒ©ãƒ¼ãƒ¢ãƒ¼ãƒ‰</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOff' onclick='ToggleGrayscaleMode(false);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;ãƒ¬ã‚®ãƒ¥ãƒ©ãƒ¼ã‚«ãƒ©ãƒ¼ãƒ¢ãƒ¼ãƒ‰</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOn' onclick='ToggleUnderlineLinks(true);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;ãƒªãƒ³ã‚¯ã«ä¸‹ç·š</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOff' onclick='ToggleUnderlineLinks(false);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;ãƒ‡ãƒ•ã‚©ãƒ«ãƒˆã®ãƒªãƒ³ã‚¯</button>";
            break;
        case "it_IT":
            menuHTML = "<button class='transparentButton' onclick='toggleAccessibilityMenu()'><img class='accessibilityimage' src='http://shakedwebdesign.com/plugins/accessibility-menu/accessibility.png' alt='Icona AccessibilitÃ  Menu' role='navigation' title='AccessibilitÃ  Menu'/></button>";
            menuHTML += "<div id='slideout_inner'>";
            menuHTML += "<ul class='ltr'>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOn' onclick='setTextSize(true);'><i class='fa fa-text-height' aria-hidden='true'></i>&nbsp;&nbsp;font grande</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOff' onclick='setTextSize(false);'><i class='fa fa-font' aria-hidden='true'></i>&nbsp;&nbsp;carattere normale </button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOn' onclick='ToggleHighContrastMode(true);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;modalitÃ  ad alto contrasto</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOff' onclick='ToggleHighContrastMode(false);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;modalitÃ  di contrasto regolare</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOn'onclick='ToggleLinksYellow(true);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;giallo collegamenti colorati</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOff' onclick='ToggleLinksYellow(false);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;normali collegamenti colorati</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOn' onclick='ToggleGrayscaleMode(true);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;modalitÃ  a colori in scala di grigi</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOff' onclick='ToggleGrayscaleMode(false);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;modalitÃ  colore normale</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOn' onclick='ToggleUnderlineLinks(true);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;sottolineare i collegamenti</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOff' onclick='ToggleUnderlineLinks(false);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;collegamenti predefiniti</button>";
            break;
        case "fr_FR":
            menuHTML = "<button class='transparentButton' onclick='toggleAccessibilityMenu()'><img class='accessibilityimage' src='http://shakedwebdesign.com/plugins/accessibility-menu/accessibility.png' alt='AccessibilitÃ© Menu icon' role='navigation' title='AccessibilitÃ© Menu'/></button>";
            menuHTML += "<div id='slideout_inner'>";
            menuHTML += "<ul class='ltr'>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOn' onclick='setTextSize(true);'><i class='fa fa-text-height' aria-hidden='true'></i>&nbsp;&nbsp;grande police</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOff' onclick='setTextSize(false);'><i class='fa fa-font' aria-hidden='true'></i>&nbsp;&nbsp;police normale</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOn' onclick='ToggleHighContrastMode(true);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;mode de contraste Ã©levÃ©</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOff' onclick='ToggleHighContrastMode(false);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;mode de contraste rÃ©gulier</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOn'onclick='ToggleLinksYellow(true);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;liens de couleur jaune</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOff' onclick='ToggleLinksYellow(false);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;liens de couleur normale</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOn' onclick='ToggleGrayscaleMode(true);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;mode couleur en niveaux de gris</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOff' onclick='ToggleGrayscaleMode(false);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;mode couleur rÃ©guliÃ¨re</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOn' onclick='ToggleUnderlineLinks(true);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;souligner les liens</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOff' onclick='ToggleUnderlineLinks(false);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;liens par dÃ©faut</button>";
            break;
        case "de_DE":
            menuHTML = "<button class='transparentButton' onclick='toggleAccessibilityMenu()'><img class='accessibilityimage' src='http://shakedwebdesign.com/plugins/accessibility-menu/accessibility.png' alt='Barrierefreiheit MenÃ¼ Icon' role='navigation' title='Erreichbar MenÃ¼'/></button>";
            menuHTML += "<div id='slideout_inner'>";
            menuHTML += "<ul class='ltr'>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOn' onclick='setTextSize(true);'><i class='fa fa-text-height' aria-hidden='true'></i>&nbsp;&nbsp;groÃŸe Schrift</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOff' onclick='setTextSize(false);'><i class='fa fa-font' aria-hidden='true'></i>&nbsp;&nbsp;normale Schrift</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOn' onclick='ToggleHighContrastMode(true);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;Modus mit hohem Kontrast</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOff' onclick='ToggleHighContrastMode(false);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;regelmÃ¤ÃŸige Kontrastmodus</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOn'onclick='ToggleLinksYellow(true);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;gelb gefÃ¤rbte Links</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOff' onclick='ToggleLinksYellow(false);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;normale farbige Links</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOn' onclick='ToggleGrayscaleMode(true);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;Graustufen-Farbmodus</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOff' onclick='ToggleGrayscaleMode(false);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;regelmÃ¤ÃŸige Farbmodus</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOn' onclick='ToggleUnderlineLinks(true);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;Links unterstreichen</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOff' onclick='ToggleUnderlineLinks(false);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;Standard Links</button>";
            break;
        case "zh_CN":
            menuHTML = "<button class='transparentButton' onclick='toggleAccessibilityMenu()'><img class='accessibilityimage' src='http://shakedwebdesign.com/plugins/accessibility-menu/accessibility.png' alt='è¾…åŠ©åŠŸèƒ½èœå•å›¾æ ‡' role='navigation' title='è¾…åŠ©èœå•'/></button>";
            menuHTML += "<div id='slideout_inner'>";
            menuHTML += "<ul class='ltr'>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOn' onclick='setTextSize(true);'><i class='fa fa-text-height' aria-hidden='true'></i>&nbsp;&nbsp;å¤§å­—ä½“</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnTextSizeOff' onclick='setTextSize(false);'><i class='fa fa-font' aria-hidden='true'></i>&nbsp;&nbsp;æ­£å¸¸å­—ä½“</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOn' onclick='ToggleHighContrastMode(true);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;é«˜å¯¹æ¯”åº¦æ¨¡å¼</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnHighContrastOff' onclick='ToggleHighContrastMode(false);'><i class='fa fa-adjust' aria-hidden='true'></i>&nbsp;&nbsp;å®šæœŸå¯¹æ¯”åº¦æ¨¡å¼</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOn'onclick='ToggleLinksYellow(true);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;é»„è‰²é“¾æŽ¥</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnYellowLinksOff' onclick='ToggleLinksYellow(false);'><i class='fa fa-pencil' aria-hidden='true'></i>&nbsp;&nbsp;æ­£å¸¸é¢œè‰²çš„é“¾æŽ¥</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOn' onclick='ToggleGrayscaleMode(true);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;ç°åº¦è‰²å½©æ¨¡å¼</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnGrayscaleOff' onclick='ToggleGrayscaleMode(false);'><i class='fa fa-barcode' aria-hidden='true'></i>&nbsp;&nbsp;å¸¸è‰²æ¨¡å¼</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOn' onclick='ToggleUnderlineLinks(true);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;é“¾æŽ¥ä¸‹åˆ’çº¿</button>";
            menuHTML += "<button class='accessibilityMenuButton alignLeft' id='btnLinksOff' onclick='ToggleUnderlineLinks(false);'><i class='fa fa-underline' aria-hidden='true'></i>&nbsp;&nbsp;é»˜è®¤é“¾æŽ¥</button>";

            break;

    }

    menuHTML += "</ul>";
    if (sourceMenu != "accessible+") {

        menuHTML += "<div style='text-align:center;'>";
        menuHTML += "</div>";
    }
    menuHTML += "</div>";


    $("#slideout").html(menuHTML);


    var cssText = "<link href='http://shakedwebdesign.com/plugins/accessibility-menu/yellow-links.css' title='yellow' type='text/css' rel='stylesheet' disabled='true'/>";
    cssText += "<link href='http://shakedwebdesign.com/plugins/accessibility-menu/underline-links.css' title='underline' type='text/css' rel='stylesheet' disabled='true'/>";
    cssText += "<link href='http://shakedwebdesign.com/plugins/accessibility-menu/grayscale.css' title='grayscale' type='text/css' rel='stylesheet' disabled='true'/>";

    if (sourceMenu == "accessible+") {
        cssText += "<link href='http://shakedwebdesign.com/plugins/accessibility-menu/night.css' title='contrast' type='text/css' rel='stylesheet' disabled='true'/>";
        cssText += "<link href='http://shakedwebdesign.com/plugins/accessibility-menu/biggest.css' title='textsize' type='text/css' rel='stylesheet' disabled='true'/>";
    } else {
        cssText += "<link href='http://shakedwebdesign.com/plugins/accessibility-menu/high-contrast.css' title='contrast' type='text/css' rel='stylesheet' disabled='true'/>";
        cssText += "<link href='http://shakedwebdesign.com/plugins/accessibility-menu/bigger.css' title='textsize' type='text/css' rel='stylesheet' disabled='true'/>";
    }





    $("head").append(cssText);

}

function toggleAccessibilityMenu() {
    if (accessibilityShown) {
        $("#slideout").css("left", "16px");
        $("#slideout_inner").css("left", "-250px");
    } else {
        $("#slideout").css("left", "250px");
        $("#slideout_inner").css("left", "0");
        
    }

    accessibilityShown = !accessibilityShown;
}


function setTextSize(newSize) {
    if (debugMode) console.log("set size: " + newSize);
    if (newSize === "true" || newSize === true) {

        textSizeBigger = true;

        if ($('link[title=textsize]').length == 0) {
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: "http://shakedwebdesign.com/plugins/accessibility-menu/bigger.css",
                title: "textsize"
            }).appendTo("head");
            $('link[title=textsize]')[0].disabled = false;
        } else {
            $('link[title=textsize]')[0].disabled = false;
        }



        $("#btnTextSizeOff").attr("disabled", false);
        $("#btnTextSizeOff").attr("aria-disabled", false);
        $("#btnTextSizeOn").attr("disabled", true);
        $("#btnTextSizeOn").attr("aria-disabled", true);

    } else {

        if ($('link[title=textsize]').length > 0) {
            $('link[title=textsize]')[0].disabled = true;
        }


        textSizeBigger = false;

        $("#btnTextSizeOff").attr("disabled", true);
        $("#btnTextSizeOff").attr("aria-disabled", true);
        $("#btnTextSizeOn").attr("disabled", false);
        $("#btnTextSizeOn").attr("aria-disabled", false);
    }

    var str = textSizeBigger + delimiter + areLinksYellow + delimiter + isGrayscale + delimiter + isHighContrast + delimiter + areLinksUnderlined + delimiter;
    if (!init) createCookie(cookieName, str);

}

function ToggleUnderlineLinks(mode) {
    if (!(mode === "true" || mode === true)) {
        if ($('link[title=underline]').length > 0) {
            $('link[title=underline]')[0].disabled = true;
        }

        areLinksUnderlined = false;
        $("#btnLinksOff").attr("disabled", true);
        $("#btnLinksOff").attr("aria-disabled", true);
        $("#btnLinksOn").attr("disabled", false);
        $("#btnLinksOn").attr("aria-disabled", false);

    } else {
        if (debugMode) console.log("0");
        if ($('link[title=underline]').length == 0) {
            if (debugMode) console.log("1");
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: "http://shakedwebdesign.com/plugins/accessibility-menu/underline-links.css",
                title: "underline"
            }).appendTo("head");
        } else {
            if (debugMode) console.log("2");
            $('link[title=underline]')[0].disabled = false;
        }
        areLinksUnderlined = true;
        $("#btnLinksOff").attr("disabled", false);
        $("#btnLinksOff").attr("aria-disabled", false);
        $("#btnLinksOn").attr("disabled", true);
        $("#btnLinksOn").attr("aria-disabled", true);


    }

    var str = textSizeBigger + delimiter + areLinksYellow + delimiter + isGrayscale + delimiter + isHighContrast + delimiter + areLinksUnderlined + delimiter;
    if (!init) createCookie(cookieName, str);
}

function ToggleLinksYellow(mode) {
    if (!(mode === "true" || mode === true)) {
        if ($('link[title=yellow]').length > 0) {
            $('link[title=yellow]')[0].disabled = true;
        }

        areLinksYellow = false;
        $("#btnYellowLinksOff").attr("disabled", true);
        $("#btnYellowLinksOff").attr("aria-disabled", true);
        $("#btnYellowLinksOn").attr("disabled", false);
        $("#btnYellowLinksOn").attr("aria-disabled", false);

    } else {
        if ($('link[title=yellow]').length == 0) {
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: "http://shakedwebdesign.com/plugins/accessibility-menu/yellow-links.css",
                title: "yellow"
            }).appendTo("head");
        } else {
            $('link[title=yellow]')[0].disabled = false;
        }
        areLinksYellow = true;

        $("#btnYellowLinksOff").attr("disabled", false);
        $("#btnYellowLinksOff").attr("aria-disabled", false);
        $("#btnYellowLinksOn").attr("disabled", true);
        $("#btnYellowLinksOn").attr("aria-disabled", true);
    }

    var str = textSizeBigger + delimiter + areLinksYellow + delimiter + isGrayscale + delimiter + isHighContrast + delimiter + areLinksUnderlined + delimiter;
    if (!init) createCookie(cookieName, str);
}

function ToggleHighContrastMode(mode) {
    if (!(mode === "true" || mode === true)) {
        if ($('link[title=contrast]').length > 0) {
            $('link[title=contrast]')[0].disabled = true;
        }
        isHighContrast = false;
        $("#btnHighContrastOff").attr("disabled", true);
        $("#btnHighContrastOff").attr("aria-disabled", true);
        $("#btnHighContrastOn").attr("disabled", false);
        $("#btnHighContrastOn").attr("aria-disabled", false);
    } else {
        if ($('link[title=contrast]').length == 0) {
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: "http://shakedwebdesign.com/plugins/accessibility-menu/high-contrast.css",
                title: "contrast"
            }).appendTo("head");
            $('link[title=contrast]')[0].disabled = false;
        } else {
            $('link[title=contrast]')[0].disabled = false;
        }
        isHighContrast = true;
        $("#btnHighContrastOff").attr("disabled", false);
        $("#btnHighContrastOff").attr("aria-disabled", false);
        $("#btnHighContrastOn").attr("disabled", true);
        $("#btnHighContrastOn").attr("aria-disabled", true);
    }
    var str = textSizeBigger + delimiter + areLinksYellow + delimiter + isGrayscale + delimiter + isHighContrast + delimiter + areLinksUnderlined + delimiter;
    if (!init) createCookie(cookieName, str);
}

function ToggleGrayscaleMode(mode) {
     if (!(mode === "true" || mode === true)) {
        if ($('link[title=grayscale]').length > 0) {
            $('link[title=grayscale]')[0].disabled = true;
        }
        isGrayscale = false;
        $("#btnGrayscaleOff").attr("disabled", true);
        $("#btnGrayscaleOff").attr("aria-disabled", true);
        $("#btnGrayscaleOn").attr("disabled", false);
        $("#btnGrayscaleOn").attr("aria-disabled", false);
    } else {
        if ($('link[title=contrast]').length == 0) {
            $("<link/>", {
                rel: "stylesheet",
                type: "text/css",
                href: "http://shakedwebdesign.com/plugins/accessibility-menu/grayscale.css",
                title: "grayscale"
            }).appendTo("head");
            $('link[title=grayscale]')[0].disabled = false;
        } else {
            $('link[title=grayscale]')[0].disabled = false;
        }
        isGrayscale = true;
        $("#btnGrayscaleOff").attr("disabled", false);
        $("#btnGrayscaleOff").attr("aria-disabled", false);
        $("#btnGrayscaleOn").attr("disabled", true);
        $("#btnGrayscaleOn").attr("aria-disabled", true);
    }

    var str = textSizeBigger + delimiter + areLinksYellow + delimiter + isGrayscale + delimiter + isHighContrast + delimiter + areLinksUnderlined + delimiter;
    if (!init) createCookie(cookieName, str);
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "" + date.toGMTString();
    } else {
        var date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        var expires = "" + date.toGMTString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
    if (debugMode) console.log("create cookie: " + value);

}



function readCookie(name) {
    if (debugMode) console.log("trying to get cookie: " + name);
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) {
            if (debugMode) console.log("cookie: " + name + " found!");
            c = c.substring(nameEQ.length, c.length);
            //alert("in read cookie. got: " + c);
            var parts = c.split(delimiter);
            if (parts.length > 4) {
                areLinksUnderlined = parts[3];
                if (debugMode) console.log("underlined: " + areLinksUnderlined);
            }
            if (parts.length > 3) {
                isHighContrast = parts[3];
                if (debugMode) console.log("contrast: " + isHighContrast);
            }
            if (parts.length > 2) {
                isGrayscale = parts[2];
                if (debugMode) console.log("grayscale: " + isGrayscale);
            }
            if (parts.length > 1) {
                areLinksYellow = parts[1];
                if (debugMode) console.log("yellow: " + areLinksYellow);
            }
            if (parts.length > 0) {
                //alert("read from cookie:" + parts[0]);
                textSizeBigger = parts[0];
                if (debugMode) console.log("size: " + textSizeBigger);
            }

        }
    }
    return null;
}

function setAccessibityFromCookie() {
    readCookie(cookieName);
    setTextSize(textSizeBigger);
    ToggleGrayscaleMode(isGrayscale);
    ToggleHighContrastMode(isHighContrast);
    ToggleLinksYellow(areLinksYellow);
    ToggleUnderlineLinks(areLinksUnderlined);

    init = false;
}

function makeAccessible() {
    // set empty alt attribute to any image that does not contain an alt tag:
    $('img:not([alt])').attr('alt', '');

    // copy link title into aria-label:
    $('a[title]').each(function () {
        $(this).attr('aria-label', $(this).attr('title'));
    });

    if ($("nav").attr('role') == undefined) {
        $("nav").attr('role', "navigation");
    }

}