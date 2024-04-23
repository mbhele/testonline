const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the schema for ParentAnswer
const parentAnswerSchema = new Schema({
    parent: { type: Schema.Types.ObjectId, ref: 'Parent' }, // Reference to the parent
    question: { type: Schema.Types.ObjectId, ref: 'Question' }, // Reference to the question
    selectedAnswer: String, // The answer selected by the parent
}, { timestamps: true });

// Define the model using the schema
const ParentAnswer = mongoose.model('ParentAnswer', parentAnswerSchema);

module.exports = ParentAnswer;
