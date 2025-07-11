let replayBtn = document.querySelector('#replayBtn');
let guessBtn = document.querySelector('#guessBtn');
let guessInput = document.querySelector('#guessInput');
let message = document.querySelector('#message');
let scoreContainer = document.querySelector('#scoreContainer');
let easyModeBtn = document.querySelector('#easyModeBtn'); // ajout
let score = 0;
let pkmn = null;
let userGuess = null;
let isReplay = false;
let easyMode = false;

function randomize(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

async function randomPkmn() {
    const random = randomize(1, 386);

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`);
    const data = await response.json();

    const speciesRes = await fetch(data.species.url); // NOMS EN FRANCAIS
    const speciesData = await speciesRes.json();

    const frName = speciesData.names.find(n => n.language.name === "fr").name.toLowerCase();
    data.frName = frName;

    console.log(data);
    return data;
}

async function displayPkmn() {
    easyMode = easyModeBtn.checked;
    pkmn = await randomPkmn();
    const pkmnImg = pkmn.sprites.other.showdown.front_default;
    document.querySelector('#img').src = pkmnImg;
    if (!easyMode) {
        document.querySelector('#img').classList.add('hide');
    } else {
        document.querySelector('#img').classList.remove('hide');
    }
}

displayPkmn();

// DISTANCE DE LEVENSHTEIN (Algo super cool qui permet d'autoriser les légères fautes de frappes de l'utilisateur)
function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
        Array.from({ length: b.length + 1 }, (_, j) =>
            i === 0 ? j : j === 0 ? i : 0
        )
    );
    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }
    return matrix[a.length][b.length];
}

function guessPkmn() {
    userGuess = guessInput.value.toLowerCase();
    const distance = levenshtein(userGuess, pkmn.frName);
    if (distance <= 1) { // ajuster la distance ici afin d'ajuster la permissivité des fautes de frappe.
        console.log("gagné");
        message.innerHTML = `<span style="color: #e3ff7eff;">Gagné !<br>C'était bien ${pkmn.frName}</span>`;
        document.querySelector('#img').classList.remove('hide');
        score++;
        scoreContainer.textContent = score;
        const pkmnCry = pkmn.cries.latest;
        const audio = new Audio(pkmnCry);
        audio.play();
    } else {
        message.innerHTML = `<span style="color: #f3653aff;">Perdu !<br>Le pokémon était ${pkmn.frName}</span>`;
        document.querySelector('#img').classList.remove('hide');
    }
    guessBtn.textContent = "Rejouer";
    isReplay = true;
}

guessBtn.addEventListener("click", () => {
    if (isReplay) {
        displayPkmn();
        document.querySelector('#img').classList.add('hide');
        guessInput.value = "";
        message.textContent = "";
        guessBtn.textContent = "Envoyer";
        isReplay = false;
    } else {
        guessPkmn();
    }
});

guessInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        guessBtn.click();
    }
});

// MODE FACILE 
easyModeBtn.addEventListener("change", () => {
    easyMode = easyModeBtn.checked;

    if (easyMode) {
        document.querySelector('#img').classList.remove('hide');
    } else {
        document.querySelector('#img').classList.add('hide');
    }
});
