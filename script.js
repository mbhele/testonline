console.log("WE WONT GIVE UP!!!!!");

let currentProblemIndex = 0; // Starts with the first problem

const problemSolutions = [
  {
    question: "Please solve this question x^2-2x-24=0",
    solutions: {
      step1: ["(x-6)(x+4)=0", "(x+4)(x-6)=0"],
      step2: ["x=6", "x=-4"]
    },
    currentStep: 1,
    foundSolutions: []
  },

  {
    question: "Please solve this question x-3=0",
    solutions: {
      step1: ["x=3", "3=x"]
    },
    currentStep: 1,
    foundSolutions: []
  },
  {
    question: "Please solve this question x-6=0",
    solutions: {
      step1: ["x=6", "6=x"]
    },
    currentStep: 1,
    foundSolutions: []
  },
  // Add more problems as needed
];

const elementTools = {
    // Basic arithmetic
  plus: "+",
  minus: "-",
  multiply: "×",
  divide: "÷",
  equal: "=",
  lessThan: "<",
  
  // Numbers
  zero: "0",
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  ten: "10",

  // Advanced arithmetic
  power2: "²",
  power3: "³",
  powerN: "^n",
  squareRoot: "√",

  // Variables
  x: "x",
  a: "a",
  b: "b",
  c: "c",
  n: "n",

  // Set theory
  elementOf: "∈",
  realNumbers: "ℝ",

  // Geometry
  triangle: "△",
  angle: "θ",

  // Calculus
  sigma: "Σ",
  integral: "∫",
  limit: "lim",

  // Other symbols
  infinity: "∞",
  ellipsis: "…",
  absoluteValue: "|",

  // Brackets
  bracket: "(",
  closeBracket: ")",
  squareBracketOpen: "[",
  squareBracketClose: "]",

  // Subscripts
  subscript0: "₀",
  subscript1: "₁",
  subscript2: "₂",
  subscript3: "₃",
  subscript4: "₄",
  subscript5: "₅",
  subscript6: "₆",
  subscript7: "₇",
  subscript8: "₈",
  subscript9: "₉",

  // Logic
  implies: "⇒",
  therefore: "∴",
  };
  

function getCurrentProblem() {
  return problemSolutions[currentProblemIndex];
}

function loadQuestion() {
  const questionElement = document.getElementById('question');
  const currentProblem = getCurrentProblem();
  questionElement.textContent = currentProblem.question;
  document.getElementById('equationBuilder').innerHTML = ''; // Clear the builder for a new problem
  currentProblem.currentStep = 1; // Reset to step 1 for the new problem
  currentProblem.foundSolutions = []; // Reset found solutions for the new problem
}

document.addEventListener('DOMContentLoaded', function() {
    loadQuestion();
    searchElement();
    document.getElementById('submitSolution').addEventListener('click', checkSolution);
    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    document.getElementById('clearSolution').addEventListener('click', clearSolution); // Add this line
  });
  
function searchElement() {
  const input = document.getElementById('searchBox').value.toLowerCase();
  const results = document.getElementById('searchResults');
  results.innerHTML = '';

  Object.entries(elementTools).forEach(([key, value]) => {
    if (key.includes(input) || value.includes(input)) {
      const element = document.createElement('div');
      element.textContent = value;
      element.classList.add('draggable');
      element.setAttribute('draggable', true);
      element.ondragstart = drag;
      results.appendChild(element);
    }
  });
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.textContent);
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const newElement = document.createElement('span');
  newElement.textContent = data;
  newElement.classList.add('editable');
  newElement.setAttribute('contenteditable', true);
  newElement.ondragstart = drag;

  if (event.target.id === "equationBuilder" && event.target.hasChildNodes()) {
    event.target.appendChild(document.createTextNode(' '));
  }

  event.target.appendChild(newElement);
}

function checkSolution() {
    const currentProblem = getCurrentProblem();
    const stepKey = `step${currentProblem.currentStep}`;
    let userSolution = document.getElementById('equationBuilder').textContent.trim();
    const correctSolutions = currentProblem.solutions[stepKey];
    const normalizedUserSolution = userSolution.replace(/\s+/g, '').toLowerCase();
  
    // If the user's solution is correct for the current step
    if (correctSolutions.includes(normalizedUserSolution)) {
      // If the solution is correct and not already found, add it to found solutions
      if (!currentProblem.foundSolutions.includes(normalizedUserSolution)) {
        currentProblem.foundSolutions.push(normalizedUserSolution);
        alert(`Correct! You have solved part of step ${currentProblem.currentStep}.`);
  
        // Check if all solutions for the step have been found or if it's a single-solution step
        if (currentProblem.foundSolutions.length === correctSolutions.length || correctSolutions.length === 1) {
          alert(`Step ${currentProblem.currentStep} is fully correct!`);
          moveToNextStep(currentProblem);
        } else {
          alert("Correct! Please enter the next part of the solution.");
        }
      } else {
        alert("You have already entered this part of the solution.");
      }
    } else {
      alert("That's not correct. Try again.");
    }
  
    // Only clear the equation builder if all parts of the step are correct
    if (currentProblem.foundSolutions.length === correctSolutions.length) {
      document.getElementById('equationBuilder').innerHTML = '';
    }
  }
  
  
  function moveToNextStep(currentProblem) {
    // If the current step is not the last one, move to the next step
    if (currentProblem.solutions[`step${currentProblem.currentStep + 1}`]) {
      currentProblem.currentStep += 1;
      currentProblem.foundSolutions = [];
      alert(`Now proceed to step ${currentProblem.currentStep}.`);
    } else {
      // If it was the last step, move to the next problem
      alert("You've completed this problem!");
      nextQuestion();
    }
  }
  
  
  
  function nextQuestion() {
    // Move to the next problem if there is one
    currentProblemIndex += 1;
    if (currentProblemIndex < problemSolutions.length) {
      loadQuestion();
    } else {
      alert("All problems are fully solved!");
      // Optionally, you can reset to the first problem or disable the next question button
      currentProblemIndex = 0;
      loadQuestion();
    }
  }
  

  function clearSolution() {
    document.getElementById('equationBuilder').innerHTML = '';
  }
  
  function backQuestion() {
    // Check if there is a previous problem
    if (currentProblemIndex > 0) {
      currentProblemIndex -= 1; // Move to the previous problem
      loadQuestion(); // Load the previous problem
    } else {
      // If already at the first problem, perhaps wrap around or disable the button
      alert("This is the first problem.");
      // Optionally, disable the back question button
      // document.getElementById('backQuestion').disabled = true;
    }
  }
  
  // Inside your DOMContentLoaded event listener setup:
  document.addEventListener('DOMContentLoaded', function() {
    loadQuestion();
    searchElement();
    document.getElementById('submitSolution').addEventListener('click', checkSolution);
    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    document.getElementById('backQuestion').addEventListener('click', backQuestion); // Add this line
  });
  

  