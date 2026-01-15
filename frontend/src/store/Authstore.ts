import React from "react";
import {create} from "zustand";
import  axiosInstance  from "../libs/axios.ts";
const BASE_URL = "http://localhost:3000";
import toast from "react-hot-toast";
import { data } from "react-router";

interface AuthState {
  Authuser: any;
  signup: (data: any) => Promise<void>;
  checkAuth: () => Promise<void>;
}


export const useAuthStore = create<AuthState>((set) => ({
  Authuser: null,
  
  signup : async(data)=>{
    try {
        const response = await axiosInstance.post("/auth/signup", data);
        set({Authuser: response.data});
        toast.success("User authenticated successfully");
        console.log(response);
        
    } catch (error) {
        set({Authuser: null});
        toast.error("Signup failed");
        console.error("Error checking auth:", error);
    }
  },

  checkAuth: async () => {
    try {
      const response = await axiosInstance.get("/auth/check-auth");
      set({ Authuser: response.data });
    } catch (error) {
      set({ Authuser: null });
    }
  }





}));
