const latinPhrases = [
    "Consuetudo est altera natura",
    "Nota bene",
    "Nulla calamitas sola",
    "Per aspera ad astra"
];

const russianPhrases = [
    "Привычка - вторая натура",
    "Заметьте хорошо!",
    "Беда не приходит одна",
    "Через тернии к звёздам"
];

let availableIndices = [];
let phraseCounter = 0;

function initializeIndices() {
    for (let i = 0; i < latinPhrases.length; i++) {
        availableIndices.push(i);
    }
}

function getRandomIndex() {
    const randomPos = Math.floor(Math.random() * availableIndices.length);
    const index = availableIndices[randomPos];
    availableIndices.splice(randomPos, 1);
    return index;
}

initializeIndices();

function addPhrase() {
    const randDiv = document.getElementById('rand');

    if (availableIndices.length === 0) {
        alert("Фразы закончились");
        randDiv.innerHTML = '';
        initializeIndices();
        phraseCounter = 0;
        return;
    }

    const index = getRandomIndex();

    const newParagraph = document.createElement('p');
    newParagraph.id = `phrase_${phraseCounter}`;

    phraseCounter++;
    const className = (phraseCounter % 2 === 0) ? 'class1' : 'class2';
    newParagraph.className = className;

    newParagraph.innerHTML = `
        <span class="phrase-number">n=${phraseCounter}</span>
        <span class="latin">"${latinPhrases[index]}"</span>
        <span class="russian">"${russianPhrases[index]}"</span>
    `;

    randDiv.appendChild(newParagraph);

}

function repaintPhrases() {
    const randDiv = document.getElementById('rand');
    const paragraphs = randDiv.getElementsByTagName('p');

    for (let i = 0; i < paragraphs.length; i++) {
        if (i % 2 !== 0) {
            paragraphs[i].classList.add('bold');
        }
    }
}
