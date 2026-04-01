import mongoose from "mongoose";
import Session from '../models/session.js';
import test from "node:test";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { execSync } from 'child_process';
import Problem from '../models/problems.js';
import axios from "axios";
import { stdin } from "process";
import { error } from "console";


export const getBattleData = async (req, res) => {
    try {
        const { sessionId } = req.params;


        if (!sessionId || sessionId === "undefined") {
            return res.status(400).json({ message: "Session ID missing" });
        }

        if (!mongoose.Types.ObjectId.isValid(sessionId)) {
            return res.status(400).json({ message: "Invalid Session ID" });
        }



        const session = await Session.findById(sessionId).populate("problem");

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }



        if (!session.problem) {
            return res.status(500).json({
                message: "Problem not assigned to session"
            });
        }

        res.status(200).json({
            sessionId: session._id,
            startedAt: session.startTime,
            status: session.status,
            problem: {
                _id: session.problem._id,
                title: session.problem.title,
                description: session.problem.description,
                difficulty: session.problem.difficulty,
                examples: session.problem.examples,
                testCases: session.problem.testCases,
                constraints: session.problem.constraints,
                starterCode: session.problem.starterCode,
                wrappers: session.problem.wrappers,
                startedAt: session.startTime,
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch battle data" });
        console.log(error);

    }
}

export const runCode = async (req, res) => {
    try {
        const { code, problemId, language } = req.body;
        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: "Problem not found" });

        const langWrapper = problem.wrappers.find(w => w.language === language);
        const finalScript = `${code}\n\n${langWrapper.code}`;

        // Define the map correctly based on your runtimes
        const pistonConfig = {
            javascript: { language: "javascript", version: "18.15.0" }, 
            python: { language: "python", version: "3.12.0" },
        };

        // Get the config or fallback
        const selectedConfig = pistonConfig[language] || { language: language, version: "*" };

        const results = [];
        const publicTestCases = problem.testCases.slice(0, 2);

        for (let tc of publicTestCases) {
            const response = await axios.post("http://localhost:2000/api/v2/execute", {
                // FIX: Pass the string property, not the whole object
                language: selectedConfig.language, 
                version: selectedConfig.version,
                files: [{ content: finalScript }],
                stdin: tc.input
            });

            const { run, compile } = response.data;
            const errorOutput = (compile?.stderr || run.stderr || "").trim();
            const actualOutput = (run.stdout || "").trim();

            results.push({
                input: tc.input,
                output: tc.output,
                actualOutput: errorOutput ? `Error: ${errorOutput}` : actualOutput,
                passed: !errorOutput && actualOutput.replace(/\s/g, "") === tc.output.trim().replace(/\s/g, "")
            });
        }
        res.status(200).json({ success: true, results });
    } catch (error) {
        console.error("Piston API Error:", error.response?.data || error.message);
        res.status(500).json({ message: "Execution failed", error: error.message });
    }
}

export const submitCode = async (req, res) => {
    try {
        const { sessionId, code, timetaken, language } = req.body;
        const userId = req.user._id;

        const session = await Session.findById(sessionId).populate("problem");
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const problem = session.problem;
        
        // Find language wrapper and add a safety check
        const langWrapper = problem.wrappers.find(w => w.language === language);
        if (!langWrapper) {
            return res.status(400).json({ message: `Language wrapper for ${language} not found` });
        }

        const finalScript = `${code}\n\n${langWrapper.code}`;

        const pistonLangMap = {
            javascript: "javascript",
            python: "python",
        };

        const testResults = [];

        // Loop through ALL test cases for submission
        for (const tc of problem.testCases) {
            try {
                const response = await axios.post("http://localhost:2000/api/v2/execute", {
                    language: pistonLangMap[language] || language,
                    version: "*",
                    files: [{ content: finalScript }],
                    stdin: tc.input
                });

                const { run, compile } = response.data;

                // Capture any error (Compile or Runtime)
                const errorOutput = (compile?.stderr || run?.stderr || "").trim();
                
                // Normalize outputs: Remove all whitespace for a fair comparison
                const actual = (run?.stdout || "").trim().replace(/\s+/g, '');
                const expected = tc.output.trim().replace(/\s+/g, '');

                // Pass if NO error and cleaned strings match
                const passed = !errorOutput && actual === expected;
                testResults.push(passed);

            } catch (err) {
                console.error("Piston Submission Error for Test Case:", err.message);
                testResults.push(false);
            }
        }

        const allPassed = testResults.every(result => result === true);
        const testsPassedCount = testResults.filter(result => result === true).length;

        const submissionData = {
            userId,
            timeTaken: timetaken,
            isCorrect: allPassed,
            code,
            testPassed: testsPassedCount,
            totalTests: problem.testCases.length
        };

        // Update or push submission
        const existingIndex = session.submissions.findIndex(s => s.userId.toString() === userId.toString());
        if (existingIndex > -1) {
            session.submissions[existingIndex] = submissionData;
        } else {
            session.submissions.push(submissionData);
        }

        // Check if battle is over
        if (session.submissions.length >= 2) {
            session.status = "COMPLETED";
            await session.save();
            req.io.to(sessionId.toString()).emit("battle_finished", {
                sessionId: sessionId.toString(),
                winner: allPassed ? userId : "tie_or_other" // Simplified logic
            });
        } else {
            await session.save();
        }

        res.status(200).json({
            success: true,
            isCorrect: allPassed,
            testsPassed: testsPassedCount,
            totalTests: problem.testCases.length,
            isBattleOver: session.status === "COMPLETED"
        });

    } catch (error) {
        console.error("Final Submission Error:", error);
        res.status(500).json({ message: "Submission failed", error: error.message });
    }
};