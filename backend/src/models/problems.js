import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  examples: [
    {
      input: String,
      output: String
    }
  ],
  constraints: [String],

  starterCode: {
    type: String,
    required: true
  },

  testCases: [
    {
      input: String,
      output: String
    }
  ]
}, { timestamps: true });

export default mongoose.model("Problem", problemSchema);
