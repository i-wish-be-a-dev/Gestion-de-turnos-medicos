import React from 'react';
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './Components/Shared/Layout'
import Login from './Components/Auth/Login'
import { ProtectedRoute } from './Components/ProtectedRoute'

// Admin Components
import AdminDashboard from './Components/Admin/AdminDashboard'
import GestionTurnos from './Components/Admin/GestionTurnos'
import GestionPacientes from './Components/Admin/GestionPacientes'
import GestionDoctores from './Components/Admin/GestionDoctores'
import GestionUsuarios from './Components/Admin/GestionUsuarios'

// Doctor Components
import DoctorDashboard from './Components/Doctor/DoctorDashboard'
import DoctorMisTurnos from './Components/Doctor/MisTurnos'
import DoctorMiPerfil from './Components/Doctor/MiPerfil'

// Paciente Components
import PacienteDashboard from './Components/Paciente/PacienteDashboard'
import PacienteMisTurnos from './Components/Paciente/MisTurnos'
import ReservarTurno from './Components/Paciente/ReservarTurno'
import PacienteMiPerfil from './Components/Paciente/MiPerfil'

function App() {
  const userRole = localStorage.getItem("role");

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="turnos" replace />} />
          <Route path="dashboard" element={<Navigate to="/admin/turnos" replace />} />
          <Route path="turnos" element={<GestionTurnos />} />
          <Route path="pacientes" element={<GestionPacientes />} />
          <Route path="doctores" element={<GestionDoctores />} />
          <Route path="usuarios" element={<GestionUsuarios />} />
        </Route>

        {/* Doctor Routes */}
        <Route
          path="/doctor"
          element={
            <ProtectedRoute requiredRole="DOCTOR">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DoctorDashboard />} />
          <Route path="mis-turnos" element={<DoctorMisTurnos />} />
          <Route path="perfil" element={<DoctorMiPerfil />} />
        </Route>

        {/* Paciente Routes */}
        <Route
          path="/paciente"
          element={
            <ProtectedRoute requiredRole="PACIENTE">
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<PacienteDashboard />} />
          <Route path="mis-turnos" element={<PacienteMisTurnos />} />
          <Route path="reservar-turno" element={<ReservarTurno />} />
          <Route path="perfil" element={<PacienteMiPerfil />} />
        </Route>

        {/* Default Routes - Redirect based on role */}
        <Route
          path="/dashboard"
          element={
            userRole === "ADMIN" ? (
              <Navigate to="/admin/turnos" />
            ) : userRole === "DOCTOR" ? (
              <Navigate to="/doctor/dashboard" />
            ) : userRole === "PACIENTE" ? (
              <Navigate to="/paciente/dashboard" />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
