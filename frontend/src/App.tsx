import { useState,useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useAuthStore } from './store/Authstore.ts'
import LandingPage from './pages/Landingpage.tsx'
import SignupPage from './pages/Signuppage.tsx'
import { Route, Routes,Navigate, Router } from 'react-router-dom'


function App() {

  const {Authuser} = useAuthStore();

  useEffect(()=>{
    console.log(Authuser);
  },[])

  return (
    <div>
      
        <Routes>
          <Route path = "/" element={Authuser ? <LandingPage /> : <Navigate to="/signup" />} />
          <Route path = "/signup" element={<SignupPage />} />
        </Routes> 

    </div>
    
    
  )
  
}

export default App
