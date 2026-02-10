import express from 'express';
import Session from '../models/session.js';
import Problem from '../models/problems.js';

export const getLeaderBoardData = async (req, res) => {
    try {
        const session = await Session.findById(req.params.sessionId).populate("problem").populate("players", "username");
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }

        const userMap = {};
        
        session.players.forEach(player => {
            userMap[player._id.toString()] = player.username;
        });

        const results = session.submissions.map(sub => {
            const userIdStr = sub.userId.toString();
            return {
                userId: userIdStr,
                username: userMap[userIdStr] || `User ${userIdStr.slice(-4)}`,
                timeTaken: sub.timeTaken,
                testsPassed: sub.testPassed,
                totalTests: sub.totalTests,
                isCorrect: sub.isCorrect, // true or false
                submittedAt: sub.submittedAt,
                code: sub.code
            }
        });

        results.sort((a, b) => {
            if (b.testsPassed !== a.testsPassed) {
                return b.testsPassed - a.testsPassed;
            }
            return a.timeTaken - b.timeTaken;
        })

        res.status(200).json({
            problemId: session.problem,
            difficulty: session.difficulty,
            players: results,
            winnerId: results[0].testsPassed > 0 ? results[0].userId : null
        });


    } catch (error) {
        res.status(500).json({ message: "Failed to fetch leaderboard data", error: error.message });
    }
}