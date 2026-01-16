import express from 'express';
import Session from '../models/session.js';
import { generateCode } from '../utils/code_generator.js';

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