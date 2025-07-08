let replayBtn = document.querySelector('#replayBtn');
let guessBtn = document.querySelector('#guessBtn');
let guessInput = document.querySelector('#guessInput');
let message = document.querySelector('#message');
let scoreContainer = document.querySelector('#scoreContainer')
let score = 0
let pkmn = null;
let userGuess = null;

function randomize(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

async function randomPkmn() {
    const random = randomize(1, 151)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${random}`, {
        method: "GET"
    })
    const data = await response.json()
    console.log(data.name);
    console.log(data);
    return data;
}

async function displayPkmn() {
    pkmn = await randomPkmn();
    const pkmnImg = pkmn.sprites.other.showdown.front_default;
    document.querySelector('#img').src = pkmnImg;
}

displayPkmn();

function guessPkmn() {
    userGuess = guessInput.value;
    if (userGuess === pkmn.name) {
        console.log("gagné");
        message.textContent = "Gagné !";
        score++;
        scoreContainer.textContent = score
        const pkmnCry = pkmn.cries.latest
        const audio = new Audio(pkmnCry)
        audio.play()
    } else {
        message.textContent = `Perdu ! Le pokémon était ${pkmn.name}`;
    }
}

guessBtn.addEventListener("click", () => {
    guessPkmn();
});

guessInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        guessPkmn();
    }
});

replayBtn.addEventListener("click", () => {
    displayPkmn();              
    guessInput.value = "";      
    message.textContent = ""; 
});
