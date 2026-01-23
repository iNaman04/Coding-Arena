import mongoose from "mongoose";
import Session from '../models/session.js';
import test from "node:test";


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
            problem : {
                id : session.problem._id,
                title : session.problem.title,
                description : session.problem.description,
                difficulty : session.problem.difficulty,
                example: session.problem.examples,
                testCases : session.problem.testCases,
                constraints : session.problem.constraints
            }
        })

    } catch (error) {
        res.status(500).json({ message: "Failed to fetch battle data" });
        console.log(error);
        
    }
}