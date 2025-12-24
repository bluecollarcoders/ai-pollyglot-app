
// Get references once at the top of your script
const translationForm = document.getElementById('translation-form');
const translationInput = document.getElementById('translation-input');
const resultContainer = document.getElementById('result');
const resultTextNode = document.getElementById('result-text');
const statusNode = document.getElementById('status');
const startOverBtn = document.getElementById("btn-start-over");
const originalTextNode = document.getElementById('original-text');
const composeView = document.getElementById("compose-view");

function handleTranslation(e) {
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

    setStatus("Translating....");
    const translated = fakeTranslate(textToTranslate, selectedLanguage);
    enterResultMode({original: textToTranslate, translated});
    setStatus("");
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

function fakeTranslate(text, language) {
  return `[${language}] ${text}`;
}
