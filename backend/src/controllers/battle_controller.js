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
            problem: {
                _id: session.problem._id,
                title: session.problem.title,
                description: session.problem.description,
                difficulty: session.problem.difficulty,
                examples: session.problem.examples,
                testCases: session.problem.testCases.slice(0, 2),
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
        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        const langWrapper = problem.wrappers.find(w => w.language === language);

        const finalScript = `${code}\n\n${langWrapper.code}`;

        const results = [];

        const pistonLangMap = {
            javascript: "javascript",
            python: "python",
        };

        for (let tc of problem.testCases) {
            const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
                language: pistonLangMap[language] || language,
                version: "*",
                files: [
                    {
                        content: finalScript
                    }
                ],
                stdin: tc.input
            })

            const run = response.data.run;
            const actualOutput = run.stdout.trim();
            const errorOutput = run.stderr.trim();

            console.log("actualOutput", actualOutput);

            console.log("errorOutput", errorOutput);


            results.push({
                input: tc.input,
                output: tc.output,
                actualOutput: errorOutput ? `Error: ${errorOutput}` : actualOutput,
                passed: actualOutput === tc.output.trim() && !errorOutput
            })

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
        const langWrapper = problem.wrappers.find(w => w.language === req.body.language);

        const finalScript = `${code}\n\n${langWrapper.code}`;

        const pistonLangMap = {
            javascript: "javascript",
            python: "python",
        };

        const testResults = [];
        for (const tc of problem.testCases) {
            try {
                const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
                    language: pistonLangMap[language] || language,
                    version: "*",
                    files: [{ content: finalScript }],
                    stdin: tc.input
                });
                const actual = response.data.run.stdout.trim().replace(/\s+/g, '');
                const expected = tc.output.trim().replace(/\s+/g, '');
                testResults.push(actual === expected && !response.data.run.stderr);
            } catch (err) {
                testResults.push(false);
            }
        }

        const allPassed = testResults.every(result => result === true);

        const submissionData = {
            userId,
            timeTaken: timetaken,
            isCorrect: allPassed,
            code,
            testPassed: testResults.filter(result => result === true).length,
            totalTests: problem.testCases.length
        }

        const existingIndex = session.submissions.findIndex(s => s.userId.toString() === userId.toString());
        if (existingIndex > -1) {
            session.submissions[existingIndex] = submissionData;
        } else {
            session.submissions.push(submissionData);
        }

        if (session.submissions.length >= 2) {
            session.status = "COMPLETED";
            await session.save(); // Save first!
            req.io.to(sessionId.toString()).emit("battle_finished", {
                sessionId: sessionId.toString()
            });
        } else {
            await session.save(); // Still save the single submission
        }

        res.status(200).json({
            success: true,
            isCorrect: allPassed,
            isBattleOver: session.status === "COMPLETED"
        });
    } catch (error) {
        console.log("error submitting the code ", error);

        res.status(500).json({ message: "Submission failed", error: error.message });
    }
}