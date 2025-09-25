import React, { useState } from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Components/Navbar'
import TurnosList from './Components/TurnoList'
import TurnoForm from './Components/TurnoForm'
import Login from './Components/Login';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-5">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/turno/nuevo" element={<TurnoForm />} />
          <Route path="/turno/:id/edit" element={<TurnoForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
