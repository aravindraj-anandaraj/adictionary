let api_url = 'https://api.dictionaryapi.dev/api/v2/entries/en';

let word = document.getElementById('word');
let phonetics = document.getElementById('phonetics');
let etymology = document.getElementById('etymology');
let recent = document.getElementById('recent-list');
let noun = document.getElementById('noun');
let verb = document.getElementById('verb');
let content = document.getElementById('content');
let search = document.getElementById('search');
let pos = document.getElementById('partOfSpeech');

let vocabulary;
// To store the recent search results
let history = [];

word.addEventListener('change', (e) => {
    console.log(e.target.value, "word");
    displayDict(e.target.value);
    getHistory(e.target.value);
});

search.addEventListener('onclick', (e) => {
    console.log("search");
    displayDict(word.value);
    getHistory(word.value);
});

// Select noun or verb based on availability and 
// display its meaning based on user preference
pos.addEventListener('change', (e) => {
    selectedPart = pos.selectedOptions[0].value;
    noun.innerHTML = '';
    verb.innerHTML = '';
    if(selectedPart == "noun") {
        getNoun();
    }
    if(selectedPart == "verb") {
        getVerb();
    }
})

async function displayDict(word) {
    noun.innerHTML = '';
    verb.innerHTML = '';
    pos.innerHTML = '';
    phonetics.innerHTML = '';
    etymology.innerHTML = '';
    content.style.display = 'grid';
    vocabulary = await fetch(`${api_url}/${word}`).then(res => res.json());
    console.log(vocabulary);
    vocabulary[0].meanings.forEach(({ partOfSpeech }) => {
        console.log(partOfSpeech);
        pos.innerHTML = pos.innerHTML + `<option value="${partOfSpeech}" ${partOfSpeech == "noun" ? "selected" : ""}>${partOfSpeech}</option>`;
    })
    getEtymology();
    getPhonetics();
    // To display only the meanings of noun by default to the user
    getNoun();
}

// To get the etymology of the searched keyword
function getEtymology() {
    etymology.innerHTML = `${vocabulary[0].origin}`;
}

// To get the phonetics of the searched keyword
function getPhonetics() {
    console.log(vocabulary[0].phonetics);
    vocabulary[0].phonetics.forEach(({ text, audio }) => {
        phonetics.innerHTML += `
        <li>
        <h4>${text}</h4>
        <button style="display:${audio ? "block" : "none"};" class="btn btn-primary" onClick="playPhonetic('${audio}')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-soundwave" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8.5 2a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-1 0v-11a.5.5 0 0 1 .5-.5zm-2 2a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zm-6 1.5A.5.5 0 0 1 5 6v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm8 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm-10 1A.5.5 0 0 1 3 7v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5zm12 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0V7a.5.5 0 0 1 .5-.5z"/>
            </svg> Play
        </button>
        </li>`;
    })
}

// To display the meanings of noun under the searched keyword
function getNoun() {
    let nounPart = vocabulary[0].meanings.filter((mean) => {
        return mean.partOfSpeech == "noun"
    });
    if(nounPart[0]) {
        nounPart[0].definitions.forEach(({ definition, example }, index) => {
            noun.innerHTML += `
            <li>
                <h5>${index + 1}. ${definition}</h5>
                <p style="display:${example ? "block" : "none"};">Ex : ${example}</p>
            </li>`;
        })
    }
}

// To display the meanings of verb under the searched keyword
function getVerb() {
    let verbPart = vocabulary[0].meanings.filter((mean) => {
        return mean.partOfSpeech == "verb"
    });
    if(verbPart[0]) {
        verbPart[0].definitions.forEach(({ definition, example }, index) => {
            verb.innerHTML += `
            <li>
                <h5>${index + 1}. ${definition}</h5>
                <p style="display:${example ? "block" : "none"};">Ex : ${example}</p>
            </li>`;
        })
    }
}

// To display the recent search results
function getHistory(key) {
    history.push(key);
    recent.innerHTML = '';
    history.forEach((search) => {
        recent.innerHTML = `<li>${search}</li>` + recent.innerHTML;
    })
}

// To play the pronounciation audio
function playPhonetic(file) {
    var audio = new Audio(file);
    console.log(audio);
    audio.play();
}