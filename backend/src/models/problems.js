import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true },
  difficulty: {
    type: String,
    enum: ["EASY", "MEDIUM", "HARD"]
  },
  description: String,
  constraints: [String],

  examples: [
    {
      input: String,
      output: String,
      explanation: String
    }
  ],

  testCases: [
    {
      input: String,
      output: String
    }
  ]
}, { timestamps: true });


const Problem = mongoose.model("Problem", problemSchema);


export default Problem;