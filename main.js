// Get Elements
let quizApp = document.querySelector(".quiz-app");
let questionsNumberSpan = document.querySelector(".quiz-info .question-number span");
let bullets = document.querySelector(".control .bullets");
let quizArea = document.querySelector(".quiz-area");
let answerArea = document.querySelector(".answer-area");
let submitBtn = document.querySelector(".submit-button");
let countDown = document.querySelector(".timer");
let res = document.querySelector(".res");
let timer = null;
let startButton = document.querySelector(".began button.start");
let startArea = document.querySelector(".began");
let errorPg = document.querySelector(".error");
// Set Settings
let count;
let currentIndex = 0;
let correctAnswer = 0;
let duration = 20;
let isStart = false;
// Start The Quize
startButton.onclick = function(){
    startArea.remove();
    quizApp.style.display = "block";
    isStart = true;
    getQuestions();
}

// Get The Data

 async function getQuestions(){
    if(!isStart){
        return false;
    }
    try{
        let myRequest = await fetch("https://opentdb.com/api.php?amount=25&difficulty=easy&type=multiple");
        if(! myRequest.ok) throw new Error("There Is A problem In Request");
        let data = await myRequest.json();
        count = data.results.length;
        // Number Of Questions In the Info Area And Bullets And Create The Questions And Answers
        // Reset Span
        countQuestions(count);
        createQuizArea(data.results[currentIndex]);
        // Count Down Function 
        clearInterval(timer);
        countDownFun(duration);
        // Submit Button
        submitBtn.onclick = function(){
            submitFun(data);

        }

    }
    catch(error){
        errorPg.style.display = "block";
        console.error(error);
        submitBtn.remove()
    }
}


function countQuestions(num){
    questionsNumberSpan.textContent = `${num}`;
    for(let i =0; i < num; i++){
        let sp = document.createElement("span");
        if(i === 0 ) sp.classList.add("on");
        bullets.appendChild(sp);
    }
}

function createQuizArea(obj){
    if(currentIndex >= count) return false;
    let h = document.createElement("h2");
    h.classList.add("title");
    let rawQ = obj.question;
    let qn = decode(rawQ);
    h.textContent = qn;
    quizArea.appendChild(h);
    //Prepare For Answer

    let answers = [];

    // add Correct Aswer
    let corr = obj.correct_answer;
    corr = decode(corr);
    answers.push(corr);
    obj.incorrect_answers.forEach(function(ele){
        let temp = decode(ele);
        answers.push(temp);
    });
    answers = answers.sort(() => Math.random() - 0.5);
    
    // Create It In The Page

    for(let i =0; i < answers.length; i++){
        let div = document.createElement("div");
        div.classList.add("answer");
        let input = document.createElement("input");
        input.type = "radio";
        input.name = "question";
        input.id = `answer_${i+1}`;
        input.dataset.value = answers[i];
        if(i === 0) input.checked = true;
        div.appendChild(input);

        let label = document.createElement("label");
        label.htmlFor = `answer_${i+1}`;
        label.textContent = answers[i];

        div.appendChild(label);
        answerArea.appendChild(div);
    }
}

function submitFun(data){
    clearInterval(timer);
    // Check The Answer
    checkAnswers(data.results[currentIndex]);
    currentIndex++
    if(currentIndex < count){
        quizArea.innerHTML = "";
        answerArea.innerHTML = "";
        resetBullets();
        createQuizArea(data.results[currentIndex]);
        countDownFun(duration);
    }else{
        finish();
    }
}

function resetBullets(){
    let bulletd = document.querySelectorAll(".bullets span");
    for(let i = 0; i <= currentIndex;i ++){
        bulletd[i].classList.add("on");
    }
}

function checkAnswers(obj){
    let input = document.querySelectorAll(".answer input");
    for(let i =0; i < input.length; i++){
        if(input[i].checked){
            if(input[i].dataset.value === decode(obj.correct_answer)){
                correctAnswer++;
            } 
        }
    }
}


function finish(){
    if(currentIndex >= count){
        quizArea.remove();
        answerArea.remove();
        submitBtn.remove();
        bullets.remove();
        countDown.remove();
        theRes();
    }
}
function theRes(){
    let div = document.createElement("div");
    let sol = document.createElement("div");
    let sp = document.createElement("span");
    if(correctAnswer >= (count / 2) && correctAnswer < count){
        res.classList.add("good");
        sp.textContent = `Good`;
        div.appendChild(document.createTextNode("You Did A "));
        div.appendChild(sp);
        div.appendChild(document.createTextNode(" Job"));
    }
    else if(correctAnswer < (count / 2)){
        res.classList.add("bad");
        sp.textContent = `Next Time, `;
        div.appendChild(sp);
        div.appendChild(document.createTextNode("Make It Better"));
    }
    else if(correctAnswer === count){
        res.classList.add("perfect");
        div.appendChild(document.createTextNode("You Did A "));
        sp.textContent = `Perfect`;
        div.appendChild(sp);
        div.appendChild(document.createTextNode(" Job"));
    }
    let txt = document.createTextNode("Your Resuilt Is: ");
    sol.appendChild(txt);
    let span = document.createElement("span");
    span.textContent = `${correctAnswer} From ${count}`;
    sol.appendChild(span);
    res.appendChild(div);
    res.appendChild(sol);
}

function countDownFun(dur ){
    if(currentIndex >= count) return false;
    let min, sec;
    timer = setInterval(function(){
        min = parseInt(dur / 60);
        sec = parseInt(dur % 60);
        min = min.toString().padStart(2 , "0");
        sec = sec.toString().padStart(2 , "0");
        countDown.innerHTML = `${min}:${sec}`;
        if(--dur < 0){
                clearInterval(timer);
                submitBtn.click();
            }
    }, 1000);
}



function decode(text) {
    let doc = new DOMParser().parseFromString(text, "text/html");
    return doc.documentElement.textContent;
}

