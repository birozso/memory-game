/*
 * Create a list that holds all of your cards
 */
let cardsArray=[];
let clickOdd, clickEven, papa, mama, papaClass, mamaClass;
let moves = 0 , c = 0;
let pairNumber = 0;
let seconds = 0;
let starRate = 3;

/*
 * Creates  node lists for the card classes for the cards
 *   define the modal and the modal buttons
 *   also get the moves counter and the restart button elements
 *   Gets the clicking area
 */
let cardClass = document.querySelectorAll(".deck li");
let allCards = document.querySelectorAll(".card i");
let movesNumber = document.getElementById("movesNumber");
const restartButton = document.getElementById("restartButton");
const deckTable = document.getElementById("deckTable");
let starList = document.querySelector("#firstStar i");
const modal = document.getElementById('winnerModal');
const playBtn = document.getElementById('playBtn');
const noPlayBtn = document.getElementById('noPlayBtn');

/*
 * Reset all cards classes to a default value
 */
function myResetFunction() {
    document.body.removeEventListener("click", myResetFunction);
    pairNumber = 0;
    moves = 0;
    c=0;

    let noDisplay = document.querySelectorAll(".no-display");
    noDisplay.forEach(function(noD) {
        noD.classList.remove("no-display");
    });

    if (seconds > 0) {
        stopTime();
    }
    seconds = 0;
    startTimer();
    movesNumber.innerHTML = moves;

// remove the card status class (reset the cards)
    for (let i = 0; i < cardClass.length; i++){
        cardClass[i].className="";
        cardClass[i].className="card";
    }

    shuffle(cardsArray);
// remove the fa classes and set the new ones
    let n=0;
    allCards.forEach(function (allCard) {
        allCard.className="";
        allCard.classList=cardsArray[n];
        n++;
    });
}

/*
 * Shuffle function from http://stackoverflow.com/a/2450976
 */
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
 * Timer function, inspiration from http://logicalmoon.com/2015/05/using-javascript-to-create-a-timer/
 * several checks are here, depends of the elapsed time
 */
function startTimer() {
    let zeroInsertionS="0";
    let zeroInsertionM="0";

	timer = setInterval(function() {
    seconds ++;

    if ((seconds % 60) > 9) {
        zeroInsertionS="";
    }
    else {
        zeroInsertionS="0";
    }

    if ((seconds > 30) && (seconds < 60)) {
        starRate = 2;
        starList.classList.add("no-display");
    }
    else if (seconds === 60) {
        starRate = 1;
        starList = document.querySelector("#secondStar i");
        starList.classList.add("no-display");
    }

    if (seconds < 600) {
        zeroInsertionM="0";
    }
    else {
        zeroInsertionM="";
    }

	document.getElementById("seconds").innerText = zeroInsertionS + (seconds % 60).toString();
    document.getElementById("minutes").innerText = zeroInsertionM + parseInt(seconds / 60);

    }, 1000);
}

/*
 * Evaluates that the two clicked cards are pairs or not
 * calls the gameOver function is all cards are matched
 */
function checkingPairs() {
    if ((papaClass) === (mamaClass)) {
        clickEven.classList.add("match");
        clickOdd.classList.add("match");
        pairNumber += 1;
    }
    else {
        setTimeout(myClassRemover , 1500 , clickEven , "show" , clickOdd , "show");
        setTimeout(myClassRemover , 1500 , clickEven , "open" , clickOdd , "open");
    }

    if (pairNumber === 8) {
        stopTime();
        pairNumber=0;
        let scoreTimeSec=document.getElementById("seconds").innerText;
        let scoreTimeMin=document.getElementById("minutes").innerText;
        
        let els = document.querySelectorAll(".deck li");
        els.forEach(function(el) {
            el.classList.add("won");
        });

        setTimeout(gameOver , 3000 , scoreTimeMin , scoreTimeSec);
    }
}

function stopTime() {
    clearInterval(timer);
}

/*
 * gameOver function handles the actions after the play ends
 * calls a modal , display the time, rank and play-again-buttons.
 * create modal inspiration from: https://www.youtube.com/watch?v=6ophW7Ask_0
 */
function gameOver (scoreTimeMin , scoreTimeSec) {
    let htmlTextToAdd ="";
    const modalBody = document.querySelector('#modalBody');
    const myPara = document.createElement('p');

    myPara.textContent = 'Your time: '+ scoreTimeMin +' : '+ scoreTimeSec +'   Your rank: ';
    modalBody.appendChild(myPara);

    htmlTextToAdd="";
    for (let i=1; i<= starRate; i++) {
        htmlTextToAdd += '<i class="fa fa-star starr"></i> ';
    }
    modalBody.insertAdjacentHTML('beforeend', htmlTextToAdd);

    modalOpen();
    noPlayBtn.addEventListener('click', modalClose);
    playBtn.addEventListener('click', function closeReset() {
        modalClose();
        myResetFunction();
    });
}

/*
 * short function for removing card classes (2 at a time)
 */
function myClassRemover(classHolder1,className1,classHolder2,className2) {
    classHolder1.classList.remove(className1);
    classHolder2.classList.remove(className2);
}

/*
 * showing the cards and prepare data for pair evaluation
 * calls checkingPairs function after the 2nd click
 */
function cardClicking(event) {
    if (event.target && event.target.nodeName =="LI") {
        c++;
        moves++;
        if (moves % 2 === 0) {
            movesNumber.innerHTML = moves /2 ;
        }

        if (c === 1) {
            clickOdd = event.target;
            clickOdd.classList.add("open");
            clickOdd.classList.add("show");
            clickOdd.classList.add("clicked");
            papa = document.querySelector('.clicked i');
            papaClass = papa.classList.value;
            clickOdd.classList.remove("clicked");
        }
        else {
            clickEven = event.target;
            clickEven.classList.add("show");
            clickEven.classList.add("open");
            c = 0;
            clickEven.classList.add("clicked");
            mama = document.querySelector('.clicked i');
            mamaClass = mama.classList.value;
            clickEven.classList.remove("clicked");

            checkingPairs();
        }
    }
}

function modalOpen(){
    modal.style.display = 'block';
}

function modalClose(){
    modal.style.display = 'none';
}

restartButton.addEventListener("click", myResetFunction);

deckTable.addEventListener("click", cardClicking);

document.body.addEventListener("click", myResetFunction);

/*
 * fills the cards class value after reset and shuffle functions run
 */
for (let x = 0; x < allCards.length; x++){
    cardsArray[x]=allCards[x].classList.value;
}