import { Server } from "socket.io";
import User from "../models/user_model.js";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        socket.on("join-session-room", (sessionId) => {
            socket.join(sessionId);
            console.log(`Socket ${socket.id} joined room ${sessionId}`);
        });

        socket.on("setup", async (userId) => {
            try {

                if (!userId || userId === "null" || userId === "undefined") {
                    console.log("⚠️ Setup blocked: Received invalid userId");
                    return;
                }

                // Capture the result in a variable named 'updatedUser'
                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { currentSocketId: socket.id },
                    { new: true } // This option returns the updated document instead of the old one
                );

                if (updatedUser) {
                    console.log(`✅ DB Updated: User ${updatedUser.username} linked to Socket ${socket.id}`);
                } else {
                    console.log(`❌ Setup failed: No user found with ID ${userId}`);
                }
            } catch (error) {
                console.error("❌ Socket setup error:", error);
            }
        });

        socket.on("disconnect", async () => {
            console.log("Socket disconnected:", socket.id);
            await User.findOneAndUpdate({ currentSocketId: socket.id }, { currentSocketId: null });

        });
    });

    return io;
};

export const getIO = () => io;
