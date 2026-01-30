import express from 'express';
import Session from '../models/session.js';
import { generateCode } from '../utils/code_generator.js';
import { start } from 'repl';
import Problem from '../models/problems.js';

export const createSession = async (req, res) => {
    try {
        const user = req.user;
        let inviteCode;
        let isUnique = false;

        while (!isUnique) {
            inviteCode = generateCode(6);
            const existingSession = await Session.findOne({ inviteCode });
            if (!existingSession) {
                isUnique = true;
            }
        }
        const session = await Session.create({
            inviteCode,
            createdBy: user._id,
            players: [user._id],
            difficulty: req.body.difficulty,
        })


        res.status(201).json({
            message: "Session created",
            sessionId: session._id,
            inviteCode: session.inviteCode,
            status: session.status
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create session" });
    }

}

export const joinSesson = async (req, res) => {
    try {
        const { inviteCode } = req.body;
        const user = req.user;
        const userId = user._id;

        if (!inviteCode) {
            return res.status(400).json({ message: "Invite code is required" });
        }

        const session = await Session.findOne({ inviteCode });

        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        if (session.players.includes(user._id)) {
            return res.status(400).json({ message: "User already in session" });
        }

        if (session.status !== "WAITING") {
            return res.status(400).json({ message: "Session already started" });
        }
        
        if (session.players.length >= 2) {
            return res.status(400).json({
                message: "Session is full"
            });
        }

        session.players.push(userId);

        if (session.players.length === 2) {
            session.status = "ACTIVE";
            session.startTime = new Date();

            const problems = await Problem.find({
                difficulty: session.difficulty.toUpperCase()
            })

            if(problems.length===0){
                return res.status(500).json({ message: "No problems available for the selected difficulty" });
            }

            const randomproblem = problems[0];
            session.problem = randomproblem._id;
        }

        

        await session.save();
        req.io.to(session._id.toString()).emit("session-started", {
            sessionId: session._id,
        });

        res.status(200).json({
            message: "Successfully joined session",
            sessionId: session._id,
            inviteCode: session.inviteCode,
            status: session.status,
            startTime: session.startTime,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to join session" });
        
    }
}

export const getMyActiveSession = async (req, res) =>{
    try {
        const userId = req.user._id;
        const session = await Session.findOne({
            players: userId,
            status: "ACTIVE"
        })
        if(!session){
            return res.status(404).json({ message: "No active session found" });
        }
        res.status(200).json({
            sessionId : session._id,
            inviteCode : session.inviteCode,
            status : session.status
        })

    } catch (error) {
        res.status(404).json({ message: "Failed to get active session" });
    }
}