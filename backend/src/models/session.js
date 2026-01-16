import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  inviteCode: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['WAITING', 'ACTIVE', 'COMPLETED'], default: 'WAITING' },
  problemID: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', default: null },
  startTime: Date,
  winnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }

}, { timestamps: true });

const Session = mongoose.model(("Session"), sessionSchema);
export default Session;