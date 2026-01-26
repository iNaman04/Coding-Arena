import mongoose from "mongoose";
import Session from '../models/session.js';
import test from "node:test";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { execSync } from 'child_process';
import Problem from '../models/problems.js';


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
                id: session.problem._id,
                title: session.problem.title,
                description: session.problem.description,
                difficulty: session.problem.difficulty,
                examples: session.problem.examples,
                testCases: session.problem.testCases,
                constraints: session.problem.constraints
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch battle data" });
        console.log(error);

    }
}

export const runCode = async (req, res) => {
    try {
        const { code, problemId } = req.body;

        const problem = await Problem.findById(problemId);
        if (!problem) return res.status(404).json({ message: "Problem not found" });

        const id = uuidv4();
        const tempDir = path.join(process.cwd(), "temp");
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

        const codePath = path.join(tempDir, `${id}.cjs`);
        fs.writeFileSync(codePath, code);

        let results = [];

        try {
            for (let tc of problem.testCases) {
                try {
                    const output = execSync(`node ${codePath}`, {
                        input: tc.input,
                        timeout: 2000
                    }).toString().trim();

                    results.push({
                        input: tc.input,
                        expected: tc.output,
                        got: output,
                        passed: output === tc.output.trim()
                    });

                } catch (err) {
                    results.push({
                        input: tc.input,
                        expected: tc.output,
                        got: err.stderr?.toString() || "Runtime Error",
                        passed: false
                    });
                }
            }
        } finally {
            if (fs.existsSync(codePath)) fs.unlinkSync(codePath);
        }

        res.json({
            success: true,
            allPassed: results.every(r => r.passed),
            results
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Judge failed" });
    }
}