import { create } from "zustand";
import axiosInstance from "../libs/axios.ts";
import {socket} from "../libs/sockets.ts";
import { AxiosError } from "axios";


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
    checkActiveSession : () => Promise<any>;

}

export const useSessionstore = create<SessionState>((set) => ({
    sessionCode: null,
    sessionId: null,
    status: null,
    createSession: async (difficulty) => {
        try {
            const response = await axiosInstance.post("/sessions/create", { difficulty });
            socket.emit("join-session-room", response.data.sessionId);    
            set({ sessionCode: response.data.inviteCode,
                sessionId: response.data.sessionId,
                status: response.data.status
             });
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
            socket.emit("join-session-room", response.data.sessionId);
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

    },

    checkActiveSession : async() =>{
        try {
            const response = await axiosInstance.get("/sessions/active-session");
            if(response.data.sessionId){
                console.log("this is session Id", response.data.sessionId);
                
                set({
                    sessionId : response.data.sessionId,
                    sessionCode : response.data.inviteCode,
                    status : response.data.status
                })
                return response.data.sessionId;
            }
        } catch (error : any) {
            if(error.response?.status === 401){
                return 
            }
            console.log(error);
            
        }
    }

}));