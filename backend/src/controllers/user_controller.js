import User from "../models/user_model.js";
import Session from "../models/session.js";

const formatDifficulty = (diff) => {
    const d = (diff || "").toLowerCase();
    return d.charAt(0).toUpperCase() + d.slice(1);
};

const formatTimeTaken = (seconds) => {
    if (seconds == null) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const formatJoinDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const calculateStreaks = (sessions, userId) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let countingCurrent = true;

    for (const session of sessions) {
        const won = session.winnerId?.toString() === userId.toString();
        if (won) {
            tempStreak++;
            if (countingCurrent) currentStreak++;
        } else {
            if (countingCurrent) countingCurrent = false;
            longestStreak = Math.max(longestStreak, tempStreak);
            tempStreak = 0;
        }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    return { currentStreak, longestStreak };
};

export const getUserInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in getMe controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select("-password");
        if (!user) return res.status(404).json({ message: "User not found" });

        const completedSessions = await Session.find({
            players: userId,
            status: "COMPLETED",
        })
            .populate("problem", "title difficulty")
            .populate("players", "username")
            .sort({ updatedAt: -1 });

        const { currentStreak, longestStreak } = calculateStreaks(completedSessions, userId);

        const solvedProblems = new Set();
        let easyProblems = 0;
        let mediumProblems = 0;
        let hardProblems = 0;

        for (const session of completedSessions) {
            if (session.winnerId?.toString() === userId.toString() && session.problem) {
                const probId = session.problem._id.toString();
                if (!solvedProblems.has(probId)) {
                    solvedProblems.add(probId);
                    const diff = (session.problem.difficulty || session.difficulty).toUpperCase();
                    if (diff === "EASY") easyProblems++;
                    else if (diff === "MEDIUM") mediumProblems++;
                    else hardProblems++;
                }
            }
        }

        const recentBattles = completedSessions.slice(0, 10).map((session) => {
            const opponent = session.players.find(
                (p) => p._id.toString() !== userId.toString()
            );
            const submission = session.submissions.find(
                (s) => s.userId.toString() === userId.toString()
            );
            const won = session.winnerId?.toString() === userId.toString();

            return {
                id: session._id,
                problemTitle: session.problem?.title || "Unknown Problem",
                difficulty: formatDifficulty(session.problem?.difficulty || session.difficulty),
                opponent: opponent?.username || "Unknown",
                result: won ? "win" : "loss",
                timeTaken: formatTimeTaken(submission?.timeTaken),
                date: session.updatedAt,
            };
        });

        const losses = Math.max(0, user.totalBattles - user.wins);
        const winRate = user.totalBattles > 0
            ? Math.round((user.wins / user.totalBattles) * 1000) / 10
            : 0;

        res.status(200).json({
            username: user.username,
            email: user.email,
            joinDate: formatJoinDate(user.createdAt),
            bio: user.bio || "",
            stats: {
                totalBattles: user.totalBattles,
                wins: user.wins,
                losses,
                winRate,
                currentStreak,
                longestStreak,
                totalProblems: solvedProblems.size,
                easyProblems,
                mediumProblems,
                hardProblems,
                exp: user.exp,
            },
            recentBattles,
        });
    } catch (error) {
        console.error("Error in getProfile:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const { bio } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user._id,
            { bio: bio?.trim() || "" },
            { new: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ bio: user.bio });
    } catch (error) {
        console.error("Error in updateProfile:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
