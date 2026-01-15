import React from "react";
import {create} from "zustand";
import  axiosInstance  from "../libs/axios.ts";
const BASE_URL = "http://localhost:3000";

interface AuthState {
  Authuser: any;
  checkAuth: () => Promise<void>;
}


export const useAuthStore = create<AuthState>((set) => ({
  Authuser: null,
  
  checkAuth : async()=>{
    try {
        const response = await axiosInstance.get("/auth/check-auth");
        set({Authuser: response.data});
        console.log(response);
        
    } catch (error) {
        set({Authuser: null});
        console.error("Error checking auth:", error);
    }
  }





}));
