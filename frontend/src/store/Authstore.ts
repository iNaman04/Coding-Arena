import React from "react";
import {create} from "zustand";
import  axiosInstance  from "../libs/axios.ts";
const BASE_URL = "http://localhost:3000";
import toast from "react-hot-toast";


interface AuthState {
  Authuser: any;
  signup: (data: any) => Promise<void>;
  checkAuth: () => Promise<void>;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
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

  login: async(data)=>{
    try {
      const response  = await axiosInstance.post("/auth/login", data);
      set({Authuser: response.data});
      toast.success("User logged in successfully");
    } catch (error) {
      toast.error("Login failed");
      set({Authuser: null});
      console.error("Error during login:", error);
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
  ,
  logout : async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({Authuser: null});
      toast.success("User logged out successfully");   
    } catch (error) {
      toast.error("Logout failed");
      console.error("Error during logout:", error);
    }
  }
  


}));
