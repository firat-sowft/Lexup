const words = {
    lotr: ['sauron', 'galadriel', 'gandalf', 'aragorn', 'frodo', 'elrond', 'arwen', 'legolas', 'gollum', 'gimli', 'balrog', 'eowyn', 'pippin', 'saruman', 'samwise', 'boromir', 'theoden', 'merry', 'faramir', 'eomer',  'elendil', 'grima'],
    marvel: ['ironman', 'thor', 'captainamerica', 'hulk', 'blackwidow', 'spiderman', 'captainmarvel', 'hawkeye', 'scarletwitch', 'vision', 'antman', 'starlord', 'gamora', 'doctorstrange', 'loki', 'thanos', 'ultron', 'groot', 'blackpanther', 'falcon', 'wintersoldier', 'warmachine'],
    legends: ['godfather', 'scarface']
};

const hints = {
    sauron: 'Dark Lord of Mordor',
    galadriel: 'Lady of Lothlórien',
    ironman: 'Genius, billionaire, playboy, philanthropist',
    thor: 'God of Thunder',
    godfather: 'Mafia boss',
    scarface: 'Famous gangster',
    captainamerica: 'Super soldier',
    hulk: 'Green giant',
    blackwidow: 'Master spy',
    spiderman: 'Friendly neighborhood hero',
    captainmarvel: 'Cosmic superhero',
    hawkeye: 'Expert archer',
    scarletwitch: 'Reality warper',
    vision: 'Synthezoid',
    antman: 'Size-shifting hero',
    starlord: 'Leader of the Guardians',
    gamora: 'Deadliest woman in the galaxy',
    doctorstrange: 'Master of the Mystic Arts',
    loki: 'God of Mischief',
    thanos: 'Mad Titan',
    ultron: 'Artificial intelligence',
    groot: 'Flora colossus',
    blackpanther: 'King of Wakanda',
    falcon: 'Winged Avenger',
    wintersoldier: 'Super soldier',
    warmachine: 'Armored Avenger',
    gandalf: 'Wizard of Middle-earth',
    aragorn: 'King of Gondor',
    frodo: 'Ring-bearer',
    elrond: 'Lord of Rivendell',
    arwen: 'Elven princess',
    legolas: 'Elven archer',
    gollum: 'Creature corrupted by the One Ring',
    gimli: 'Dwarf warrior',
    balrog: 'Demon of the ancient world',
    eowyn: 'Shieldmaiden of Rohan',
    pippin: 'Hobbit of the Shire',
    saruman: 'Corrupted wizard',
    samwise: 'Loyal friend of Frodo',
    boromir: 'Son of Denethor',
    theoden: 'King of Rohan',
    merry: 'Hobbit of the Shire',
    faramir: 'Brother of Boromir',
    eomer: 'Marshal of the Riddermark',
    elendil: 'High King of Arnor and Gondor',
    grima: 'Advisor to King Théoden'
};

let currentWord = '';
let attempts = 0;
let jokerCount = 5;
let currentCategory = '';
let userEmail = ''; // Store the user's email
let userProgress = []; // Store the user's progress
let userImages = []; // Store the user's images

function startGame(category) {
    currentCategory = category;
    const wordList = words[category].filter(word => !userProgress.includes(word));
    if (wordList.length === 0) {
        document.getElementById('message').innerText = 'Başarıyla bu kategoriyi bitirdiniz!';
        document.getElementById('next-button').classList.add('hidden');
        showKnownWords(category);
        return;
    }
    currentWord = wordList[Math.floor(Math.random() * wordList.length)];
    attempts = 0;
    jokerCount = 5;
    document.getElementById('word-container').innerHTML = '';
    document.getElementById('hint').innerText = hints[currentWord];
    document.getElementById('joker-count').innerText = `Joker Hakkı: ${jokerCount}`;
    document.getElementById('message').innerText = '';
    document.getElementById('next-button').classList.add('hidden');
    showGamePage();
    createWordBoxes();
}

function showGamePage() {
    document.getElementById('categories-page').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');
}

function createWordBoxes() {
    const container = document.getElementById('word-container');
    const attemptContainer = document.createElement('div');
    attemptContainer.classList.add('attempt');
    for (let i = 0; i < currentWord.length; i++) {
        const input = document.createElement('input');
        input.type = 'text';
        input.maxLength = 1;
        input.dataset.index = i;
        input.addEventListener('input', checkLetter);
        attemptContainer.appendChild(input);
    }
    container.appendChild(attemptContainer);
}

function checkLetter(event) {
    const input = event.target;
    if (input.nextElementSibling) {
        input.nextElementSibling.focus();
    }
    checkWord();
}

function checkWord() {
    const inputs = document.querySelectorAll('.attempt:last-child input');
    let allFilled = true;
    inputs.forEach(input => {
        if (input.value === '') {
            allFilled = false;
        }
    });

    if (allFilled) {
        let correct = true;
        inputs.forEach(input => {
            const index = input.dataset.index;
            const letter = input.value.toLowerCase();
            if (letter === currentWord[index]) {
                input.style.backgroundColor = 'green';
            } else if (currentWord.includes(letter)) {
                input.style.backgroundColor = 'orange';
            } else {
                input.style.backgroundColor = 'red';
            }
            if (letter !== currentWord[index]) {
                correct = false;
            }
        });

        if (correct) {
            document.getElementById('message').innerText = 'Tebrikler, kelimeyi bildiniz!';
            document.getElementById('next-button').classList.remove('hidden');
            document.getElementById('view-image-button').classList.remove('hidden');
            saveProgress();
        } else if (attempts >= 2) {
            document.getElementById('message').innerText = `Üzgünüz, kelimeyi bilemediniz. Kelime: ${currentWord}`;
            document.getElementById('next-button').classList.remove('hidden');
        } else {
            attempts++;
            createNewAttemptBoxes();
        }
    }
}

function createNewAttemptBoxes() {
    createWordBoxes();
}

function useJoker() {
    if (jokerCount > 0) {
        jokerCount--;
        document.getElementById('joker-count').innerText = `Joker Hakkı: ${jokerCount}`;
        const inputs = document.querySelectorAll('.attempt:last-child input');
        const emptyInputs = Array.from(inputs).filter(input => input.value === '');
        if (emptyInputs.length > 0) {
            const randomInput = emptyInputs[Math.floor(Math.random() * emptyInputs.length)];
            randomInput.value = currentWord[randomInput.dataset.index];
            randomInput.style.backgroundColor = 'green';
            randomInput.disabled = true;
            checkWord(); // Check the word after using a joker
        }
    }
}

function nextWord() {
    document.getElementById('view-image-button').classList.add('hidden');
    startGame(currentCategory);
}

function saveProgress() {
    userProgress.push(currentWord);
    const image = `${currentWord}.jpg`;
    userImages.push(image);
    fetch('http://localhost:5000/update_progress', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail, word: currentWord, image: image })
    });
}

function viewWonImage() {
    const image = `${currentWord}.jpg`;
    document.getElementById('won-image').src = `../static/images/${image}`;
    document.getElementById('game-page').classList.add('hidden');
    document.getElementById('image-viewer').classList.remove('hidden');
}

function closeImageViewer() {
    document.getElementById('image-viewer').classList.add('hidden');
    document.getElementById('game-page').classList.remove('hidden');
}

function showKnownWords(category) {
    const container = document.getElementById('word-container');
    container.innerHTML = '<h3>Bildikleriniz:</h3>';
    userProgress.forEach(word => {
        if (words[category].includes(word)) {
            const wordElement = document.createElement('p');
            wordElement.innerText = `${word} - ${hints[word]}`;
            container.appendChild(wordElement);
        }
    });
}
