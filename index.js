/**
 * 
 * 
 * 3.2 JS wiring: events + data extraction

You have a <form> with a submit button. That’s good—forms have built-in semantics.

Your job: implement these 3 functions in index.js

I’m not writing your whole file — I’m giving you “scaffolding” and you fill the gaps.

1) Get references once

Use document.querySelector / getElementById to grab:

the form

textarea

result container

result text node

status node

2) Handle submit

Attach:

form.addEventListener("submit", handleSubmit);


Inside handleSubmit(e):

e.preventDefault()

grab the textarea value (trim it)

grab the selected language

3) Read selected language (key concept)

Because all radios share name="language", you can select the checked one with:

document.querySelector('input[name="language"]:checked')


If none is selected, this returns null.
 * 
 * 
 * **/ 

// Get references once at the top of your script
const translationForm = document.getElementById('translation-form');
const translationInput = document.getElementById('translation-input');
const resultContainer = document.getElementById('result');
const resultTextNode = document.getElementById('result-text');
const statusNode = document.getElementById('status');


function handleTranslation(e) {
    e.preventDefault();

    // Use the FormData API to get values easily.
    const selectedLanguage = getSelectedLanguage();
    const textToTranslate = translationInput.value.trim();

    // reset UI state for a new attempt.
    setStatus("");
    hideResult();

    if (!textToTranslate) {
        setStatus('Please enter text to translate.');
        return;
    }

    if (!selectedLanguage) {
        setStatus("Please select a language.");
        return;
    }

    setStatus("Translating....");
    const translated = fakeTranslate(textToTranslate, selectedLanguage);
    renderResult(translated);
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

function fakeTranslate(text, language) {
  return `[${language}] ${text}`;
}
