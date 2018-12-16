var intervalID;
var timeOut;
var clockRunning = false;
var time = 30;
var questionArray = [];
var answerArray = [];
var correctAnswer;
var questionCounter = 0;
var score = 0;

function start() {
    $("#thing").remove();
    $("#gameDiv").append(`
        <div id="thing" class="d-flex flex-column justify-content-center align-items-center">
            <div id="timeRemaining" class="d-flex flex-row">
                <h4 class="pr-2">Time Left: </h4>
                <h4 id="time"></h4>
            </div>
            <div id="questionDiv"></div>
            <div class="possibleAnswers">

            </div>
            <div id="correctAnswer" class="answers">
                </div>
        </div>
    `);
    intervalID = setInterval(count, 1000);
    //timeOut = setTimeout(outOfTime, 4000);
    questionCounter = 0;
    questionArray = [];
    answerArray = [];
    var queryURL = "https://opentdb.com/api.php?amount=3&category=18&difficulty=easy&type=multiple";
    $.ajax({
        url: queryURL,
        method: "GET",
    }).then(function (response) {
        console.log(response);
        questionArray = response.results;
        console.log(questionArray);
        nextQuestion();
    })
}

function count() {
    console.log(clockRunning);
    if (clockRunning) {
        console.log(time);
        time--;
        $("#time").text(time);
        if (time < 0) {
            outOfTime();

        }
    }
}

function outOfTime() {
    time = 30;
    $("#time").text(time);
    clockRunning = false;
    $("#correctAnswer").append(`<div id="${correctAnswer}">Correct Answer is: ${correctAnswer}</div>`);
    console.log("out of time!");
    setTimeout(function () {
        nextQuestion();
    }, 3000);
}

function nextQuestion() {
    if (questionCounter < 10) {
        answerArray = questionArray[questionCounter].incorrect_answers;
        answerArray.push(questionArray[questionCounter].correct_answer);
        correctAnswer = questionArray[questionCounter].correct_answer;
        console.log(answerArray);
        console.log(questionCounter);
        $("#questionDiv").text(questionArray[questionCounter].question);
        $(".possibleAnswers").empty();
        $("#correctAnswer").empty();
        $(".possibleAnswers").append(`<div id="${answerArray[0]}" class="answer" onclick="checkAnswer(this)">${answerArray[0]}</div>`);
        $(".possibleAnswers").append(`<div id="${answerArray[1]}" class="answer" onclick="checkAnswer(this)">${answerArray[1]}</div>`);
        $(".possibleAnswers").append(`<div id="${answerArray[2]}" class="answer" onclick="checkAnswer(this)">${answerArray[2]}</div>`);
        $(".possibleAnswers").append(`<div id="${answerArray[3]}" class="answer" onclick="checkAnswer(this)">${answerArray[3]}</div>`);
        questionCounter++;
        clockRunning = true;
    }
    else {
        endGame();
    }

}

function checkAnswer(element) {
    if (element.id === correctAnswer) {
        time = 30;
        $("#time").text(time);
        clockRunning = false;
        $("#correctAnswer").append(`<div id="${correctAnswer}">You are correct!. Good Job! </div>`);
        $(`#${element.id}`).css("color", "green");
        $(".answer").attr("onclick", '');
        console.log("correctAnswer!");
        score++;
        setTimeout(function () {
            nextQuestion();
        }, 3000);
    } else {
        time = 30;
        $("#time").text(time);
        clockRunning = false;
        $("#correctAnswer").append(`<div id="${correctAnswer}">Correct Answer is: ${correctAnswer}</div>`);
        $(".answer").attr("onclick", '');
        console.log("out of time!");
        setTimeout(function () {
            nextQuestion();
        }, 3000);
    }

}

function endGame() {
    clockRunning = false;
    clearInterval(intervalID);
    clearTimeout(thing);
    console.log(intervalID);
    console.log("game over! no more questions!");
    $("#thing").empty();
    $("#thing").append(`
        <div>You got ${score} questions correct out of 10. Restart?</div>
        <button onclick="start()">Restart Game</button>
        `);
}
