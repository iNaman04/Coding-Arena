import { useState, useEffect, use } from 'react'
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
import { useSessionstore } from './store/Sessionstore.ts'
import { Loader } from 'lucide-react'
import Leaderboard from './pages/Leaderboard.tsx'

function App() {

  const { Authuser, checkAuth, isCheckingAuth, logout } = useAuthStore();
  const { checkActiveSession } = useSessionstore();
  const navigate = useNavigate();



  useEffect(() => {
    checkAuth();
  }, [])

 
  useEffect(() => {
  
    if (!isCheckingAuth && Authuser?.id) {

      if (!socket.connected) {
        socket.connect();
      }

      const doSetup = () => {
        console.log("Sending setup for user ID:", Authuser.id);
        socket.emit("setup", Authuser.id);
      };

      if (socket.connected) doSetup();

      socket.on("connect", doSetup);

      socket.on("force_logout", (data) => {
        alert(data.message);
        logout();
        navigate("/", { replace: true });
      });

      return () => {
        socket.off("connect", doSetup);
        socket.off("force_logout");
      };
    }
  }, [Authuser, isCheckingAuth, logout, navigate]);

  useEffect(() => {
    const handleSessionStarted = ({ sessionId }: { sessionId: string }) => {
      navigate(`/battle/${sessionId}`);
    };

    socket.on("session-started", handleSessionStarted);

    return () => {
      socket.off("session-started", handleSessionStarted);
    };
  }, [navigate]);

  useEffect(() => {
    const restoreSession = async () => {

      if (isCheckingAuth || !Authuser) return;

      const sessionId = await checkActiveSession();
      if (sessionId) {
        socket.emit("join-session-room", sessionId);
        //navigate(`/battle/${response.sessionId}`);
        console.log("Session restored", sessionId);

      }
    }
    restoreSession();
  }, [Authuser, isCheckingAuth, checkActiveSession])

  if (isCheckingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }


  return (
    <div  className="w-full min-h-screen">

      <Routes>
        {/* Public routes (only for logged-out users) */}
        <Route path="/" element={!Authuser ? <LandingPage /> : <Navigate to="/home" />} />
        <Route path="/login" element={!Authuser ? <LoginPage /> : <Navigate to="/home" />} />
        <Route path="/signup" element={!Authuser ? <SignupPage /> : <Navigate to="/home" />} />

        <Route path="/home" element={Authuser ? <HomePage /> : <Navigate to="/" />} />
        <Route path="/battle/:sessionId" element={Authuser ? <Battlepage /> : <Navigate to="/" />} />
        <Route path="/leaderboard/:sessionId" element={Authuser ? <Leaderboard /> : <Navigate to="/" />} />
      </Routes>

    </div>


  )

}

export default App
