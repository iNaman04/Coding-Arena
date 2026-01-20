import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useAuthStore } from './store/Authstore.ts'
import LandingPage from './pages/Landingpage.tsx'
import SignupPage from './pages/Signuppage.tsx'
import { Route, Routes, Navigate, Router } from 'react-router-dom'
import HomePage from './pages/Homepage.tsx'
import LoginPage from './pages/Loginpage.tsx'
import { socket } from './libs/sockets.ts'
import { useNavigate } from 'react-router-dom';
import Battlepage from './pages/Battlepage.tsx'

function App() {

  const { Authuser, checkAuth } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    checkAuth();
  }, [])

  useEffect(() => {
    socket.on("session-started", ({ sessionId }) => {
      console.log("Session started:", sessionId);
      navigate(`/battle/${sessionId}`);
    });

    return () => {
      socket.off("session-started");
    };
  }, []);

  return (
    <div>

      <Routes>
        {/* Public routes (only for logged-out users) */}
        <Route path="/" element={!Authuser ? <LandingPage /> : <Navigate to="/home" />} />
        <Route path="/login" element={!Authuser ? <LoginPage /> : <Navigate to="/home" />} />
        <Route path="/signup" element={!Authuser ? <SignupPage /> : <Navigate to="/home" />} />

        <Route path="/home" element={Authuser ? <HomePage /> : <Navigate to="/" />} />

      </Routes>

    </div>


  )

}

export default App
