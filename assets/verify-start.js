// Handle international prefixes, format phone input field
// Uses intl-tel-input library
const phoneInputField = document.querySelector("#phone_number");
const phoneInput = window.intlTelInput(phoneInputField, {
    // https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2
    preferredCountries: ["us", "co", "in", "de"],
    separateDialCode: true,
    utilsScript:
    "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/16.0.11/js/utils.js"
});

$("#channel-select").change(function() {
    const channel = $("input[name='channel']:checked").val();
    if (channel === "email") {
    $(".phone-input").hide();
    $(".email-input").show();
    } else if (channel === "sms" || channel === "call") {
    $(".phone-input").show();
    $(".email-input").hide();
    }
});

function showVerificationStatus(alertType, message) {
    var content = $(".result-message");
    content.empty();
    content.append($("<div>")
    .addClass(`alert alert-${alertType}`)
    .attr("role", "alert")
    .text(message))
}

function showVerificationStartError(error) {
    var content = $("#form-error");
    content.empty();
    content.append(`Error: ${error}`);
}

var to;

$("#login").submit(function(event) {
    event.preventDefault();

    const channel = $("input[name='channel']:checked").val();
    const locale = $("#select-locale").val();
    to = (channel === "email") ? $("#email").val() : phoneInput.getNumber();

    // Twilio functions do not accept multipart/form-data
    const data = new URLSearchParams();
    data.append("to", to);
    data.append("channel", channel);
    data.append("locale", locale);

    fetch("./start-verify", {
        method: "POST",
        body: data
    })
    .then(response => {
        const content = $(".result-message");
        content.empty();
        return response.json()
    })
    .then(json => {
        if (json.success) {
            $("#form-error").empty();
            window.location.href = `/verify-check.html?to=${encodeURIComponent(to)}`;
            console.log("Successfully sent token.");
        } else {
        console.log(json.error);
        showVerificationStartError(
            `${json.error.message} <a href="${json.error.moreInfo}">[more info]</a>`);
        }
    })
    .catch(err => {
        console.log(err);
        showVerificationStartError("Error starting verification.");
    });
});

const locales = [
    { text: "English", value: "en" },
    { text: "Afrikaans", value: "af" },
    { text: "Arabic", value: "ar" },
    { text: "Catalan", value: "ca" },
    { text: "Chinese", value: "zh" },
    { text: "Chinese (Mandarin)", value: "zh-CN" },
    { text: "Chinese (Cantonese)", value: "zh-HK" },
    { text: "Croatian", value: "hr" },
    { text: "Czech", value: "cs" },
    { text: "Danish", value: "da" },
    { text: "Dutch", value: "nl" },
    { text: "English (British)", value: "en-GB" },
    { text: "Finnish", value: "fi" },
    { text: "French", value: "fr" },
    { text: "German", value: "de" },
    { text: "Greek", value: "el" },
    { text: "Hebrew", value: "he" },
    { text: "Hindi", value: "hi" },
    { text: "Hungarian", value: "hu" },
    { text: "Indonesian", value: "id" },
    { text: "Italian", value: "it" },
    { text: "Japanese", value: "ja" },
    { text: "Korean", value: "ko" },
    { text: "Malay", value: "ms" },
    { text: "Norwegian", value: "nb" },
    { text: "Polish", value: "pl" },
    { text: "Portuguese - Brazil", value: "pt-BR" },
    { text: "Portuguese", value: "pt" },
    { text: "Romanian", value: "ro" },
    { text: "Russian", value: "ru" },
    { text: "Spanish", value: "es" },
    { text: "Swedish", value: "sv" },
    { text: "Tagalog", value: "tl" },
    { text: "Thai", value: "th" },
    { text: "Turkish", value: "tr" },
    { text: "Vietnamese", value: "vi" }
];

const selectLocale = $("#select-locale");

locales.forEach(l => {
    selectLocale.append($("<option>")
    .val(l.value)
    .text(l.text))
});