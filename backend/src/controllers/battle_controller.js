import mongoose from "mongoose";
import Session from '../models/session.js';
import test from "node:test";
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';


export const getBattleData = async (req, res) => {
    try {
        const { SessionId } = req.params;
        const session = await Session.findById(SessionId).populate("problem");

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        // if (session.status !== "ACTIVE") {
        //     return res.status(400).json({ message: "Session is not active" });
        // }
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
    const { code } = req.body;

    const id = uuidv4();
    const tempDir = path.join(process.cwd(), "temp");

    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const filePath = path.join(tempDir, `${id}.js`);

    fs.writeFileSync(filePath, code);

    exec(`node ${filePath}`, (error, stdout, stderr) => {
      fs.unlinkSync(filePath);

      if (error) {
        return res.json({ error: stderr || error.message });
      }

      res.json({ output: stdout });
    });

  } catch (err) {
    console.error("RunCode Error:", err);
    res.status(500).json({ message: "Execution failed", error: err.message });
  }
}