//Game Variables
var buttonColours = ['red','blue','green','yellow'];

var gamePattern = []; //sequence gived by the game randomly.

var userClickedPattern = []; //User Clicked pattern

var started = false;
var level = 0;
//Highscores initialization
var storedHighscores = localStorage.getItem('highscores');
var highscores = storedHighscores ? JSON.parse(storedHighscores) : [];
localStorage.setItem('highscores', JSON.stringify(highscores));
var cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)highscores\s*=\s*([^;]*).*$)|^.*$/, "$1");
if (cookieValue) {
  highscores = JSON.parse(cookieValue);
}
console.log(highscores.length);
console.log("started");
if (highscores.length === 0) {highscores.push({ name: "Player1", score: 10 });}
displayHighscores(highscores);

//keyword detect
$(document).keypress(function() {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

//Start button press detect
$('#start-button').click(function() {
  if (!started) {
    $("#level-title").text("Level " + level);
    nextSequence();
    started = true;
  }
});

//User clicks on a button, the function recognizes the array and put in a array to know the clicked sequence.
$( ".btn").click(function(event) {

  var userChosenColour = event.target.id;
   userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatedPress(userChosenColour);

  checkAnswer(userClickedPattern.length-1);
});

//checking the answer.
function checkAnswer(currentLevel) {
  console.log(currentLevel);
console.log(gamePattern);
console.log(userClickedPattern);
    // check the most recen user answer.
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {

      console.log("success");

      // compare the length to know if its alredy finished.
      if (userClickedPattern.length === gamePattern.length){

        // Call nextSequence() after a 1000 millisecond delay.
        setTimeout(function () {
          nextSequence();
        }, 1000);

      }

    } else {

      console.log("wrong");

        var audio = new Audio("sounds/wrong.mp3");
        audio.play();


      $('body').addClass('game-over');
      setTimeout(function() {
           $('body').removeClass("game-over");
       }, 100);

      $('h1').text('Game Over, Press Any Key to Restart')
      // Ask for player to input the name after updating the highscores array:
      console.log("level:", level, " score: ", highscores[highscores.length - 1]);
      if (level > highscores[highscores.length - 1].score) {
      var playerName = prompt("Congratulations! Enter your name for the highscores:");
      highscores.push({ name: playerName, score: level });
      document.cookie = "highscores=" + JSON.stringify(highscores);
      highscores.sort(function (a, b) {
        return b.score - a.score;
      });
      }
      displayHighscores();
    startOver();


    }

}
// This function chose the random button, put in the game pattern array, flash the button, play the sound gived to the button.
function nextSequence () {
userClickedPattern = [];

  var randomNumber = Math.floor((Math.random()*4));

  var randomChosenColour = buttonColours[randomNumber];

  gamePattern.push(randomChosenColour);

  $('#'+randomChosenColour).fadeOut(100).fadeIn(100);

playSound(randomChosenColour);

level++;
$('h1').text('Level ' + level);

  }

//restart the game


//Play the sound when the game chose a colour and when the user click a button.
function playSound(name) {
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}

//Press animation

function animatedPress(currentColour) {
  $('#'+currentColour).addClass('pressed');

  setTimeout(function() {
       $('#'+currentColour).removeClass("pressed");
   }, 100);
}

function displayHighscores() {
  var highscoresList = document.getElementById("highscores-list");
  
  // Clear previous entries
  highscoresList.innerHTML = "";

  // The highscores list - populate and limit to 10 items
  for (var i = 0; i < highscores.length; i++) {
    var entry = highscores[i];
    var listItem = document.createElement("li");
    listItem.textContent = entry.name + ": " + entry.score;
    highscoresList.appendChild(listItem);
  }
  if (highscores.length > 10) {
    highscores = highscores.slice(0, 10);
  }
}

//reset the vaalues to start again.
function startOver() {

  level = 0;
  gamePattern = [];
  started = false;
}
