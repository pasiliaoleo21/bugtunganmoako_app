var topic;
var askedQuestions = [];
var currentQuestion;
var correct = 0;
var wrong = 0;
var timer;
var counter = 10;

// get the current date and sisplays on the screen.
function setDate() {
    var date = new Date()
    var today = (date.getMonth() + 1) + '/' + date.getDay() + '/' + date.getFullYear();
    $('#date').html(today);
}

// generates the random number.
function getRandom(range) {
    return Math.floor(Math.random() * (range));
}


//function checks the cookie for topic else its generating the random topic and sets the topic.
function setTopic() {

    var topicFromCookie = cookieHelper.getCookie('topic');

    topic = topicFromCookie || subjects[getRandom(subjects.length)];
  
    $('#topic').html(topic);

    if(!topicFromCookie) {
        cookieHelper.setCookie('topic', topic, 1);    
    }
}


//function to pick the question randomly and sets the question.
function pickQuestion() {
// picking the subject dynamically
    var subject = window[topic];

    if(askedQuestions.length == subject.length){
         location.href = "thankyou.html?correct=" + correct + "&wrong=" + wrong;
         document.getElementById('#score').innerHTML = score;
         return;
    }
  //checking the index Not to ask same question again in the instance
    do {
        var randomQuestion = getRandom(subject.length);
    } while (askedQuestions.indexOf(randomQuestion) != -1)
// pushing the currently asked question index to array.
    askedQuestions.push(randomQuestion);
    // debugger;

    //Reset to empty if all questions are asked
    if (askedQuestions.length === subject.length) {
        $("#next").addClass('hide');
    }
    // picking the question from the subject.
    randomQuestion = subject[randomQuestion];
    return randomQuestion;
}


// function is called to set the question
function setQuestion() {
    var question = pickQuestion();
    currentQuestion = question;
    generateQuestionHtml(question);
    startTimer();
}

// dynamically generating the view based on the topic its picked.
function generateQuestionHtml(question) {
    var html = '<p>' + question.question + '</p>';

    if (question.questionType === 2) {
        html += '<p><input type="text" name="answer" id="answer"/></p>';
    } else {
        var list = '<ul>'

        for (var i = 0; i < question.choices.length; i++) {
            list += '<li><input type="radio" name="answer" value="' + question.choices[i] + '" id="answer'+i+'"/> <label for="' + 'answer' +i+ '">' + question.choices[i] + '</label> </li>'
        }

        list += '</ul>';

        html += list;
    }

    $("#question").html(html);
}

// updating the score.
function updateScores() {
    $("#scoreSection").removeClass('hide');
    $("#right").html(correct);
    $("#wrong").html(wrong);
}

// checking the answer.
function checkAnswer() {
    var ans;
    var correctAns;
    
    //  if the current Question is type 2 ,then get the value for the text box.
    if (currentQuestion.questionType === 2) {
        ans = $("input[name=answer]").val();
        correctAns = currentQuestion.correctAnswer;
    } else {
        // getting of the radio button thats checked.

        ans = $("input[name=answer]:checked").val();
        correctAns = currentQuestion.correctChoice;
    }

// checking correct answer along with the user answer.if is same , it increases the correct value.

    if (ans && correctAns && (ans.toLowerCase() === correctAns.toLowerCase())) {
        correct += currentQuestion.score;
    } else {
        wrong += currentQuestion.score;
    }

    updateScores();
    setQuestion();
}

function updateProgress() {
    var current = --counter;
    $("#time").html("Time: " + counter + 's')
    $("#timeProgress").width((current/10 * 100) + '%');
    if(current === 0) {
        clearTimer();
    }
}

function startTimer() {
    $(".progresscontainer").removeClass('hide');
    timer = setInterval(updateProgress, 1000);
}

function clearTimer() {
    if(timer){
        clearInterval(timer);
        counter = 10;
        checkAnswer();
        $("#timeProgress").width(100 + '%');
    }
}


// calls the setDate and Settopic function.
function init() {
    setDate();
    setTopic();
}
 
$("#start").click(function(e) {
    setQuestion();
    $(".startSection").addClass('hide');
    $("#quizsection").removeClass('hide');
});

// $("#next").click(function(e) {
//     // setQuestion();
//     checkAnswer();
// });

$("#quit").click(function(e) {
    location.href = "thankyou.html?correct=" + correct + "&wrong=" + wrong;
     document.getElementById('#score').innerHTML = score;
});

$("#submitAnswer").click(clearTimer);

// on load of the window the init function is called.
$(window).load(function() {
    init();
});
