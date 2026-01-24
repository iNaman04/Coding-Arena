import mongoose from 'mongoose';
import Problem from '../models/problems.js';
import dotenv from 'dotenv';
dotenv.config({ path: "../.env" });

await mongoose.connect(process.env.MONGO_URI);

const problems = [
    {
        title: "Two Sum",
        slug: "two-sum",
        difficulty: "EASY",
        description: "Given an array of integers nums and an integer target...",
        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9"
        ],
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "nums[0] + nums[1] = 9"
            }
        ],
        testCases: [
            { input: "[2,7,11,15], 9", output: "[0,1]" },
            { input: "[3,2,4], 6", output: "[1,2]" }
        ]
    },

    {
        title: "Add Two Numbers",
        slug: "add-two-numbers",
        difficulty: "MEDIUM",
        description: "Add two numbers given",
        constraints: [
            "2 <= nums.length <= 10^4",
            "-10^9 <= nums[i] <= 10^9"
        ],
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "nums[0] + nums[1] = 9"
            }
        ],
        testCases: [
            { "input": "2 3", "output": "5" },
            { "input": "10 20", "output": "30" },
            { "input": "7 8", "output": "15" }
        ]
    }
];

await Problem.insertMany(problems);
console.log("Problems seeded");
process.exit();