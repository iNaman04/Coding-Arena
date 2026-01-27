import mongoose from "mongoose";

const problemSchema = new mongoose.Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    difficulty: {
        type: String,
        enum: ["EASY", "MEDIUM", "HARD"],
        required: true
    },
    description: { type: String, required: true },
    constraints: [String],

    examples: [
        {
            input: String,
            output: String,
            explanation: String
        }
    ],

    // 1. STARTER CODE: What the user sees in the editor
    starterCode: [
        {
            language: { type: String, required: true }, // e.g., 'javascript', 'python'
            code: { type: String, required: true }      // e.g., 'function twoSum(nums, target) { ... }'
        }
    ],

    // 2. WRAPPERS: The hidden glue for the backend
    wrappers: [
        {
            language: { type: String, required: true },
            code: { type: String, required: true }      // The logic that reads stdin and calls the function
        }
    ],

    // 3. TEST CASES: Input must match the format the Wrapper expects
    testCases: [
        {
            input: { type: String, required: true },    // e.g., "[2,7,11,15]\n9"
            output: { type: String, required: true }   // e.g., "[0,1]"
        }
    ]
    }, { timestamps: true });

const Problem = mongoose.model("Problem", problemSchema);


export default Problem;