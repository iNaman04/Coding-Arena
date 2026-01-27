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
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"],
        examples: [
            {
                input: "nums = [2,7,11,15], target = 9",
                output: "[0,1]",
                explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
            }
        ],
        // The actual raw data passed to the wrapper via stdin
        testCases: [
            { input: "[2,7,11,15]\n9", output: "[0,1]" },
            { input: "[3,2,4]\n6", output: "[1,2]" }
        ],
        // What the user sees in the editor
        starterCode: [
            {
                language: "javascript",
                code: "function twoSum(nums, target) {\n    // Write your code here\n};"
            }
        ],
        // Hidden code that runs on Piston
        wrappers: [
            {
                language: "javascript",
                code: `
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split('\\n');
const nums = JSON.parse(input[0]);
const target = JSON.parse(input[1]);
const result = twoSum(nums, target);
console.log(JSON.stringify(result));
        `
            }
        ]
    },
    {
        title: "Add Two Numbers",
        slug: "add-two-numbers",
        difficulty: "EASY",
        description: "Return the sum of two integers a and b.",
        constraints: ["-10^9 <= a, b <= 10^9"],
        examples: [
            {
                input: "a = 2, b = 3",
                output: "5"
            }
        ],
        testCases: [
            { input: "2\n3", output: "5" },
            { input: "10\n20", output: "30" }
        ],
        starterCode: [
            {
                language: "javascript",
                code: "function addTwoNumbers(a, b) {\n    // Write your code here\n};"
            }
        ],
        wrappers: [
            {
                language: "javascript",
                code: `
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split('\\n');
const a = parseInt(input[0]);
const b = parseInt(input[1]);
console.log(addTwoNumbers(a, b));
        `
            }
        ]
    }
];
await Problem.insertMany(problems);
console.log("Problems seeded");
process.exit();