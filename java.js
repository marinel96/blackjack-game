var all_buttons = document.getElementsByTagName('button');


var copyAllButtons = [];
for(let i=0; i<all_buttons.length; i++) {
copyAllButtons.push(all_buttons[i].classList[1]);
}

function buttonColorChange (buttonThingy) {
    if(buttonThingy.value === 'red'){
        buttonRed();
    }else if (buttonThingy.value === 'green') {
        buttonGreen();
    }else if (buttonThingy.value === 'reset') {
        buttonColorRest();
    }else if (buttonThingy.value === 'random') {
        randomColors();
    }
}

function buttonRed() {
    for (let i=0; i < all_buttons.length; i++) {
        all_buttons[i].classList.remove(all_buttons[i].classList[1]);
        all_buttons[i].classList.add('btn-danger');
    }
}

function buttonGreen() {
    for (let i=0; i < all_buttons.length; i++) {
        all_buttons[i].classList.remove(all_buttons[i].classList[1]);
        all_buttons[i].classList.add('btn-success');
    }
}

function buttonColorRest () {
    for(let i=0; i < all_buttons.length; i++) {
        all_buttons[i].classList.remove(all_buttons[i].classList[1]);
        all_buttons[i].classList.add(copyAllButtons[i]);
    }
}

function randomColors() {
    let choices = ['btn-primary', 'btn-danger', 'btn-success', 'btn-danger']

    for (let i=0; i < all_buttons.length; i++) {
    let randomNumber = Math.floor(Math.random()*4);
    all_buttons[i].classList.remove(all_buttons[i].classList[1]);
    all_buttons[i].classList.add(choices[randomNumber]);
}
}

//Challenge 5 blackjack
let blackjackGame = {
    'you':{'scoreSpan': '#your-blackjack-result', 'div': '#your-box', 'score': 0},
    'bot':{'scoreSpan': '#bot-blackjack-result', 'div': '#bot-box', 'score': 0},
    'cards': ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'K', 'Q', 'J', 'A'],
    'cardsMap' :{'2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9, '10':10, 'K':10, 'Q':10, 'J':10, 'A':[1, 11]},
    'wins' : 0,
    'losses' : 0,
    'draws' : 0, 
    'isStand' : false,
    'turnsOver' : false,
};

const YOU = blackjackGame['you']
const BOT = blackjackGame['bot']

const hitSound = new Audio('./blackjack_assets/sounds/swish.m4a');
const winSound = new Audio('./blackjack_assets/sounds/cash.mp3');
const loseSound = new Audio('./blackjack_assets/sounds/aww.mp3');

document.querySelector('#blackjack-hit-button').addEventListener('click', blackjackHit);
document.querySelector('#blackjack-stand-button').addEventListener('click', botLogic);
document.querySelector('#blackjack-deal-button').addEventListener('click', blackjackDeal);


function blackjackHit() {
    if (blackjackGame['isStand'] === false) {
    let card = randomCard();
    showCard(card, YOU);
    updateScore(card, YOU);
    showScore(YOU);
}
}

function randomCard (){
    let randomIndex = Math.floor(Math.random()*13);
    return blackjackGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
    if (activePlayer['score'] <=21) {
    let cardImage = document.createElement('img');
    cardImage.src = `./blackjack_assets/images/${card}.png`;
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
     }
}

function blackjackDeal() {
    if (blackjackGame['turnsOver']=== true)  {

        blackjackGame['isStand'] = false;
    let yourImages = document.querySelector('#your-box').querySelectorAll('img');
    let botImages = document.querySelector('#bot-box').querySelectorAll('img');
    
    for(i=0; i < yourImages.length; i++) {
        yourImages[i].remove();
    }
    
    for(i=0; i < botImages. length; i++) {
        botImages[i].remove();
    }

    YOU['score'] = 0;
    BOT['score'] = 0;
    document.querySelector('#your-blackjack-result').textContent = 0;
    document.querySelector('#bot-blackjack-result').textContent = 0;

    document.querySelector('#your-blackjack-result').style.color ='#ffffff';
    document.querySelector('#bot-blackjack-result').style.color ='#ffffff';

    document.querySelector('#blackjack-result').textContent = "Let's play";
    document.querySelector('#blackjack-result').style.color = 'black';

    blackjackGame['turnsOver'] = false;
}
}

function updateScore(card, activePlayer) {
    if (card === 'A') {
    if (activePlayer['score'] + blackjackGame['cardsMap'] [card] [1] <=21) {
        activePlayer['score'] += blackjackGame['cardsMap'] [card] [1];
    }else {
        activePlayer['score'] += blackjackGame['cardsMap'] [card] [0];
    }
}   
else {
    activePlayer['score'] += blackjackGame['cardsMap'] [card];
}
}


function showScore(activePlayer) {
    if (activePlayer['score'] > 21) {
        document.querySelector(activePlayer['scoreSpan']).textContent = 'BUST';
        document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
    }else {
    document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
}
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function botLogic() {
    blackjackGame['isStand'] = true;

    while (BOT['score'] < 16 && blackjackGame['isStand'] === true) {
        let card = randomCard();
            showCard(card, BOT);
            updateScore(card, BOT);
            showScore(BOT);
            await sleep(1000)

     }
       
     blackjackGame['turnsOver'] = true;
     let winner = decideWinner();
    showResult(winner);
        
    
}

function decideWinner() {
    let winner;

    if (YOU['score'] <= 21) {
        if (YOU['score'] > BOT['score'] || (BOT['score'] > 21)) {
            blackjackGame['wins']++;
            winner = YOU;

        }else if (YOU['score'] < BOT['score']) {
            blackjackGame['losses']++;
            winner = BOT;

        }else if (YOU['score'] === BOT['score']) {
            blackjackGame['draws']++;

        }
    } else if (YOU['score'] > 21 && BOT['score'] <= 21) {
        blackjackGame['losses']++;
        winner = BOT;
    } else if (YOU['score'] > 21 && BOT['score'] > 21) {
        blackjackGame['draws']++;
    }

    return winner;
}

function showResult(winner) {
let message, messageColor;

if (blackjackGame['turnsOver'] === true) {

    if(winner === YOU) {
        document.querySelector('#wins').textContent = blackjackGame['wins'];
        message = 'You won!';
        messageColor = 'green';
        winSound.play();
    }else if(winner === BOT) {
        document.querySelector('#losses').textContent = blackjackGame['losses'];
        message = 'You lost!';
        messageColor = 'red';
        loseSound.play();
    }else {
        document.querySelector('#draws').textContent = blackjackGame['draws'];
        message = 'You drew!';
        messageColor = 'black';
    }

    document.querySelector('#blackjack-result').textContent = message;
    document.querySelector('#blackjack-result').style.color = messageColor;
    }
}