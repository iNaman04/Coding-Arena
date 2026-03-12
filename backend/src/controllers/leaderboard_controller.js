import express from 'express';
import Session from '../models/session.js';
import Problem from '../models/problems.js';
import User from '../models/user_model.js';

export const getLeaderBoardData = async (req, res) => {
    try {
        // 1. Populate both the players AND the submissions if they are separate
        // Based on your log, the data lives in 'submissions'
        const session = await Session.findById(req.params.sessionId).populate('submissions.userId');

        if (!session) return res.status(404).send("Session not found");

        if (!session.isProcessed) {
            // Use 'submissions' array as it contains the testPassed and timeTaken data
            const sortedSubmissions = [...session.submissions].sort((a, b) => {
                if (b.testPassed !== a.testPassed) return b.testPassed - a.testPassed;
                return a.timeTaken - b.timeTaken;
            });

            const winner = sortedSubmissions[0];
            
            // Get all participant IDs from the submissions array
            const allParticipantIds = session.submissions.map(s => s.userId._id);

            if (winner && winner.testPassed > 0) {
                // Update Winner
                await User.findByIdAndUpdate(winner.userId._id, {
                    $inc: { wins: 1, totalBattles: 1, exp: 100 }
                });
                session.winnerId = winner.userId._id;

                // Update Losers (Everyone except the winner)
                const losers = allParticipantIds.filter(id => 
                    id.toString() !== winner.userId._id.toString()
                );

                if (losers.length > 0) {
                    await User.updateMany(
                        { _id: { $in: losers } }, 
                        { $inc: { totalBattles: 1, exp: 20 } }
                    );
                }
            }

            session.isProcessed = true;
            await session.save();
        }

        res.json(session);

    } catch (error) {
        console.error("Error fetching leaderboard data:", error);
        return res.status(500).send("Internal Server Error");
    }
};