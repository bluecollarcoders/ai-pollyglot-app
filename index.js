
// Get references once at the top of your script
const translationForm = document.getElementById('translation-form');
const translationInput = document.getElementById('translation-input');
const resultContainer = document.getElementById('result');
const resultTextNode = document.getElementById('result-text');
const statusNode = document.getElementById('status');
const startOverBtn = document.getElementById("btn-start-over");
const originalTextNode = document.getElementById('original-text');
const composeView = document.getElementById("compose-view");

async function handleTranslation(e) {
    e.preventDefault();

    // Use the FormData API to get values easily.
    const selectedLanguage = getSelectedLanguage();
    const textToTranslate = translationInput.value.trim();
    const errors = [];

    // reset UI state for a new attempt.
    setStatus("");
    hideResult();

    if (!textToTranslate) errors.push('Please enter text to translate.');

    if (!selectedLanguage) errors.push("Please select a language.");

    if (errors.length) {
        setStatus(errors.join(" "));
        return;
    }

    try {
        setStatus("Translating....");
        const translated = await translateViaApi(textToTranslate, selectedLanguage);
        enterResultMode({original: textToTranslate, translated});
        setStatus(""); 
    } catch (err) {
        setStatus(err.message || "Something went wrong.");
    }

}

translationForm.addEventListener('submit', handleTranslation);

function getSelectedLanguage() {
    const checked = document.querySelector('input[name="language"]:checked');
    return checked ? checked.value : null;
}

function renderResult(translatedText) {
  resultTextNode.value = translatedText;   // textarea uses .value
  resultContainer.hidden = false;
}

function setStatus(message) {
    statusNode.textContent = message;
}

function hideResult() {
    resultContainer.hidden = true;
    resultTextNode.value = "";
}

startOverBtn.addEventListener("click", handleStartOver);

function handleStartOver() {
    enterComposeMode();
}

function enterResultMode({original, translated }) {
    originalTextNode.value = original;
    resultTextNode.value = translated;

    composeView.hidden = true;
    resultContainer.hidden = false;
}

function enterComposeMode() {
    // clear state
    setStatus("");

    // swap views
    resultContainer.hidden = true;
    composeView.hidden = false;

    // reset inputs
    translationForm.reset();
    translationInput.value = "";

    originalTextNode.value = "";
    resultTextNode.value = "";

    translationInput.focus();
}

async function translateViaApi(text, language) {
    const res = await fetch("/api/translate", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }, 
        body: JSON.stringify({text, language}),
    });

    // If server returns 4xx/5xx, fetch does NOT throw — you must check.
    if (!res.ok) {
        // Optional: try to read a JSON error message.
        let message = `Request failed (${res.status})`;
        try {
            const data = await res.json();
            if (data?.error) message = data.error;
        } catch (_) {}
        throw new Error(message);
    }

    const data = await res.json();

    // This matches option B
    return data.translatedText;
}

