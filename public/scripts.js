console.log("WE WONT GIVE UP!!!!!");
// SELECT YEAR 
let selectedYear = document.getElementById("year-select").value;
  var startYear = 2009;
  var endYear = 2023;
var select = document.getElementById("topic-select");
var selectMonths = document.getElementById("months-select");
// var select = document.getElementById("months-select");
   var months = ["--select--", "March", "June", "September", "November", "Supplementary"];


let currentProblemIndex = 0; // Starts with the first problem
let correctAnswersCount = 0;
let incorrectAnswersCount = 0;
// const filter = document.querySelectorById("filter");
let filter = document.querySelector("#filter");
  // Get the modal
  var modal = document.getElementById('myModal');

  // Get the button that opens the modal
  var btn = document.getElementById('myBtn');
  
  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName('close')[0];
  

const deleteQuestion = document.querySelector("#delete");
// Preload sounds
const dragSound = new Audio("sound/drag.mp3");
const dropSound = new Audio("sound/drop.mp3");
  
filter.addEventListener('click', reloadPage)
function getCurrentProblem() {
  return problemSolutions[currentProblemIndex];
}

// console.log("Fried",problemSolutions[0])
// console.log("GET  getCurrentProblem()",getCurrentProblem())


// --------------------------
// SELECT TOPIC
var options = [ 
  { value: "Solve for x", text: "Question 1 - Solve for x" },
  { value: "Solve simultaneous equation", text: "Question 2 - Solve simultaneous equation" },
  { value: "Geometric and arithmetic series", text: "Question 3 - Geometric and arithmetic series" },
  { value: "Quadratic sequence", text: "Question 4 - Quadratic sequence" },
  { value: "Functions", text: "Question 5 - Functions" },
  { value: "Financial", text: "Question 6 - Financial" },
  { value: "Derivatives", text: "Question 8 - Derivatives" },
  { value: "Cubic functions graphs", text: "Question 9 - Cubic functions graphs" },
  { value: "Optimization", text: "Question 10 - Optimization" },
  { value: "Probability", text: "Question 11 - Probability" }
];

// Loop through the options and add them to the select element
options.forEach(function (optionData) {
  var option = document.createElement("option");
  option.value = optionData.value;
  option.textContent = optionData.text;
  select.appendChild(option);
});


// SELECT YEAR 
var select = document.getElementById("year-select");
  var startYear = 2009;
  var endYear = 2023;

  // Loop through the years and add them to the select element
  for (var year = endYear; year >= startYear; year--) {
    var option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    select.appendChild(option);
  }

//  Loop through the months and add them to the select element
 for (var i = 0; i < months.length; i++) {
  var option = document.createElement("option");
  option.value = months[i];
  option.textContent = months[i];
  selectMonths.appendChild(option);
}
// ----------------------







//SEARCH FUNCTION
// document.getElementById('filterMe').addEventListener('click', filterQuestions);

// function filterQuestions(){
//   alert(1)
// }
// Add an event listener to the "Search" button
// document.getElementById('filterMe').addEventListener('click', filterQuestions);

// Function to filter and display questions
function filterQuestions() {
  let selectedYear = Number(document.getElementById("year-select").value.toLowerCase());
  let selectedMonth = document.getElementById("months-select").value.toLowerCase();
  let selectedTopic = document.getElementById("topic-select").value.toLowerCase();
 
  // Clear the current question display
  document.getElementById('question').innerHTML = '';

  // Find the indices of matching questions
  const matchingIndices = problemSolutions
    .map((problem, index) => ({ problem, index }))
    .filter(({ problem }) => {
      return (
        (selectedYear === "" || problem.year === selectedYear) &&
        (selectedMonth === "" || problem.month.toLowerCase() === selectedMonth) &&
        (selectedTopic === "" || problem.topic.toLowerCase() === selectedTopic)
      );
    })
    .map(({ index }) => index);

  if (matchingIndices.length > 0) {
    // Log the array indices of matching questions
    matchingIndices.forEach((index) => {
      const problem = problemSolutions[index];
      console.log(`Question ${index + 1}: ${problem.question}`);
    });
    currentProblemIndex = matchingIndices[0]; // Set your desired initial index here
    // Load the first question or take appropriate action
    loadQuestion(currentProblemIndex);
  } else {
    // If no matching questions are found, display a message or take appropriate action
    document.getElementById('question').innerHTML = 'No matching questions found.';
  }
}

// -----------------------------------------------------
function loadQuestion() {
  let questionElement = document.getElementById('question');
  let currentProblem = getCurrentProblem();
  
  questionElement.innerHTML = currentProblem.question;
  document.getElementById('equationBuilder').innerHTML = '';
   // Clear the builder for a new problem
  currentProblem.currentStep = 1; // Reset to step 1 for the new problem
  currentProblem.foundSolutions = []; // Reset found solutions for the new problem
}

document.addEventListener('DOMContentLoaded', function() {
  // document.getElementById('filterMe').addEventListener('click', filterQuestions);
    loadQuestion();
    searchElement();


    document.getElementById('submitSolution').addEventListener('click', checkSolution);
    document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
    document.getElementById('backQuestion').addEventListener('click', backQuestion)
    document.getElementById('clearSolution').addEventListener('click', clearSolution);
    document.getElementById('filterMe').addEventListener('click', filterQuestions);
    // Add this line
    // deleteQuestion.addEventListener('click', clearSolution); // Add this line
  });
  
  function searchElement() {
    const input = document.getElementById('searchBox').value.toLowerCase();
    const results = document.getElementById('searchResults');
    results.innerHTML = '';
  
    // Assume elementTools is an array with a single object from the database
    // We are interested in the first item of the array, hence elementTools[0]
    const tools = elementTools[0]; // Getting the actual object with the tool values
    for (const key in tools) {
      if (tools.hasOwnProperty(key)) {
        const value = tools[key];
        // Ensure that the value is a string and not another object like _id or __v
        if (typeof value === 'string' && (key.includes(input) || value.includes(input))) {
          const element = document.createElement('div');
          element.textContent = value;
          element.classList.add('draggable');
          element.setAttribute('draggable', true);
          element.ondragstart = drag;
          results.appendChild(element);
        }
      }
    }
  }
  

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
  
  function playSound(sound) {
    // console.log(sound)
    sound.currentTime = 0; // Rewind to the start
    sound.play();
  }

  function reloadPage() {
    location.reload();
  }

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.textContent);
  playSound(dragSound); // Play drag sound
  // alert("I am dragged");
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
  playSound(dropSound); // Play drop sound
}


// document.getElementById('toggleButton').addEventListener('click', function() {
//   var searchContainer = document.querySelector('.search-container');
//   if (searchContainer.style.display === 'none') {
//       searchContainer.style.display = 'block';
//   } else {
//       searchContainer.style.display = 'none';
//   }
// });


// Function to check if the user's solution is correct and handle the answer submission
function checkSolution() {
  const currentProblem = getCurrentProblem(); // Get the current problem details
  const stepKey = `step${currentProblem.currentStep}`; // Key for the current step

  // console.log(stepKey);
  let userSolution = document.getElementById('equationBuilder').textContent.trim(); // Get user's input
  const correctSolutions = currentProblem.solutions[stepKey]; // Array of correct solutions for the current step

  alert(correctSolutions)
  const normalizedUserSolution = userSolution.replace(/\s+/g, '').toLowerCase(); // Normalize user's input for comparison

    // console.log('This is solution: '+normalizedUserSolution);
  // Check if the user's normalized solution is among the correct solutions
  if (correctSolutions.includes(normalizedUserSolution)) {

    // If the solution is correct and not already found, add it to found solutions
    
    if (!currentProblem.foundSolutions.includes(normalizedUserSolution)) {
      
      currentProblem.foundSolutions.push(normalizedUserSolution); // Add to found solutions
      console.log( "Initial solution: "+currentProblem.foundSolutions);
      
      correctAnswersCount++; // Increment correct answers count
      // console.log(`Correct! Total correct answers: ${correctAnswersCount}`);
      alert(`Correct! You have solved part of step ${currentProblem.currentStep}.`);

      // console.log("currentProblem.foundSolutions.length",currentProblem.foundSolutions.length );
      // console.log("correctSolutions.length ",correctSolutions.length )
      // Check if all solutions for the current step have been found
      if (currentProblem.foundSolutions.length > 0) {
        alert(`Step ${currentProblem.currentStep} is fully or partially correct!`);
        moveToNextStep(currentProblem);
      }
       else {

        document.getElementById('equationBuilder').innerHTML =" "
        alert("Correct! Please enter the next part of the solution.");
      }
    } else {
      alert("You have already entered this part of the solution."); // Solution already found
    }
  } else {
    incorrectAnswersCount++; // Increment incorrect answers count
    console.log(`Incorrect attempt. Total incorrect answers: ${incorrectAnswersCount}`);
    alert("That's not correct. Try again.");
  }

  // Clear the equation builder if all parts of the current step are correct
  if (currentProblem.foundSolutions.length === correctSolutions.length) {
    document.getElementById('equationBuilder').innerHTML = ''; // Clear equation builder
  }

  // Submit the answer whether it is correct or not
  submitAnswer(correctSolutions.includes(normalizedUserSolution));
}

// Function to move to the next step of the problem
function moveToNextStep(currentProblem) {
  if (currentProblem.solutions[`step${currentProblem.currentStep + 1}`]) {
    currentProblem.currentStep++; // Increment step
    currentProblem.foundSolutions = []; // Reset found solutions for the next step
    alert(`Now proceed to step ${currentProblem.currentStep}.`);
    document.getElementById('equationBuilder').innerHTML =" "
  } else {
    alert("You've completed this problem!");
    nextQuestion(); // Move to the next question
  }
}


// Optionally, you can create a function to log the total correct answers when the user logs out or leaves the page
function logOutUser() {
  console.log(`Total correct answers during this session: ${correctAnswersCount}`);
  // Proceed with the logout logic...
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
  

  function logElement(event) {
    const elementText = event.target.textContent.trim();
    console.log(elementText);
  }
  

  function populateTools() {
    const tools = elementTools[0]; // Or however your data structure is formatted
    const results = document.getElementById('searchResults');
    results.innerHTML = ''; // Clear existing tools
  
    for (const category in tools) {
      if (tools.hasOwnProperty(category)) {
        const categoryTools = tools[category];
        for (const toolName in categoryTools) {
          if (categoryTools.hasOwnProperty(toolName)) {
            const toolValue = categoryTools[toolName];
            // Now create an element for each tool
            const element = document.createElement('div');
            element.textContent = toolValue;
            element.classList.add('draggable');
            element.setAttribute('draggable', true);
            element.ondragstart = drag;
            // Attach the logElement function to click and mouseover events
            element.addEventListener('click', logElement);
            // element.addEventListener('mouseover', logElement);
            results.appendChild(element);
          }
        }
      }
    }
  }
  
  window.addEventListener('beforeunload', logOutUser);
  // Call populateTools() to populate the tool area when the page loads or the data is fetched
  
  populateTools()