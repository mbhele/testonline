const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../middleware');
const ElementToolModel = require('../models/ElementToolModel'); // Ensure this path is correct
const User = require('../models/user'); // Make sure to import your User model

let problemSolutions = [
  {
    
    topic:"Solve for x",
    month:"March",
    year:2023,
    question: "Solve this question x&sup2;-2x-24=0",
    requireAllSolutions: true,
    NumberOfStepsOFProblem: 2,
    solutions: {
      step1: ["(x-6)(x+4)=0", "(x+4)(x-6)=0"],
      step2: ["x=6", "x=-4", "-4=x", "6=x"]
    },
    currentStep: 1,
    foundSolutions: []
  }, {
     topic:"Solve for x",
     month:"March",
    year:2022,
    question: "Please solve this question x-3=0",
    requireAllSolutions: true,
    NumberOfStepsOFProblem: 1,
    solutions: {
      step1: ["x=3", "3=x"]
    },
    currentStep: 1,
    foundSolutions: []
  },{
    topic:"Solve for x",
    month:"March",
    year:2021,
    question: "Please solve this question x-6=0",
    requireAllSolutions: true,
    solutions: {
      step1: ["x=6", "6=x"]
    },
    currentStep: 1,
    foundSolutions: []
  },
  {
    topic:"Solve for x",
    month:"June",
    year:2020,
    question: "Solve this question x&sup2;+4x+4=0",
    requireAllSolutions: true,
    NumberOfStepsOFProblem: 2,
    solutions: {
      step1: ["(x+2)(x+2)=0"],
      step2: ["x=-2","-2=x"]
    },
    currentStep: 1,
    foundSolutions: []
  },
  {
    topic:"Solve for x",
    month:"September",
    year:2021,
    question: "Solve this question x&sup2;+4x=0",
    requireAllSolutions: true,
    NumberOfStepsOFProblem: 2,
    solutions: {
      step1: ["x(x+4)=0"],
      step2: ["x=0","x=-4","-4=x"]
    },
    currentStep: 1,
    foundSolutions: []
  },
  {
    topic:"Solve for x",
    month:"June",
    year:2009,
    question: "Solve this question x&sup2;+4x=0",
    requireAllSolutions: true,
    NumberOfStepsOFProblem: 2,
    solutions: {
      step1: ["x(x+4)=0"],
      step2: ["x=0","x=-4","-4=x"]
    },
    currentStep: 1,
    foundSolutions: []
  }
  
  // ... other problems
];
// const problemSolutions = [
//     {
//         question: "Solve this question x&sup2;-2x-24=0",
//       solutions: {
//         step1: ["(x-6)(x+4)=0", "(x+4)(x-6)=0"],
//         step2: ["x=6", "x=-4"]
//       },
//       currentStep: 1,
//       foundSolutions: []
//     },
  
//     {
//       question: "Please solve this question x-3=0",
//       solutions: {
//         step1: ["x=3", "3=x"]
//       },
//       currentStep: 1,
//       foundSolutions: []
//     },
//     {
//       question: "Please solve this question x-6=0",
//       solutions: {
//         step1: ["x=6", "6=x"]
//       },
//       currentStep: 1,
//       foundSolutions: []
//     },
//     // Add more problems as needed
//   ];




router.get('/train', isLoggedIn, async (req, res) => {
  try {
    const elementTools = await ElementToolModel.find().select('-_id -__v');
    // If req.user is populated with user information and contains a username property
    const username = req.user ? req.user.username : "Guest"; // Fallback for "Guest" if not logged in

    res.render('index', {
      username: username,
      problemSolutions: problemSolutions,
      elementTools: JSON.stringify(elementTools)
    });
  } catch (error) {
    console.error('Failed to fetch data', error);
    res.status(500).send('An error occurred while fetching data.');
  }
});

  
router.post('/submit-answer', isLoggedIn, async (req, res) => {
    const { isCorrect } = req.body;
    const userId = req.user._id; // Assuming req.user is populated with the logged-in user's info

    try {
        const user = await User.findById(userId);

        if (isCorrect) {
            user.correctAnswersCount = (user.correctAnswersCount || 0) + 1;
        } else {
            user.incorrectAnswersCount = (user.incorrectAnswersCount || 0) + 1;
        }

        await user.save();
        res.json({ message: 'Answer recorded successfully.' });
    } catch (error) {
        console.error('Error recording answer:', error);
        res.status(500).json({ message: 'Error recording answer.' });
    }
});



// const User = require('../models/user');
// const passport = require('passport');

// router.get('/register', (req,res)=>{
//     res.render('users/register');
// })

// router.post('/register', async (req, res)=>{
//     // res.send(req.body);
//     try{
//         const {email, username, password} = req.body;

//         const user = new User({ email, username});
//         const registeredUser = await User.register(user, password);
//       //   console.log(registeredUser)
//         res.redirect('/train')
//     }
//     catch(e){
//         console.log(e.message);
//     }
  

// });


// router.get('/login', (req, res)=>{
//     res.render('users/login');
// })

// router.post('/login', passport.authenticate('local',{ failureFlash:true, failureRedirect:'/login'}), (req, res)=>{
//     req.flash('success', 'welcome back!');
//    res.redirect('/train')
// })



module.exports= router;