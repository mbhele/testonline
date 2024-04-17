const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
//   question: String,
//   solutions: {
//     step1: [String],
//     step2: [String]
//   },
//   currentStep: Number,
//   foundSolutions: [String]
});

const problemSolutionModel = mongoose.model('ProblemSolution', solutionSchema);
