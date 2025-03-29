const BASE_URL = 'https://opentdb.com/api.php?amount=10';

let currentQuestionIndex = 0;
let score = 0;
let data;

let questionElement = document.getElementById("question");
let optionsContainer = document.getElementById("options-container");
let nextButton = document.getElementById("next-button");
let resultContainer = document.getElementById("result-container");

async function getQuestionData() {
  try {
      let response = await fetch(`${BASE_URL}`);
      if (!response.ok) {
          throw new Error('City not found');
      }
      // console.log(response);
      data = await response.json();
      showQuestion(data);

  } catch (error) {
    console.log("There is an error!");
  }
}
getQuestionData();

function showQuestion(data) {
  const currentQuestion = data.results[currentQuestionIndex];
  questionElement.textContent = decodeHTMLEntities(currentQuestion.question);
  optionsContainer.innerHTML = "";

  //Make new Array named Options
  const options = [];
  let i = 0;
  // Add all answers and suffle them
  currentQuestion.incorrect_answers.forEach(answer => {
    options[i] = decodeHTMLEntities(answer);
    i++;
  });
  options[i] = decodeHTMLEntities(currentQuestion.correct_answer);
  shuffle(options);

  options.forEach(option => {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option");
    button.addEventListener("click", (e) => selectOption(e, data));
    optionsContainer.appendChild(button);
  });
}

function selectOption(e, data) {
  const selectedButton = e.target;
  const correctAnswer = decodeHTMLEntities(data.results[currentQuestionIndex].correct_answer);

  if(selectedButton.textContent === correctAnswer){
    score++;
  }

  Array.from(optionsContainer.children).forEach(button => {
    button.disabled = true;
    if (button.textContent === correctAnswer)
      {
        button.style.backgroundColor = "#23903c"; // Green for correct answer
      }
      else
      {
        button.style.backgroundColor = "#c32232"; // Red for incorrect answe
      }
  });

  nextButton.disabled = false;
}

function showResult(data) {
  resultContainer.textContent = `Your score is ${score} out of ${data.results.length}`;
  nextButton.style.display = 'none';
}

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < data.results.length)
  {
    showQuestion(data);
    nextButton.disabled = true;
  }
  else{
    showResult(data);
  }
});



//Shuffle the options (answers) for the questions. The algorithm is the Fisher–Yates (aka Knuth) Shuffle.
function shuffle(array) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}

function decodeHTMLEntities(text) {
  const parser = new DOMParser();
  const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
  return decodedString;
}

// Initialize the quiz
nextButton.disabled = true;
