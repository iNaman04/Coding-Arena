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
            // 1. Basic Sample Cases (Visible)
            { input: "[2,7,11,15]\n9", output: "[0,1]" },
            { input: "[3,2,4]\n6", output: "[1,2]" },

            // 2. Duplicate Values (Hidden)
            // Tests if they use the same index twice (incorrect) or find the two different indices (correct)
            { input: "[3,3]\n6", output: "[0,1]" },

            // 3. Negative Numbers (Hidden)
            // Tests if their logic handles subtraction/negative results
            { input: "[-1,-2,-3,-4,-5]\n-8", output: "[2,4]" },

            // 4. Zeroes (Hidden)
            { input: "[0,4,3,0]\n0", output: "[0,3]" },

            // 5. Unsorted & Larger Target (Hidden)
            { input: "[10,25,30,50,75,100]\n150", output: "[3,5]" },

            // 6. Non-adjacent elements (Hidden)
            { input: "[1,5,9]\n10", output: "[0,2]" }
        ],
        // What the user sees in the editor
        starterCode: [
            {
                language: "javascript",
                code: "function twoSum(nums, target) {\n    // Write your code here\n};"
            },
            {
                language: "python",
                code: "def twoSum(nums, target):\n    # Write code here\n    pass"
            }

        ],
        // Hidden code that runs on Piston
        wrappers: [
            {
                language: "javascript",
                code: `
const fs = require('fs');
const input = fs.readFileSync(0, 'utf8').trim().split('\\n');
if (input.length < 2) process.exit(0);

const nums = JSON.parse(input[0]);
const target = JSON.parse(input[1]);

const result = twoSum(nums, target);

// Sort the array so [1,0] becomes [0,1] for consistent comparison
if (Array.isArray(result)) {
    console.log(JSON.stringify(result.sort((a, b) => a - b)));
} else {
    console.log("null");
}
        `
            },
            {
                language: "python",
                code: `
import sys
import json

input_data = sys.stdin.read().splitlines()
if len(input_data) < 2:
    sys.exit(0)

nums = json.loads(input_data[0])
target = json.loads(input_data[1])

# Ensure this name matches your starter code
result = twoSum(nums, target)

if isinstance(result, list):
    result.sort()
    # "separators=(',', ':')" removes the space after the comma
    print(json.dumps(result, separators=(',', ':')))
else:
    print("null")
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