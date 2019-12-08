// initiating variables for card system, counts
var prevCard = null;
var couplesCount = 0;
var flippedCouples = 0;
var userCardNum = 0;

// storing audio files in variables
var rightAudio = new Audio("audio/right.mp3");
var wrongAudio = new Audio("audio/wrong.mp3");
var winAudio = new Audio("audio/win.mp3");
var booAudio = new Audio("audio/mike.mp3");
var mikeAudio = new Audio("audio/2319.mp3");

rightAudio.volume = wrongAudio.volume = winAudio.volume = mikeAudio.volume = 0.3;

var firstCard = 0;
var paired = 0;

// starting population of container elements for game and seed for randomization
window.onload = function () {

    setGame();
};


//==============================================================
// FUNCTIONS ===================================================
//==============================================================

// function 'setGame' for inserting randomized cards by user
function setGame() {

    var answerCount = 0;

    while (userCardNum < 3 || userCardNum > 16) { // limiting selection by # of photos

        var tempTry = "";

        if (answerCount > 0) tempTry = "Try again. ";
        userCardNum = prompt(tempTry + "Please enter number of cards for game (3-16):");

        if (answerCount === 0) answerCount = 1;
    }

    couplesCount = Math.floor((userCardNum / 2)); // getting couples count
    var cardURL = 0; // 'cardURL for random photo selection'
    var randomVault = []; // array to make sure each type has 2

    for (var q = 0; q < (couplesCount + (userCardNum % 2)); q++) {

        randomVault.push(0);
    }

    document.getElementById('playArea').classList.remove('pre-animation');
    for (var i = 1; i <= userCardNum; i++) { // loop for inserting cards

        while (cardURL === 0) { // randomising card type [1-8]

            // ensuring uneven # of cards get i + 1 options for cards while having i couples
            cardURL = Math.floor(Math.random() * (couplesCount + 1 + (userCardNum % 2)));

            if (randomVault[(cardURL - 1)] === 2) {

                cardURL = 0;
            }
        }
        console.log("RANDOM = " + cardURL);
        randomVault[(cardURL - 1)] += 1; // advancing card type count

        // using 'innerHTML' to insert card dynamicly
        document.getElementById("playArea").innerHTML += `

    <div class="container pre-animation animated jackInTheBox" id="container${i}">
        <div class="card" onclick="flip(this)">
            <div class="front">
                <img src="img/cards/back.png">
            </div> 
            <div class="back" id="backCard${i}">\n
                <img src='img/cards/${cardURL}.png' card-data='${cardURL}'>\n
            </div>
    </div>
\n\n
`;
        document.getElementById("container" + i).classList.remove("pre-animation");
        cardURL = 0; // resetting cardURL for new random value
    }
    
};



// funtion 'cardFlip' accepts cards, determines card pairings, victory
function flip(aCard) {

    if (paired === 1) {

        prevCard = null;
        paired = 0;
    }

    if (aCard.classList.contains("flipped")) return; // exit term for already flipped cards

    aCard.classList.add('flipped'); // if not already flipped, flip using shortened if term
    aCard.style.transform == "rotateY(180deg)" ? aCard.style.transform = "rotateY(0deg)" : aCard.style.transform = "rotateY(180deg)";

    // if it's the first card of a pair, save into 'prevCard'
    if (firstCard === 0) {

        prevCard = aCard;
        firstCard += 1;
    } else { // if it's the second card, check for a pairing

        paired = 1;

        var cardID1 = prevCard.children[1].children[0].getAttribute('card-data');
        var cardID2 = aCard.children[1].children[0].getAttribute('card-data');

        if (cardID1 === cardID2) { // if it's a pair, advance count and reset 'prevCard'

            flippedCouples += 1;

            if (flippedCouples === couplesCount) { // if it's the last pair, start 'victory' sequence

                console.log("VICTORY!");
                winAudio.play();
                confetti.start(); // celabrating the victory with confetti

                var giffy = document.getElementById('notASurprise');
                giffy.classList.remove('flipped'); // unveiling the hidden gif

                var hiddenPara = document.getElementById('restartPara');
                hiddenPara.classList.remove('flipped'); // unveiling the hidden paragraph

                setTimeout(function(){
                    confetti.stop();
                }, 10000);

            } else rightAudio.play(); // if it's not a winning pair, start 'correct move' sequence

            firstCard = 0;

        } else { // if it's not a correct pair, start 'wrong move' sequence with a 1s delay

            firstCard = 0;

            prevCard.classList.remove('flipped');
            aCard.classList.remove('flipped');

            setTimeout(function () {

                wrongAudio.play();

                prevCard.style.transform == "rotateY(180deg)" ? prevCard.style.transform = "rotateY(0deg)" : prevCard.style.transform = "rotateY(180deg)";
                aCard.style.transform == "rotateY(180deg)" ? aCard.style.transform = "rotateY(0deg)" : aCard.style.transform = "rotateY(180deg)";

            }, 750)

        }

    }

};

