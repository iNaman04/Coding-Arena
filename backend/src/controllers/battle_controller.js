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