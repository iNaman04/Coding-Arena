import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    inviteCode: { type: String, required: true, unique: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    status: { type: String, enum: ['WAITING', 'ACTIVE', 'COMPLETED'], default: 'WAITING' },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', default: null },

    difficulty: {
        type: String,
        enum: ["easy", "medium", "hard"],
        required: true
    },

    startTime: Date,
    winnerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
    ,
    submissions: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            timeTaken: Number,
            isCorrect: Boolean,
            code: String,
            submittedAt: { type: Date, default: Date.now },
            testPassed: Number,
            totalTests: Number
        }
    ]

}, { timestamps: true });

const Session = mongoose.model(("Session"), sessionSchema);
export default Session;