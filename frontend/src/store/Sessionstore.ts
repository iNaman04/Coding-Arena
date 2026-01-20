import { create } from "zustand";
import axiosInstance from "../libs/axios.ts";


interface JoinSessionResponse {
    inviteCode: string;
    sessionId: string;
    status: string;
}

interface SessionState {
    sessionCode: string | null;
    sessionId: string | null;
    status: string | null;
    createSession: (difficulty: string) => Promise<void>;
    clearSession: () => void;
    joinSession: (code: string) => Promise<JoinSessionResponse>;

}

export const useSessionstore = create<SessionState>((set) => ({
    sessionCode: null,
    sessionId: null,
    status: null,
    createSession: async (difficulty) => {
        try {
            const response = await axiosInstance.post("/sessions/create", { difficulty });
            set({ sessionCode: response.data.inviteCode });
            console.log("Session created with code:", response.data.inviteCode);

        } catch (error) {
            set({ sessionCode: null });
            console.error("Failed to create session:", error);
        }
    },
    clearSession: () => set({ sessionCode: null }),
    joinSession: async (code) => {
        try {
            const response = await axiosInstance.post("/sessions/join", { inviteCode: code });
            set({
                sessionCode: response.data.inviteCode,
                sessionId: response.data.sessionId,
                status: response.data.status
            })
            console.log("session joined successfully");
            return response.data;
        } catch (error) {
            console.error("Failed to join session:", error);
            throw error;
        }

    }}));