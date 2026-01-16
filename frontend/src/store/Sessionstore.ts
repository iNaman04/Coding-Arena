import {create} from "zustand";
import  axiosInstance  from "../libs/axios.ts";


interface SessionState {
  sessionCode: string | null;
  createSession: () => Promise<void>;
}

export const useSessionstore = create<SessionState>((set) => ({
  sessionCode: null,
  createSession : async () =>{
    try {
        const response = await axiosInstance.post("/session/create");
        set({sessionCode: response.data.inviteCode});
        console.log("Session created with code:", response.data.inviteCode);

    } catch (error) {
        set({sessionCode: null});
        console.error("Failed to create session:", error);
    }
  }
}));