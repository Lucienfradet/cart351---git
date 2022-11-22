// Language JSON File Location
const LANGUAGE_PREF = 'language-preference-for-the-share-a-recipe-app'
let language = localStorage.getItem(LANGUAGE_PREF);
// Default Language
let default_lang = 'fr';
if (language === null) {
  language = default_lang;
}

// Set Selected Language
function setLanguage(lang) {
    localStorage.setItem(LANGUAGE_PREF, lang);
    language = localStorage.getItem(LANGUAGE_PREF);
    // Run Multi Language Plugin
    getLanguage()
}

// Run Multi Language Plugin
function getLanguage() {
    // Language on user preference
    (language == null) ? setLanguage(default_lang) : false;
    // Load data of selected language
    $.ajax({
        url: 'assets/locales/' + language + '.json',
        dataType: 'json', async: true
    }).done(function (lang) {
        // add selected language class to the body tag
        $('body').attr('class', language);
        // Loop through message in data
        $.each(lang, function (index, val) {
            (index === 'head') ? $(document).attr("title", val['title']) : false;
            $(index).children().each(function () {
                $(this).html(val[$(this).attr('key')])
            })
        })
    })
}

// Auto Loader
$(document).ready(function () {
    //set default (should remove if the website is fully default already)
    getLanguage(default_lang);
    //set to the user preff
    if (language != null && language !== default_lang)
        getLanguage(language);
});
